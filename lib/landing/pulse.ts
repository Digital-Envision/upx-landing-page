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
 * **Two independent switches since CU-14ymjnvz3wn.** The endpoint writes three
 * records in one request, and QA wanted them separated:
 *
 * - `PULSE_CRM_SYNC_ENABLED` decides whether this call happens at all, which
 *   is what creates the **Contact** and the **Company**. Falls back to the
 *   retired `PULSE_SYNC_ENABLED`, which is what deployed environments already
 *   carry — so this keeps working with no secret edit, and the clearer name is
 *   what new environments set.
 * - `PULSE_DEAL_SYNC_ENABLED` decides whether that same call also opens a
 *   **Deal**, by sending `createDeal` on the payload. Unset means no deal.
 *
 * Why the Deal is the one switched off: an Upscalix enquiry enters the Lead
 * Pipeline as a Lead (`POST /public/lead-capture`), where opening a Deal is
 * something a human does once the lead is qualified — doing it here pre-empts
 * that decision, and the Lead Pipeline PRD records a won lead's value and
 * service as fields ON the lead rather than as a separate record. The Contact
 * and the Company are wanted either way: a person and an organisation really
 * did get in touch.
 *
 * Splitting them needed a change at BOTH ends. The three writes share one
 * request and one transaction, so nothing this repo could do alone would keep
 * two of them and drop the third — hence `createDeal` on the Pulse DTO, where
 * **absent means true** so VA For Everyone and Scalout, which post from their
 * own repositories, carry on unchanged.
 *
 * Env-gated and never throws.
 */
export async function syncLeadToPulse(lead: Lead): Promise<DeliveryResult> {
  // Empty means NOT CONFIGURED, so it falls through to the legacy name.
  //
  // `??` was wrong here and shipped broken. cd-staging.yml writes every key
  // unconditionally — `PULSE_CRM_SYNC_ENABLED=$PULSE_CRM_SYNC_ENABLED` — so a
  // secret that does not exist arrives as the EMPTY STRING, not as absent.
  // `""` is neither null nor undefined, so `??` kept it, the fallback never
  // fired, and the call was skipped on a deployment whose legacy flag was
  // `true` the whole time: no Contact and no Company.
  //
  // The distinction `??` protects — "explicitly blank" versus "not set" — does
  // not exist in a .env this workflow generates, because there is no way to
  // omit a key from it.
  const crmSync =
    process.env.PULSE_CRM_SYNC_ENABLED?.trim() ||
    process.env.PULSE_SYNC_ENABLED?.trim();
  if (crmSync !== "true") return "skipped";

  // Strict equality, like every other flag here: `TRUE` and `1` are off, so a
  // typo fails closed and cannot silently start opening deals again.
  const createDeal = process.env.PULSE_DEAL_SYNC_ENABLED === "true";

  const url = process.env.PULSE_SYNC_URL;
  const secret = process.env.PULSE_SYNC_SECRET;
  if (!url || !secret) {
    console.warn(
      "[pulse] CRM sync is enabled but PULSE_SYNC_URL / PULSE_SYNC_SECRET are not set — skipping"
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
    // Sent explicitly in both directions rather than omitted when true. The
    // field is the only thing on the wire that says whether this producer
    // knows about the split at all, and the contract test pins it.
    createDeal,
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
