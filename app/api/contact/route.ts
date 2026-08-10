import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { LANDING_PAGES } from "@/lib/landing/content";
import type { Lead } from "@/lib/landing/lead";
import { notifyLead } from "@/lib/landing/notify";
import { appendLeadToSheet } from "@/lib/landing/spreadsheet";
import { syncLeadToPulse } from "@/lib/landing/pulse";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Accept silently so the bot
  // doesn't learn to work around it, but do nothing with the submission.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = str(body.fullName, 120);
  const email = str(body.email, 200);
  const source = str(body.source, 60);

  if (!fullName) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid business email." }, { status: 400 });
  }
  if (!Object.hasOwn(LANDING_PAGES, source)) {
    return NextResponse.json({ error: "Unknown form source." }, { status: 400 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    source,
    fullName,
    email,
    company: str(body.company, 160),
    roles: str(body.roles, 200),
    details: str(body.details, 4000),
    submittedAt: new Date().toISOString(),
  };

  // Fan out to all three destinations concurrently. Each helper is env-gated
  // and swallows its own errors, so an outage in one never blocks the others.
  const [email_, sheet, pulse] = await Promise.all([
    notifyLead(lead),
    appendLeadToSheet(lead),
    syncLeadToPulse(lead),
  ]);

  const results = { email: email_, sheet, pulse };
  const outcomes = Object.values(results);
  const delivered = outcomes.filter((r) => r === "delivered").length;
  const failed = outcomes.filter((r) => r === "failed").length;
  const summary = Object.entries(results)
    .map(([name, result]) => `${name}:${result}`)
    .join(" ");

  if (delivered === 0 && failed > 0) {
    // Nothing actually received the lead. A destination that is switched off
    // doesn't count as delivery, so this fires even when the other two were
    // merely disabled — telling the visitor beats silently dropping the enquiry.
    console.error(`[contact] lead ${lead.id} <${lead.email}> reached nothing — ${summary}`);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please email us at hello@upscalix.com.au." },
      { status: 502 }
    );
  }

  if (failed > 0) {
    console.warn(`[contact] partial delivery for lead ${lead.id} — ${summary}`);
  } else if (delivered === 0) {
    // All three switched off: expected locally, a misconfiguration in prod.
    console.warn(`[contact] lead ${lead.id} accepted but every destination is disabled`);
  }

  // `tracked` tells the client this was a real, accepted enquiry so it can fire
  // the `generate_lead` conversion. The honeypot path above deliberately omits
  // it while still returning a 200, so bots see no failure signal but never
  // inflate the conversion count.
  return NextResponse.json({ ok: true, tracked: true });
}
