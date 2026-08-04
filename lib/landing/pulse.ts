import crypto from "node:crypto";
import type { DeliveryResult, Lead } from "./lead";
import { pageLabel, splitName } from "./lead";

/**
 * Pushes a landing-page enquiry into Pulse (the Virtual-Office CRM) as a Deal,
 * using the same HMAC-signed public-endpoint pattern as vafe-landing's
 * syncToPulse().
 *
 * NOTE: Pulse currently exposes `POST /public/stripe/purchase`, which is
 * purchase-shaped (it requires a Stripe session id and stamps
 * DealSource.VAFE_LANDING_PAGE). This posts to `POST /public/leads` instead —
 * an endpoint that still needs to be added on the Pulse side. Until it exists,
 * leave PULSE_SYNC_ENABLED=false; the email and spreadsheet paths work on their
 * own. The required backend change is written up in
 * docs/landing-page-integrations.md.
 *
 * Env-gated and never throws.
 */
export async function syncLeadToPulse(lead: Lead): Promise<DeliveryResult> {
  if (process.env.PULSE_SYNC_ENABLED !== "true") return "skipped";

  const url = process.env.PULSE_SYNC_URL;
  const secret = process.env.PULSE_SYNC_SECRET;
  if (!url || !secret) {
    console.warn(
      "[pulse] PULSE_SYNC_ENABLED=true but PULSE_SYNC_URL / PULSE_SYNC_SECRET are not set — skipping"
    );
    return "skipped";
  }

  const { firstName, lastName } = splitName(lead.fullName);
  const payload = {
    leadId: lead.id,
    firstName,
    lastName,
    email: lead.email,
    phone: "",
    companyName: lead.company,
    source: "upscalix_landing_page",
    pageName: pageLabel(lead.source),
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
