import type { DeliveryResult, Lead } from "./lead";
import { pageLabel } from "./lead";

/**
 * Appends the enquiry as a row in the team's cloud spreadsheet.
 *
 * Two providers, selected with LEAD_SHEET_PROVIDER:
 *
 *   "graph"   (default) — writes straight to an Excel workbook in SharePoint /
 *             OneDrive for Business via the Microsoft Graph API, authenticating
 *             as an Entra app registration. No Power Automate, so no premium
 *             Power Platform licence.
 *
 *   "webhook" — POSTs the row as flat JSON to LEAD_SHEET_WEBHOOK_URL. Kept as
 *             an escape hatch for Power Automate, Google Apps Script, Zapier or
 *             anything else that accepts a JSON body.
 *
 * Env-gated and never throws: a spreadsheet failure must not lose the lead,
 * which is already emailed and pushed to Pulse.
 *
 * See docs/landing-page-integrations.md for setup and the column order.
 */

/**
 * The values one enquiry can contribute, keyed by canonical field name. The
 * Graph provider matches these against the workbook's real header row; the
 * webhook provider sends the whole object.
 */
function toFields(lead: Lead): Record<string, string> {
  return {
    submittedAt: lead.submittedAt,
    page: pageLabel(lead.source),
    fullName: lead.fullName,
    email: lead.email,
    company: lead.company,
    rolesRequired: lead.roles,
    details: lead.details,
    reference: lead.id,
  };
}

/** Canonical field order, used when a destination has no headers to read. */
const FIELD_ORDER = [
  "submittedAt",
  "page",
  "fullName",
  "email",
  "company",
  "rolesRequired",
  "details",
  "reference",
] as const;

/** Lowercase, strip anything that isn't a letter or digit. */
function normaliseHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Header spellings we accept for each field, so the workbook can use "Full
 * Name" or "Business Email" without the code caring. Keys are already
 * normalised.
 */
const HEADER_ALIASES: Record<string, string> = {
  submittedat: "submittedAt",
  submitted: "submittedAt",
  date: "submittedAt",
  timestamp: "submittedAt",
  page: "page",
  source: "page",
  landingpage: "page",
  fullname: "fullName",
  name: "fullName",
  email: "email",
  businessemail: "email",
  company: "company",
  companyname: "company",
  rolesrequired: "rolesRequired",
  roles: "rolesRequired",
  details: "details",
  projectdetails: "details",
  projectoverview: "details",
  reference: "reference",
  leadid: "reference",
  id: "reference",
};

export async function appendLeadToSheet(lead: Lead): Promise<DeliveryResult> {
  if (process.env.LEAD_SHEET_ENABLED !== "true") return "skipped";

  const provider = process.env.LEAD_SHEET_PROVIDER ?? "graph";
  if (provider === "webhook") return appendViaWebhook(lead);
  if (provider === "graph") return appendViaGraph(lead);

  console.warn(`[sheet] unknown LEAD_SHEET_PROVIDER "${provider}" — skipping`);
  return "skipped";
}

/* ------------------------------------------------------------------ graph */

const GRAPH = "https://graph.microsoft.com/v1.0";

/**
 * Client-credentials tokens last an hour; cache until shortly before expiry so
 * a burst of submissions doesn't re-authenticate on every request.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getGraphToken(
  tenantId: string,
  clientId: string,
  clientSecret: string
): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    console.error("[sheet] Entra token request failed", res.status, await res.text().catch(() => ""));
    return null;
  }

  const body = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) {
    console.error("[sheet] Entra token response had no access_token");
    return null;
  }

  // Refresh a minute early to avoid racing the expiry.
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + ((body.expires_in ?? 3600) - 60) * 1000,
  };
  return cachedToken.value;
}

/**
 * Graph addresses a shared file by a base64url form of its sharing URL, so the
 * workbook can be identified by the link you get from Excel's "Copy link"
 * rather than by hunting down drive and item ids.
 */
function encodeSharingUrl(url: string): string {
  const b64 = Buffer.from(url, "utf8").toString("base64");
  return `u!${b64.replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-")}`;
}

/** Resolved once per process — the workbook doesn't move. */
let cachedItemPath: string | null = null;

/** The table's real header row, in workbook order. */
let cachedHeaders: string[] | null = null;

/**
 * Reads the table's actual columns so the row we send matches the workbook
 * rather than an assumption baked into this file. Without it, adding,
 * removing or reordering a column in Excel makes every submission fail with
 * "The number of rows or columns in the input array doesn't match…".
 */
async function getTableHeaders(
  itemPath: string,
  table: string,
  token: string
): Promise<string[] | null> {
  if (cachedHeaders) return cachedHeaders;

  const res = await fetch(
    `${itemPath}/workbook/tables/${encodeURIComponent(table)}/columns?$select=name`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    console.error(
      `[sheet] could not read columns of table "${table}"`,
      res.status,
      await res.text().catch(() => "")
    );
    return null;
  }

  const body = (await res.json()) as { value?: { name?: string }[] };
  const headers = (body.value ?? []).map((c) => c.name ?? "");
  if (headers.length === 0) {
    console.error(`[sheet] table "${table}" reported no columns`);
    return null;
  }

  const unmatched = FIELD_ORDER.filter(
    (field) => !headers.some((h) => HEADER_ALIASES[normaliseHeader(h)] === field)
  );
  if (unmatched.length > 0) {
    console.warn(
      `[sheet] table "${table}" has no column for: ${unmatched.join(", ")} — those values won't be recorded`
    );
  }

  cachedHeaders = headers;
  return cachedHeaders;
}

