// Captures the exact bytes this app sends to Pulse, for the contract tests that
// live on the consumer side (Virtual-Office backend/src/public-leads and
// backend/src/leads).
//
// It drives the real syncLeadToPulse() / captureLeadInPulse() against a
// throwaway local server rather than rebuilding the payloads by hand — a
// fixture assembled independently would pass while the producer drifted, which
// is the one failure a contract test exists to catch.
//
//   node --experimental-strip-types scripts/capture-pulse-contract.mjs \
//     ../Virtual-Office/backend/src/public-leads/__fixtures__/payloads.json \
//     ../Virtual-Office/backend/src/leads/__fixtures__/capture-payloads.json
//
// The second path is optional; omit it to refresh the deal payloads alone.
// ONE list of enquiries feeds both producers, so the two wire formats cannot
// drift apart on the input side.
//
// Requires Node >= 22.6 for type stripping. The secret below is the fixture's,
// not a real one: the consumer verifies against the same literal.

import { createServer } from "node:http";
import { register } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";

// The app's TypeScript uses extensionless relative imports, which bare ESM
// cannot resolve. Retry each failure with a .ts suffix.
register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(spec, ctx, next) {
        try {
          return await next(spec, ctx);
        } catch (err) {
          if (spec.startsWith(".") && !/\\.[cm]?[jt]s$/.test(spec)) {
            return next(spec + ".ts", ctx);
          }
          throw err;
        }
      }
    `),
  import.meta.url,
);

const SECRET = "contract-test-secret";
const out = process.argv[2];
const captureOut = process.argv[3];
if (!out) {
  console.error(
    "usage: capture-pulse-contract.mjs <payloads.json> [<capture-payloads.json>]",
  );
  process.exit(1);
}

/** One representative enquiry per shape the forms can produce. */
const LEADS = [
  {
    label: "it-outsourcing, company + details, no roles field",
    lead: {
      id: "02252496-b0a9-4ff3-8726-d08be76fbb74",
      source: "it-outsourcing",
      fullName: "Jamie Nguyen",
      email: "jamie@example.com.au",
      phone: "+61400000000",
      company: "Riverbend Logistics",
      jobTitle: "Head of Engineering",
      roles: "",
      details: "Need a team of 3 for a 6-month build.",
      // Google Ads, fully tagged: the shape every paid enquiry should carry.
      attribution: {
        campaignSource: "google",
        campaignMedium: "cpc",
        campaignName: "au-it-outsourcing",
        adGroup: "outsourcing-generic",
        keyword: "it outsourcing australia",
        campaignContent: "rsa-1",
        gclid: "Cj0KCQjw_YemBhDyARIsACyd7-example",
      },
      landingPage: "https://upscalix.com.au/it-outsourcing",
      submittedAt: "2026-08-03T04:15:22.000Z",
    },
  },
  {
    label: "offshore-developers, roles + details, single-word name",
    lead: {
      id: "7c1f6a44-2f0e-4a1e-9a5e-2c0a1b3d4e5f",
      source: "offshore-developers",
      fullName: "Prakash",
      email: "prakash@example.com",
      phone: "+61411111111",
      company: "",
      jobTitle: "",
      roles: "2 backend, 1 QA",
      details: "Scaling the platform team.",
      // A hand-built UTM link with no click id — LinkedIn, a newsletter.
      attribution: {
        campaignSource: "linkedin",
        campaignMedium: "social",
        campaignName: "offshore-q3",
        adGroup: "",
        keyword: "",
        campaignContent: "",
        gclid: "",
      },
      landingPage: "https://upscalix.com.au/offshore-developers",
      submittedAt: "2026-08-03T05:20:00.000Z",
    },
  },
  {
    label: "custom-software-development, no company, no details",
    lead: {
      id: "b3a9c210-88de-4f77-9f3b-6d2a5e8c1049",
      source: "custom-software-development",
      fullName: "Alex Tan",
      email: "alex@example.com.au",
      phone: "",
      company: "",
      jobTitle: "",
      roles: "",
      details: "",
      // A direct visit: every field blank, which §7.2 requires to be accepted
      // rather than rejected or defaulted.
      attribution: {
        campaignSource: "",
        campaignMedium: "",
        campaignName: "",
        adGroup: "",
        keyword: "",
        campaignContent: "",
        gclid: "",
      },
      landingPage: "https://upscalix.com.au/custom-software-development",
      submittedAt: "2026-08-03T06:00:00.000Z",
    },
  },
  {
    label:
      "dedicated-development-teams, a page Pulse has no entry for — " +
      "and a visitor who ARRIVED on another page",
    lead: {
      id: "d41f0c9e-5a7b-4c3d-8e1f-0a2b4c6d8e10",
      source: "dedicated-development-teams",
      fullName: "Morgan Lee",
      email: "morgan@example.com.au",
      phone: "+61422222222",
      company: "Kestrel Health",
      jobTitle: "CTO",
      roles: "",
      details: "Looking to stand up a dedicated squad.",
      attribution: {
        campaignSource: "bing",
        campaignMedium: "cpc",
        campaignName: "dedicated-teams",
        adGroup: "",
        keyword: "dedicated dev team",
        campaignContent: "",
        gclid: "",
      },
      // Deliberately NOT this page. First touch is where the visit STARTED,
      // so someone who arrived on the IT Outsourcing ad and submitted from the
      // dedicated-teams page is attributed to the former. A fixture where
      // every landingPage matched its own slug would let a producer that
      // simply derived the URL from the slug pass unnoticed, which is the bug
      // this case exists to catch.
      landingPage: "https://upscalix.com.au/it-outsourcing",
      submittedAt: "2026-09-10T01:00:00.000Z",
    },
  },
  {
    label: "mobile-app-development, a page Pulse has no entry for",
    lead: {
      id: "e52a1b7d-6c8e-4d2f-9a0b-1c3d5e7f9a11",
      source: "mobile-app-development",
      fullName: "Sam O'Brien",
      email: "sam@example.com.au",
      phone: "+61433333333",
      company: "",
      jobTitle: "",
      roles: "",
      details: "Cross-platform build, iOS first.",
      attribution: {
        campaignSource: "google",
        campaignMedium: "cpc",
        campaignName: "mobile-app",
        adGroup: "ios-first",
        keyword: "app developers",
        campaignContent: "",
        gclid: "EAIaIQobChMI-example",
      },
      landingPage: "https://upscalix.com.au/mobile-app-development",
      submittedAt: "2026-09-10T02:00:00.000Z",
    },
  },
];

/**
 * Enquiries captured for the LEAD-CAPTURE producer only.
 *
 * They cannot join `LEADS`: the deal-side contract test asserts exactly one
 * payload per landing page, so a sixth entry reusing a slug fails it. These
 * exercise what the lead endpoint validates and the deal endpoint does not.
 */
const CAPTURE_ONLY_LEADS = [
  {
    label: "unusable phone — dropped so Pulse does not reject the enquiry",
    lead: {
      id: "f61b2c8a-9d0e-4f12-8a34-5b6c7d8e9f01",
      source: "it-outsourcing",
      fullName: "Dana Whitfield",
      email: "dana@example.com.au",
      // The form requires a phone in the BROWSER and the API route
      // deliberately does not enforce it, so text really does arrive here.
      // Pulse's phone rule would 400 the whole submission over it.
      phone: "call me",
      company: "",
      jobTitle: "",
      roles: "",
      details: "Prefer a call back.",
      attribution: {
        campaignSource: "",
        campaignMedium: "",
        campaignName: "",
        adGroup: "",
        keyword: "",
        campaignContent: "",
        gclid: "",
      },
      landingPage: "https://upscalix.com.au/it-outsourcing",
      submittedAt: "2026-09-18T03:00:00.000Z",
    },
  },
  {
    label: "phone-shaped but short — under Pulse's six-digit identity floor",
    lead: {
      id: "0c9d8e7f-6a5b-4c3d-2e1f-0a9b8c7d6e5f",
      source: "mobile-app-development",
      fullName: "Kit Alvarez",
      email: "kit@example.com.au",
      phone: "12345",
      company: "Northpoint",
      jobTitle: "Operations Manager",
      roles: "",
      details: "",
      attribution: {
        campaignSource: "",
        campaignMedium: "",
        campaignName: "",
        adGroup: "",
        keyword: "",
        campaignContent: "",
        gclid: "",
      },
      landingPage: "https://upscalix.com.au/mobile-app-development",
      submittedAt: "2026-09-18T03:05:00.000Z",
    },
  },
];

const captured = [];

const server = createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    captured.push({
      method: req.method,
      path: req.url,
      signature: req.headers["x-pulse-signature"],
      contentType: req.headers["content-type"],
      body: Buffer.concat(chunks).toString("utf8"),
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true, processed: true, dealId: "d-1" }));
  });
});

await new Promise((done) => server.listen(0, "127.0.0.1", done));
const { port } = server.address();

process.env.PULSE_SYNC_ENABLED = "true";
process.env.PULSE_SYNC_URL = `http://127.0.0.1:${port}`;
process.env.PULSE_SYNC_SECRET = SECRET;

