import crypto from "node:crypto";
import { ATTRIBUTION_FIELDS } from "./attribution";
import type { DeliveryResult, Lead } from "./lead";
import { pageLabel } from "./lead";

/**
 * Records a landing-page enquiry in Pulse's LEAD PIPELINE as a Lead.
 *
 * Distinct from `syncLeadToPulse`, and both run. That one posts to
 * `POST /public/leads`, which creates a Contact, a Company and an unassigned
 * Deal — the pipeline the sales team works today. This posts to
 * `POST /public/lead-capture`, which creates a `Lead` row that enters the
 * Marketing → Sales qualification board at stage Lead, carries first-touch
 * attribution, and notifies the Marketing owner.
 *
 * They are separate endpoints in Pulse on purpose: the deal route is a fixed
 * production contract shared with another brand, and widening it to take the
 * seven attribution fields would change that contract for no benefit. The
 * consequence to know about is that ONE enquiry now produces TWO records —
 * a Deal and a Lead — which is the accepted cost of not taking the existing
 * pipeline away from sales while the Lead Pipeline beds in.
 *
 * Same HMAC-SHA256-over-the-raw-body scheme and the same shared secret as the
 * deal sync, so there is no second credential to rotate.
 *
 * Env-gated and never throws.
 */
export async function captureLeadInPulse(lead: Lead): Promise<DeliveryResult> {
  if (process.env.PULSE_LEAD_CAPTURE_ENABLED !== "true") return "skipped";

  const url = process.env.PULSE_SYNC_URL;
  const secret = process.env.PULSE_SYNC_SECRET;
  if (!url || !secret) {
    console.warn(
      "[pulse-lead] PULSE_LEAD_CAPTURE_ENABLED=true but PULSE_SYNC_URL / PULSE_SYNC_SECRET are not set — skipping"
    );
    return "skipped";
  }

  const body = JSON.stringify(buildCapturePayload(lead));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/public/lead-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Pulse-Signature": signature },
      body,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const retryable = res.status >= 500 || res.status === 408 || res.status === 429;
      console.error(
        `[pulse-lead] capture ${retryable ? "failed" : "rejected (permanent)"}`,
        res.status,
        detail
      );
      return "failed";
    }
    return "delivered";
  } catch (err) {
    console.error("[pulse-lead] capture failed", err);
    return "failed";
  }
}

/**
 * Pulse rejects a phone it cannot identify anyone by — at least six digits,
 * and nothing but the characters a number is written with.
 *
 * This form does NOT validate phone: it is required in the browser and
 * deliberately not enforced server-side, because a name and a working email
 * are enough to follow up on and rejecting the request would throw the enquiry
 * away. So "call me" and "n/a" really do arrive here, and passing one on would
 * make Pulse 400 the WHOLE submission — losing a lead over a field it did not
 * need, since the email alone satisfies its identity rule.
 *
 * Dropping the value is therefore strictly better than forwarding it. The
 * unusable text is still in the enquiry message and in the Deal, so nothing is
 * lost that anyone can act on.
 */
const MIN_PHONE_DIGITS = 6;
const PULSE_PHONE = new RegExp(`^(?=(?:\\D*\\d){${MIN_PHONE_DIGITS},})\\+?[\\d\\s().-]+$`);

export function usablePhone(phone: string): string | undefined {
  const trimmed = phone.trim();
  return trimmed && PULSE_PHONE.test(trimmed) ? trimmed : undefined;
}

/**
 * Exported for the contract-capture script, which drives the real producer
 * rather than rebuilding this by hand.
 */
export function buildCapturePayload(lead: Lead): Record<string, string | undefined> {
  const label = pageLabel(lead.source);

  const payload: Record<string, string | undefined> = {
    // The same id the deal sync uses, which is what makes a retry of one
    // resolve to the record the other already created rather than duplicating.
    submissionId: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    phone: usablePhone(lead.phone),
    company: lead.company || undefined,
    jobTitle: lead.jobTitle || undefined,
    // Which FORM this was. Every landing page has exactly one, so the page
    // names it; Pulse renders this string verbatim in the lead's Enquiry
    // section, so it is written for a person to read.
    sourceForm: `Upscalix — ${label}`,
    // What they are asking FOR, which is a different question from which form
    // they filled in — and on these pages the page itself is the answer.
    serviceInterest: label,
    enquiryMessage:
      [lead.roles ? `Roles required: ${lead.roles}` : "", lead.details]
        .filter(Boolean)
        .join("\n\n") || undefined,
    landingPage: lead.landingPage || undefined,
  };

  // Omitted rather than sent empty: Pulse stores "" as a captured value, so a
  // direct visit would read as attributed to a campaign with a blank name
  // instead of "Not captured".
  for (const field of ATTRIBUTION_FIELDS) {
    const value = lead.attribution[field];
    if (value) payload[field] = value;
  }

  return payload;
}
