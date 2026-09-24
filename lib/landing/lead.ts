import type { Attribution } from "./attribution";
import type { LandingSlug } from "./content";

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
  /** Required in the form, but never enforced server-side — see the API route. */
  phone: string;
  company: string;
  /**
   * Job title. Collected on EVERY form since CU-14ymjnvz37v, because Pulse's
   * Lead record and its manual-entry form both carry the field and a website
   * lead arriving with it null was the only difference between the two.
   * Optional, like `company`.
   */
  jobTitle: string;
  /**
   * The one page-specific field, on offshore-developers only ("Roles
   * Required"). Extras are allowed — what is not allowed is an extra with no
   * defined home in the Lead record, so this one is prefixed into the enquiry
   * message on both producers. See docs/landing-page-integrations.md.
   */
  roles: string;
  details: string;
  submittedAt: string;
  /**
   * First-touch campaign parameters, captured in the browser on arrival.
   *
   * Always present, empty strings for a direct visit — Pulse records these
   * write-once when the lead is created and offers no way to fill them in
   * later, so "we did not capture any" is a real answer that has to travel
   * with the enquiry rather than being left undefined.
   */
  attribution: Attribution;
  /** The page the visitor ARRIVED on, which is not always the one they submit from. */
  landingPage: string;
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) ?? "" };
}

/**
 * Human-readable page names for the notification email's subject and the
 * spreadsheet's `page` column. Typed against LandingSlug (a type-only import,
 * so nothing extra is pulled into the API route at runtime) — adding a landing
 * page without a label here is a compile error rather than an email that reads
 * "New enquiry — mobile-app-development".
 */
const PAGE_LABELS: Record<LandingSlug, string> = {
  "it-outsourcing": "IT Outsourcing",
  "offshore-developers": "Offshore Developers",
  "custom-software-development": "Custom Software Development",
  "dedicated-development-teams": "Dedicated Development Teams",
  "mobile-app-development": "Mobile App Development",
};

export function pageLabel(source: string): string {
  return PAGE_LABELS[source as LandingSlug] ?? source;
}
