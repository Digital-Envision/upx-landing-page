import crypto from "node:crypto";
import type { DeliveryResult, Lead } from "./lead";
import { pageLabel, splitName } from "./lead";

/**
 * Pushes a landing-page enquiry into Pulse (the Virtual-Office CRM) as a lead —
 * a Contact, an optional Company, and an unassigned Deal in the New stage.
 *
 * Posts to `POST /public/leads`, authenticated by an HMAC-SHA256 of the exact
 * request body under PULSE_SYNC_SECRET, the same scheme vafe-landing uses for
 * its checkout sync. `leadId` is the idempotency key: Pulse stores it on the
 * deal behind a unique index, so a retry resolves to the original deal rather
 * than creating a duplicate.
 *
 * Pulse picks the pipeline from the brand's default, overridden per page where
 * that default is wrong — custom software is a Project, everything else Staff.
 *
 * **OFF by default since CU-14ymjnvz3wn.** QA reported that one website
 * enquiry produces four records — a Lead, and a Contact, Company and Deal —
 * and the Lead Pipeline PRD defines no such conversion: at NCA it records the
 * deal value and service purchased as FIELDS ON THE LEAD, and §4 puts any
 * change to Contacts out of scope entirely. Creating them up front pre-empts a
 * qualification decision nobody has made yet.
 *
 * **This is not a final decision, so the code stays.** Set
 * `PULSE_DEAL_SYNC_ENABLED=true` to turn deal creation back on; nothing else
 * changed, and an enquiry sent with it on behaves exactly as before.
 *
 * The flag is a NEW name rather than flipping `PULSE_SYNC_ENABLED`, for two
 * reasons. The old name is set to `true` in the deployed environment, so
 * reusing it would mean this change did nothing until somebody edited a GitHub
 * secret — the code would say one thing and the running site another. And
 * `PULSE_SYNC_ENABLED` / `PULSE_LEAD_CAPTURE_ENABLED` was never a legible pair
 * once there were two Pulse destinations; `PULSE_DEAL_SYNC_ENABLED` says which
 * record it makes.
 *
 * Only the Upscalix pages are affected. `/public/leads` is unchanged and still
 * serves VA For Everyone and Scalout from their own repositories.
 *
 * Env-gated and never throws.
 */
export async function syncLeadToPulse(lead: Lead): Promise<DeliveryResult> {
  if (process.env.PULSE_DEAL_SYNC_ENABLED !== "true") {
    // Named explicitly rather than ignored. An environment still carrying the
    // retired flag is one somebody set deliberately, and silently doing
    // nothing about it is how an afternoon gets lost to "why are there no
    // deals" — the answer being a variable that no longer exists.
    if (process.env.PULSE_SYNC_ENABLED === "true") {
      console.warn(
        "[pulse] PULSE_SYNC_ENABLED is set but no longer read — deal creation " +
          "is off (CU-14ymjnvz3wn). Set PULSE_DEAL_SYNC_ENABLED=true to restore it."
      );
    }
    return "skipped";
  }

  const url = process.env.PULSE_SYNC_URL;
  const secret = process.env.PULSE_SYNC_SECRET;
  if (!url || !secret) {
    console.warn(
      "[pulse] PULSE_DEAL_SYNC_ENABLED=true but PULSE_SYNC_URL / PULSE_SYNC_SECRET are not set — skipping"
    );
    return "skipped";
  }

  const { firstName, lastName } = splitName(lead.fullName);
  const payload = {
    leadId: lead.id,
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.company,
    // Pulse serves three brands from one endpoint. `brand` carries the deal and
    // record source; `source` is a free-form page slug, so launching a landing
    // page no longer needs Pulse redeployed to accept it. `sourceLabel` names
    // the deal — it lives here because this repo owns the page and its name.
    brand: "upscalix",
    source: lead.source,
    sourceLabel: pageLabel(lead.source),
    notes: [lead.roles ? `Roles required: ${lead.roles}` : "", lead.details]
      .filter(Boolean)
      .join("\n\n"),
  };

  const body = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Pulse-Signature": signature },
      body,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // 4xx (bad signature / invalid payload) is permanent; don't report it as
      // a transient failure the caller should retry.
      const retryable = res.status >= 500 || res.status === 408 || res.status === 429;
      console.error(
        `[pulse] sync ${retryable ? "failed" : "rejected (permanent)"}`,
        res.status,
        detail
      );
      return "failed";
    }
    return "delivered";
  } catch (err) {
    console.error("[pulse] sync failed", err);
    return "failed";
  }
}