const { syncLeadToPulse } = await import(
  pathToFileURL(resolvePath(import.meta.dirname, "../lib/landing/pulse.ts")).href
);
const { captureLeadInPulse } = await import(
  pathToFileURL(resolvePath(import.meta.dirname, "../lib/landing/lead-capture.ts")).href
);

/** Drives one producer over every enquiry and returns its captured requests. */
async function capture(send, publicUrl, leads = LEADS) {
  // The fixture records `publicUrl`, not the loopback URL the producer really
  // hit — the port differs on every run, and the consumer asserts on the
  // documented production path. That substitution is only safe if the path
  // actually matched: without this check a producer posting to the WRONG
  // endpoint still writes a fixture claiming the right one, and the two
  // producers here differ in nothing else.
  const expectedPath = new URL(publicUrl).pathname;
  const fixtures = [];
  for (const { label, lead } of leads) {
    const before = captured.length;
    const result = await send(lead);
    const req = captured[before];
    if (result !== "delivered" || !req) {
      console.error(`FAILED to capture "${label}" — result was ${result}`);
      process.exit(1);
    }
    if (req.path !== expectedPath) {
      console.error(
        `WRONG ENDPOINT for "${label}" — posted to ${req.path}, expected ${expectedPath}`,
      );
      process.exit(1);
    }
    fixtures.push({
      label,
      result,
      // Rewritten to the documented production shape; the consumer asserts on
      // it, and the loopback port would differ on every run.
      url: publicUrl,
      method: req.method,
      signature: req.signature,
      contentType: req.contentType,
      body: req.body,
    });
  }
  return fixtures;
}

function report(fixtures, path, key) {
  writeFileSync(path, JSON.stringify(fixtures, null, 2) + "\n");
  console.log(`Wrote ${fixtures.length} payloads to ${path}`);
  for (const f of fixtures) {
    console.log(`  ${String(JSON.parse(f.body)[key]).padEnd(34)} ${f.signature.slice(0, 12)}…`);
  }
}

const deals = await capture(syncLeadToPulse, "https://pulse.example.com/public/leads");
report(deals, out, "source");

if (captureOut) {
  process.env.PULSE_LEAD_CAPTURE_ENABLED = "true";
  const leads = await capture(
    captureLeadInPulse,
    "https://pulse.example.com/public/lead-capture",
    [...LEADS, ...CAPTURE_ONLY_LEADS],
  );
  report(leads, captureOut, "sourceForm");
}

server.close();
