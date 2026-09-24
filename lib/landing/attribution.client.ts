"use client";

import {
  EMPTY_ATTRIBUTION,
  isEmptyAttribution,
  parseAttribution,
  sanitiseAttribution,
  sanitiseLandingPage,
  type Attribution,
} from "./attribution";

/**
 * FIRST-touch attribution, kept for the length of the visit.
 *
 * "First" is the whole point: a visitor who arrives on an ad, reads two more
 * pages and then fills the form on the third must still be attributed to the
 * ad. Storing on every page load instead would overwrite the campaign with
 * nothing the moment they clicked an internal link, which is the common path.
 *
 * `sessionStorage`, not `localStorage`, and that is deliberate. Attribution
 * should expire with the visit: someone who arrives from an ad today and comes
 * back directly next month is a direct enquiry, and a persisted gclid would
 * credit a click that had nothing to do with it.
 */
const STORAGE_KEY = "upx.attribution.firstTouch";

interface StoredFirstTouch {
  attribution: Attribution;
  /** The page the visitor arrived on, which is not always the one they submit from. */
  landingPage: string;
  capturedAt: string;
}

/**
 * Every access is wrapped: `sessionStorage` THROWS rather than returning null
 * when site data is blocked (Safari's Lock Mode, some embedded webviews), and
 * an exception here would take the enquiry form down with it. Losing
 * attribution is a reporting gap; losing the form is a lost customer.
 */
function read(): StoredFirstTouch | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredFirstTouch>;
    return {
      attribution: sanitiseAttribution(parsed.attribution),
      landingPage: sanitiseLandingPage(parsed.landingPage),
      capturedAt: typeof parsed.capturedAt === "string" ? parsed.capturedAt : "",
    };
  } catch {
    return null;
  }
}

function write(value: StoredFirstTouch): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Blocked storage. The current page can still submit what it parsed live.
  }
}

/**
 * Records the arrival if this visit has not recorded one yet, and returns what
 * is now on file.
 *
 * Safe to call from more than one component: a landing page renders the form
 * twice (hero and footer), so this runs twice on the same load. The
 * already-captured check makes the second call a no-op rather than a rewrite.
 *
 * A direct visit stores an EMPTY record on purpose. Storing nothing would mean
 * the next page load looks like a fresh arrival, so an internal link carrying
 * no parameters would keep re-capturing "nothing".
 *
 * **First CAMPAIGN touch, not first page view** (CU-14ymjnvz39h). A stored
 * record that captured a campaign is the first touch and is never overwritten
 * — that is the whole rule, and it is what stops an internal link from
 * clearing the ad that brought the visitor in. But a stored EMPTY record is a
 * direct arrival with nothing to preserve, so the first campaign parameters
 * seen in the visit UPGRADE it rather than being discarded.
 *
 * It used to discard them, and that is what QA hit: browse the site directly,
 * then open a tagged URL in the same tab, and the enquiry arrives in Pulse
 * with all seven attribution fields null. The real-world version is worse than
 * the test case — someone reads two pages, then clicks a Google ad, and the
 * `gclid` that ad click is billed under never reaches the CRM. Pulse records
 * attribution ONCE at lead creation and offers no way to edit it afterwards,
 * so a click lost here is lost permanently.
 *
 * The trade is explicit: a visitor who arrives direct and later clicks a
 * tagged link is now attributed to the campaign rather than to the direct
 * visit. A direct visit is the absence of attribution — it credits no channel
 * and appears in no ad report — so there is nothing being taken away from, and
 * a real ad click is the more useful of the two facts to keep.
 */
export function captureFirstTouch(): StoredFirstTouch {
  if (typeof window === "undefined") {
    return { attribution: { ...EMPTY_ATTRIBUTION }, landingPage: "", capturedAt: "" };
  }

  const existing = read();
  const live = parseAttribution(window.location.search);

  // Already holding a campaign: that is the first touch, full stop.
  if (existing && !isEmptyAttribution(existing.attribution)) return existing;
  // Holding a direct arrival, and this page adds nothing: keep the original,
  // so `capturedAt` and `landingPage` still name where the visit started.
  if (existing && isEmptyAttribution(live)) return existing;

  const captured: StoredFirstTouch = {
    attribution: live,
    // Origin + path only. The query string holds the campaign parameters,
    // which are being stored beside it in their own fields — repeating them
    // here would put the same gclid in two columns of the CRM.
    //
    // On an upgrade this moves with the attribution, on purpose: the page the
    // campaign pointed at is the landing page that campaign is reported
    // against, and leaving the earlier direct path here would describe a visit
    // the attribution beside it did not come from.
    landingPage: sanitiseLandingPage(window.location.origin + window.location.pathname),
    capturedAt: new Date().toISOString(),
  };
  write(captured);
  return captured;
}

/**
 * What to send with an enquiry: the stored first touch, or — when storage is
 * unavailable — whatever the current URL carries.
 *
 * The fallback matters more than it looks. With site data blocked, `write()`
 * silently did nothing, so a visitor who lands on an ad and submits from that
 * same page would otherwise send no attribution at all despite the gclid being
 * right there in the address bar.
 */
export function attributionForSubmission(): {
  attribution: Attribution;
  landingPage: string;
} {
  if (typeof window === "undefined") {
    return { attribution: { ...EMPTY_ATTRIBUTION }, landingPage: "" };
  }

  const stored = read();
  const live = parseAttribution(window.location.search);
  const livePage = sanitiseLandingPage(window.location.origin + window.location.pathname);

  if (!stored) return { attribution: live, landingPage: livePage };

  // The same rule `captureFirstTouch` applies, restated here rather than
  // assumed: that one runs in a mount effect, so a submit could otherwise
  // race it or find a record written before this rule existed (a visit already
  // in progress when the deploy landed keeps its sessionStorage). A stored
  // EMPTY record is a direct arrival, which live campaign parameters upgrade.
  if (isEmptyAttribution(stored.attribution) && !isEmptyAttribution(live)) {
    return { attribution: live, landingPage: livePage };
  }

  // A stored CAMPAIGN beats live parameters: the visitor may be submitting
  // from a later page than the one they arrived on. The one exception is a
  // stored record that has no landing page (older format, or a failed write),
  // where the live page is better than nothing.
  return {
    attribution: stored.attribution,
    landingPage: stored.landingPage || livePage,
  };
}

/** Exported for the form's own reset path and for manual testing in the console. */
export function clearFirstTouch(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage was never available.
  }
}

export { isEmptyAttribution };
