import crypto from "node:crypto";
import type { DeliveryResult, Lead } from "./lead";
import { splitName } from "./lead";

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
 * Pulse picks the pipeline from `source` — the two staffing pages route to
 * Staff, custom software to Project.
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
    companyName: lead.company,
    // The page slug, not a display name — Pulse maps it to a pipeline.
    source: lead.source,
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
