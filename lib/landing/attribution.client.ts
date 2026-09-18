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
 * no parameters would keep re-capturing "nothing" — harmless today, but it
 * also means a visitor who arrives direct and later clicks a link with a
 * campaign tag on it would be attributed to that link instead of to the direct
 * visit they actually started with.
 */
export function captureFirstTouch(): StoredFirstTouch {
  if (typeof window === "undefined") {
    return { attribution: { ...EMPTY_ATTRIBUTION }, landingPage: "", capturedAt: "" };
  }

  const existing = read();
  if (existing) return existing;

  const captured: StoredFirstTouch = {
    attribution: parseAttribution(window.location.search),
    // Origin + path only. The query string holds the campaign parameters,
    // which are being stored beside it in their own fields — repeating them
    // here would put the same gclid in two columns of the CRM.
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

  // A stored EMPTY record beats live parameters — see `captureFirstTouch`:
  // arriving direct and then clicking a tagged link is still a direct visit.
  // The one exception is a stored record that has no landing page (older
  // format, or a failed write), where the live page is better than nothing.
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
