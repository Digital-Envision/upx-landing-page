// Captures the exact bytes this app sends to Pulse, for the contract test that
// lives on the consumer side (Virtual-Office backend/src/public-leads).
//
// It drives the real syncLeadToPulse() against a throwaway local server rather
// than rebuilding the payload by hand — a fixture assembled independently would
// pass while the producer drifted, which is the one failure the contract test
// exists to catch.
//
//   node --experimental-strip-types scripts/capture-pulse-contract.mjs \
//     ../Virtual-Office/backend/src/public-leads/__fixtures__/payloads.json
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
if (!out) {
  console.error("usage: capture-pulse-contract.mjs <path to payloads.json>");
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
      roles: "",
      details: "Need a team of 3 for a 6-month build.",
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
      roles: "2 backend, 1 QA",
      details: "Scaling the platform team.",
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
      roles: "",
      details: "",
      submittedAt: "2026-08-03T06:00:00.000Z",
    },
  },
  {
    label: "dedicated-development-teams, a page Pulse has no entry for",
    lead: {
      id: "d41f0c9e-5a7b-4c3d-8e1f-0a2b4c6d8e10",
      source: "dedicated-development-teams",
      fullName: "Morgan Lee",
      email: "morgan@example.com.au",
      phone: "+61422222222",
      company: "Kestrel Health",
      roles: "",
      details: "Looking to stand up a dedicated squad.",
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
      roles: "",
      details: "Cross-platform build, iOS first.",
      submittedAt: "2026-09-10T02:00:00.000Z",
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

const fixtures = [];
for (const { label, lead } of LEADS) {
  const before = captured.length;
  const result = await syncLeadToPulse(lead);
  const req = captured[before];
  if (result !== "delivered" || !req) {
    console.error(`FAILED to capture "${label}" — result was ${result}`);
    process.exit(1);
  }
  fixtures.push({
    label,
    result,
    // Rewritten to the documented production shape; the consumer asserts on it,
    // and the loopback port would differ on every run.
    url: "https://pulse.example.com/public/leads",
    method: req.method,
    signature: req.signature,
    contentType: req.contentType,
    body: req.body,
  });
}

server.close();
writeFileSync(out, JSON.stringify(fixtures, null, 2) + "\n");
console.log(`Wrote ${fixtures.length} payloads to ${out}`);
for (const f of fixtures) {
  console.log(`  ${JSON.parse(f.body).source.padEnd(30)} ${f.signature.slice(0, 12)}…`);
}