/** Lays the enquiry out in the workbook's own column order. */
function toRowForHeaders(lead: Lead, headers: string[]): string[] {
  const fields = toFields(lead);
  return headers.map((header) => {
    const field = HEADER_ALIASES[normaliseHeader(header)];
    return field ? (fields[field] ?? "") : "";
  });
}

async function resolveWorkbookPath(token: string): Promise<string | null> {
  if (cachedItemPath) return cachedItemPath;

  const driveId = process.env.LEAD_SHEET_DRIVE_ID;
  const itemId = process.env.LEAD_SHEET_ITEM_ID;
  if (driveId && itemId) {
    cachedItemPath = `${GRAPH}/drives/${driveId}/items/${itemId}`;
    return cachedItemPath;
  }

  const shareUrl = process.env.LEAD_SHEET_WORKBOOK_URL;
  if (!shareUrl) {
    console.warn(
      "[sheet] set LEAD_SHEET_WORKBOOK_URL (or LEAD_SHEET_DRIVE_ID + LEAD_SHEET_ITEM_ID) — skipping"
    );
    return null;
  }

  const res = await fetch(`${GRAPH}/shares/${encodeSharingUrl(shareUrl)}/driveItem`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("[sheet] could not resolve workbook", res.status, await res.text().catch(() => ""));
    return null;
  }

  const item = (await res.json()) as { id?: string; parentReference?: { driveId?: string } };
  const resolvedDrive = item.parentReference?.driveId;
  if (!item.id || !resolvedDrive) {
    console.error("[sheet] workbook lookup returned no drive/item id");
    return null;
  }

  cachedItemPath = `${GRAPH}/drives/${resolvedDrive}/items/${item.id}`;
  return cachedItemPath;
}

async function appendViaGraph(lead: Lead): Promise<DeliveryResult> {
  const tenantId = process.env.LEAD_SHEET_TENANT_ID;
  const clientId = process.env.LEAD_SHEET_CLIENT_ID;
  const clientSecret = process.env.LEAD_SHEET_CLIENT_SECRET;
  const table = process.env.LEAD_SHEET_TABLE ?? "Leads";

  if (!tenantId || !clientId || !clientSecret) {
    console.warn(
      "[sheet] LEAD_SHEET_ENABLED=true but LEAD_SHEET_TENANT_ID / _CLIENT_ID / _CLIENT_SECRET are not all set — skipping"
    );
    return "skipped";
  }

  try {
    const token = await getGraphToken(tenantId, clientId, clientSecret);
    if (!token) return "failed";

    const itemPath = await resolveWorkbookPath(token);
    if (!itemPath) return "skipped"; // misconfigured, not a transient failure

    const headers = await getTableHeaders(itemPath, table, token);
    if (!headers) return "failed";

    const res = await fetch(`${itemPath}/workbook/tables/${encodeURIComponent(table)}/rows/add`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ index: null, values: [toRowForHeaders(lead, headers)] }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // Drop the caches so the next submission re-reads everything: 401 means a
      // stale token, 404 a moved workbook, 400 usually a column that changed
      // under us. Otherwise one edit in Excel would break submissions until the
      // app restarted.
      if (res.status === 401) cachedToken = null;
      if (res.status === 404) cachedItemPath = null;
      if (res.status === 400 || res.status === 404) cachedHeaders = null;
      console.error("[sheet] Graph row insert failed", res.status, detail);
      return "failed";
    }
    return "delivered";
  } catch (err) {
    console.error("[sheet] Graph append failed", err);
    return "failed";
  }
}

/* ---------------------------------------------------------------- webhook */

async function appendViaWebhook(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.LEAD_SHEET_WEBHOOK_URL;
  if (!url) {
    console.warn(
      '[sheet] LEAD_SHEET_PROVIDER="webhook" but LEAD_SHEET_WEBHOOK_URL is not set — skipping'
    );
    return "skipped";
  }

  // A webhook has no schema to read, so send every field in the canonical order.
  const fields = toFields(lead);
  const row = Object.fromEntries(FIELD_ORDER.map((key) => [key, fields[key] ?? ""]));

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Power Automate URLs carry their own SAS signature; a shared secret is only
  // needed for endpoints that can't sign their own URL (e.g. Apps Script).
  const secret = process.env.LEAD_SHEET_SECRET;
  if (secret) headers["X-Upscalix-Secret"] = secret;

  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(row) });
    if (!res.ok) {
      console.error("[sheet] webhook responded non-2xx", res.status, await res.text().catch(() => ""));
      return "failed";
    }
    return "delivered";
  } catch (err) {
    console.error("[sheet] webhook append failed", err);
    return "failed";
  }
}
