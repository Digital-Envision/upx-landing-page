/**
 * Outcome of one delivery attempt.
 *
 * "skipped" is deliberately distinct from "delivered": a destination that is
 * switched off must not be counted as having received the lead, otherwise a
 * single enabled-but-failing destination would still report success to the
 * visitor and the enquiry would be lost with only a log line behind it.
 */
export type DeliveryResult = "delivered" | "skipped" | "failed";

/** The normalised shape every downstream integration receives. */
export interface Lead {
  /** Stable idempotency key, also used as the Pulse dedupe key. */
  id: string;
  /** Landing page slug the enquiry came from. */
  source: string;
  fullName: string;
  email: string;
  company: string;
  /** Only present on offshore-developers, which has a "Roles Required" field. */
  roles: string;
  details: string;
  submittedAt: string;
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) ?? "" };
}

const PAGE_LABELS: Record<string, string> = {
  "it-outsourcing": "IT Outsourcing",
  "offshore-developers": "Offshore Developers",
  "custom-software-development": "Custom Software Development",
};

export function pageLabel(source: string): string {
  return PAGE_LABELS[source] ?? source;
}
