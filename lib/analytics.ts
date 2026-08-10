import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Google Tag Manager container. The ID is public by nature (it ships in the
 * page source), so it is committed as the default rather than being required
 * config — an env override exists so preview/staging deploys can point at a
 * different container, or set it empty to load no tag at all.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PJBWM82";

/**
 * Fires the GA4-standard `generate_lead` conversion. Call this only after the
 * server has confirmed the enquiry — firing on submit-click would count bot
 * traffic and validation failures as conversions.
 *
 * `lead_source` carries the landing-page slug so conversions can be attributed
 * per page in GA4/Ads without a separate tag per form.
 */
export function trackGenerateLead(leadSource: string) {
  sendGTMEvent({
    event: "generate_lead",
    lead_source: leadSource,
    form_id: "contact-form",
  });
}
