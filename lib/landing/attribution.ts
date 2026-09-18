/**
 * First-touch campaign attribution for an enquiry.
 *
 * Pulse's Lead Pipeline records these seven fields ONCE, when the lead is
 * created, and offers no way to edit them afterwards — not even to an admin.
 * So a lead captured without them never gets them, which is why they are
 * collected on arrival rather than reconstructed later from an ad report.
 *
 * This module is isomorphic: the parsing is pure and runs on both sides. The
 * browser-only half (reading `location`, persisting the first touch) lives in
 * `attribution.client.ts`, so importing the field list on the server pulls no
 * client code with it.
 */

/**
 * The fields, named as Pulse's `POST /public/lead-capture` expects them —
 * NOT as the query string spells them. The mapping between the two is
 * `PARAMS_BY_FIELD` below.
 */
export const ATTRIBUTION_FIELDS = [
  "campaignSource",
  "campaignMedium",
  "campaignName",
  "adGroup",
  "keyword",
  "campaignContent",
  "gclid",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];

/** Every field present, empty string where nothing was captured. */
export type Attribution = Record<AttributionField, string>;

/**
 * Each field's accepted query parameters, in priority order.
 *
 * Two names per field in most cases, because Google Ads ValueTrack and a
 * hand-built UTM link spell the same thing differently: a campaign URL
 * carries `utm_term`, while an auto-tagged one carries `keyword`. Taking the
 * first non-empty match means a link using both is not a conflict to resolve.
 */
const PARAMS_BY_FIELD: Record<AttributionField, readonly string[]> = {
  campaignSource: ["utm_source"],
  campaignMedium: ["utm_medium"],
  campaignName: ["utm_campaign", "campaignid"],
  adGroup: ["utm_adgroup", "adgroup", "adgroupid"],
  keyword: ["utm_term", "keyword"],
  campaignContent: ["utm_content"],
  gclid: ["gclid", "wbraid", "gbraid"],
};

/**
 * Pulse caps every one of these at 200 characters and REJECTS the whole
 * submission when one is longer — which would lose the enquiry over a stray
 * tracking parameter. Truncating here keeps the lead and loses only the tail
 * of a value nobody reads in full anyway.
 */
export const ATTRIBUTION_MAX_LENGTH = 200;

/** Pulse's cap on `landingPage`. */
export const LANDING_PAGE_MAX_LENGTH = 500;

export const EMPTY_ATTRIBUTION: Attribution = Object.freeze(
  Object.fromEntries(ATTRIBUTION_FIELDS.map((f) => [f, ""])) as Attribution
);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** True when nothing was captured — a direct visit with no campaign tags. */
export function isEmptyAttribution(attribution: Attribution): boolean {
  return ATTRIBUTION_FIELDS.every((field) => !attribution[field]);
}

/** Reads the seven fields out of a query string. Pure; no `window` access. */
export function parseAttribution(search: string | URLSearchParams): Attribution {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const out = { ...EMPTY_ATTRIBUTION };
  for (const field of ATTRIBUTION_FIELDS) {
    for (const param of PARAMS_BY_FIELD[field]) {
      const value = clean(params.get(param), ATTRIBUTION_MAX_LENGTH);
      if (value) {
        out[field] = value;
        break;
      }
    }
  }
  return out;
}

/**
 * Re-reads an attribution object that arrived over the wire.
 *
 * The API route cannot trust the shape the browser posted: it is a
 * `Record<string, unknown>` from `JSON.parse`, and a hostile or simply broken
 * client can put a number, an object or a 50KB string in any of these. Reading
 * only the known keys, as trimmed and truncated strings, means a bad value
 * costs that one field rather than the enquiry.
 */
export function sanitiseAttribution(value: unknown): Attribution {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<
    string,
    unknown
  >;
  const out = { ...EMPTY_ATTRIBUTION };
  for (const field of ATTRIBUTION_FIELDS) {
    out[field] = clean(raw[field], ATTRIBUTION_MAX_LENGTH);
  }
  return out;
}

export function sanitiseLandingPage(value: unknown): string {
  return clean(value, LANDING_PAGE_MAX_LENGTH);
}
