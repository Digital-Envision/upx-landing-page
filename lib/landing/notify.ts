import type { DeliveryResult, Lead } from "./lead";
import { pageLabel } from "./lead";

const SMTP2GO_ENDPOINT = "https://api.smtp2go.com/v3/email/send";

function esc(value: string): string {
  return value.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!
  );
}

/**
 * Emails the internal team a new landing-page enquiry via SMTP2GO. Env-gated
 * and never throws.
 */
export async function notifyLead(lead: Lead): Promise<DeliveryResult> {
  if (process.env.NOTIFY_EMAIL_ENABLED !== "true") return "skipped";

  const apiKey = process.env.SMTP2GO_API_KEY;
  const sender = process.env.NOTIFY_EMAIL_FROM;
  const recipients = (process.env.NOTIFY_EMAIL_TO ?? "")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  if (!apiKey || !sender || recipients.length === 0) {
    console.warn(
      "[notify] NOTIFY_EMAIL_ENABLED=true but SMTP2GO_API_KEY / NOTIFY_EMAIL_FROM / NOTIFY_EMAIL_TO are not all set — skipping email"
    );
    return "skipped";
  }

  const page = pageLabel(lead.source);
  const subject = `New enquiry — ${page} — ${lead.fullName}`;
  const rows: [string, string][] = [
    ["Page", page],
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Company", lead.company || "—"],
    ...(lead.roles ? ([["Roles required", lead.roles]] as [string, string][]) : []),
    ["Details", lead.details || "—"],
    ["Submitted", lead.submittedAt],
    ["Reference", lead.id],
  ];

  const textBody = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const htmlBody =
    `<h2>New enquiry from the ${esc(page)} landing page</h2><ul>` +
    rows.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("") +
    `</ul>`;

  try {
    const res = await fetch(SMTP2GO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        sender,
        to: recipients,
        subject,
        text_body: textBody,
        html_body: htmlBody,
        custom_headers: [{ header: "Reply-To", value: lead.email }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[notify] SMTP2GO responded non-2xx", res.status, detail);
      return "failed";
    }
    return "delivered";
  } catch (err) {
    console.error("[notify] email send failed", err);
    return "failed";
  }
}
