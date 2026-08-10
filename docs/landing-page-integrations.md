# Landing-page contact form — integration setup

The contact form on `/it-outsourcing`, `/offshore-developers` and
`/custom-software-development` posts to `POST /api/contact`, which fans the
enquiry out to three destinations concurrently:

| # | Destination | Module | Env flag |
|---|-------------|--------|----------|
| 1 | Email to the team | `lib/landing/notify.ts` | `NOTIFY_EMAIL_ENABLED` |
| 2 | Row in the cloud spreadsheet | `lib/landing/spreadsheet.ts` | `LEAD_SHEET_ENABLED` |
| 3 | Deal in Pulse (Virtual-Office CRM) | `lib/landing/pulse.ts` | `PULSE_SYNC_ENABLED` |

Each one is env-gated and swallows its own errors, so an outage in any single
destination never blocks the others. The visitor only sees an error if **every**
enabled destination fails; partial failures are logged with the lead's
reference id so nothing is silently lost.

With all three flags `false` (the default) the form still validates and returns
success — useful for local development.

---

## 1. Email notifications (SMTP2GO)

Mirrors the setup already running in `vafe-landing`, so the same SMTP2GO
account can be reused.

1. In SMTP2GO, create an **API key** with the `email/send` permission.
2. Verify the sending domain (`upscalix.com.au`) so mail isn't spam-filtered.
3. Set:

```bash
NOTIFY_EMAIL_ENABLED=true
SMTP2GO_API_KEY=api-…
NOTIFY_EMAIL_FROM=Upscalix <noreply@upscalix.com.au>
NOTIFY_EMAIL_TO=hello@upscalix.com.au,sales@upscalix.com.au
```

The email's `Reply-To` is set to the enquirer's address, so replying goes
straight back to them.

---

## 2. Cloud spreadsheet

Every enquiry becomes one row, with these columns in this order:

| # | Column | Example |
|---|--------|---------|
| 1 | `submittedAt` | `2026-08-03T04:15:22.000Z` |
| 2 | `page` | `Offshore Developers` |
| 3 | `fullName` | `Jamie Nguyen` |
| 4 | `email` | `jamie@example.com.au` |
| 5 | `company` | `Riverbend Logistics` |
| 6 | `rolesRequired` | `2 backend, 1 QA` |
| 7 | `details` | the free-text project description |
| 8 | `reference` | the lead's uuid, also quoted in the notification email |

`rolesRequired` is only populated on the offshore-developers page; the other
two send an empty string.

**You do not have to use all eight, or keep this order.** The Graph provider
reads the table's real header row and lays each enquiry out to match, so you can
drop, reorder or rename columns in Excel and submissions keep working. Header
matching ignores case, spaces and punctuation, and accepts common variants —
`Full Name`, `fullname` and `Name` all map to the same field, as do
`Business Email`/`email`, `Company Name`/`company`, `Project Details`/`details`,
`Landing Page`/`page`, `Date`/`submittedAt`, `Lead ID`/`reference`.

- A field with no matching column is simply not recorded, and the server logs
  which ones on first use (e.g. `has no column for: reference`).
- A column the app doesn't recognise is left blank rather than skipped, so you
  can keep your own columns — an `Assigned To` or `Status` for the sales team —
  alongside the generated ones.
- Dropping `reference` is safe but not recommended: it is the id that ties a
  spreadsheet row to its notification email and Pulse deal.

### Which option to pick

`LEAD_SHEET_PROVIDER` selects the mechanism:

| Option | `LEAD_SHEET_PROVIDER` | Recurring cost | Where the data lands |
|--------|----------------------|----------------|----------------------|
| **A — Microsoft Graph** (default) | `graph` | Free — an Entra app registration | SharePoint / OneDrive for Business |
| B — Power Automate | `webhook` | **Needs a Power Automate Premium licence** | SharePoint / OneDrive for Business |
| C — Google Sheets | `webhook` | Free | Google Drive |

> **Why not Power Automate.** The **"When an HTTP request is received"** trigger
> is a *premium* connector — it needs Power Automate Premium (~US$15/user/month)
> or a per-flow plan. The Excel Online (Business) connector itself is standard
> and included with Microsoft 365; only the HTTP trigger is gated. You can build
> and test such a flow without the licence and only discover the problem when it
> refuses to run in production. Option A reaches the same workbook with no
> licence and one less moving part, so it is the default.

### Access and permissions (Options A and B)

- The workbook must live in **OneDrive for Business or SharePoint**. A personal
  (consumer) OneDrive or a local file will not work.
- **The workbook does not need to be shared publicly or set to "anyone can
  edit."** Option A authenticates as an Entra app registration; Option B
  authenticates as the single Microsoft 365 user who creates the Power Automate
  connection. Either identity just needs normal edit access to that one file.
- In Option B the only public surface is the flow's HTTP trigger URL, which
  carries its own SAS signature. Treat *that* as the secret — not the file.
- Power Automate lives at <https://make.powerautomate.com>, or via the app
  launcher at office.com. "Excel Online (Business)" is not a separate app: it
  is a connector you add as a step inside the flow designer.

### Option A — Excel Online via Microsoft Graph (default)

**Create the workbook**

1. Create the workbook in SharePoint or OneDrive for Business, e.g.
   `Upscalix Leads.xlsx`.
2. Add a header row with exactly the eight column names from the table above.
3. Select the header row and the row beneath it → **Insert → Table**
   (tick "My table has headers"). Name it `Leads`. Graph writes to a *named
   table*, not a bare sheet. Rename it if you like and set `LEAD_SHEET_TABLE`.

**Register the app** (one-off, ~10 minutes)

4. Go to the [Entra admin centre](https://entra.microsoft.com) →
   **Applications → App registrations → New registration**. Name it something
   like `Upscalix landing-page leads`, single tenant, no redirect URI.
   Copy the **Application (client) ID** and **Directory (tenant) ID**.
5. **Certificates & secrets → New client secret**. Copy the *Value* immediately
   — it is only shown once. Note the expiry and diarise the rotation.
6. **API permissions → Add a permission → Microsoft Graph → Application
   permissions** → `Files.ReadWrite.All` → **Grant admin consent**.

> `Files.ReadWrite.All` is tenant-wide by default. To narrow it to just this
> workbook's site, ask whoever administers the tenant to apply an
> [application access policy](https://learn.microsoft.com/en-us/graph/auth-limit-mailbox-access)-style
> restriction via SharePoint sites-selected permissions (`Sites.Selected`).
> Worth doing if the tenant holds sensitive material.

**Point the app at it**

7. In Excel, **Share → Copy link** on the workbook. Paste that into
   `LEAD_SHEET_WORKBOOK_URL` — the app resolves it to a drive/item id once per
   process and caches the result.

```bash
LEAD_SHEET_ENABLED=true
LEAD_SHEET_PROVIDER=graph
LEAD_SHEET_TENANT_ID=…
LEAD_SHEET_CLIENT_ID=…
LEAD_SHEET_CLIENT_SECRET=…
LEAD_SHEET_WORKBOOK_URL=https://contoso.sharepoint.com/:x:/s/…
LEAD_SHEET_TABLE=Leads
```

If you would rather skip the link lookup, set `LEAD_SHEET_DRIVE_ID` and
`LEAD_SHEET_ITEM_ID` instead — they take precedence.

### Option B — Excel Online via Power Automate

1. Create the workbook in SharePoint or OneDrive for Business, e.g.
   `Upscalix Leads.xlsx`.
2. Add a header row with exactly these columns:
   `submittedAt`, `page`, `fullName`, `email`, `company`, `rolesRequired`,
   `details`, `reference`.
3. Select the header row and the row beneath it → **Insert → Table**
   (tick "My table has headers"). Name it `Leads`. The Power Automate
   connector can only write to a *named table*, not a bare sheet.
4. In Power Automate, create an **Instant cloud flow** with the
   **"When an HTTP request is received"** trigger (premium — see above).
   Paste this JSON schema:

```json
{
  "type": "object",
  "properties": {
    "submittedAt": { "type": "string" },
    "page": { "type": "string" },
    "fullName": { "type": "string" },
    "email": { "type": "string" },
    "company": { "type": "string" },
    "rolesRequired": { "type": "string" },
    "details": { "type": "string" },
    "reference": { "type": "string" }
  }
}
```

5. Add the **Excel Online (Business) → Add a row into a table** action, point it
   at the workbook and the `Leads` table, and map each column to the matching
   field from the trigger body.
6. Save the flow, then copy the generated **HTTP POST URL** (it includes a SAS
   signature) into `LEAD_SHEET_WEBHOOK_URL`. Leave `LEAD_SHEET_SECRET` empty —
   the URL is already authenticated.

```bash
LEAD_SHEET_ENABLED=true
LEAD_SHEET_PROVIDER=webhook
LEAD_SHEET_WEBHOOK_URL=https://prod-XX.australiasoutheast.logic.azure.com:443/workflows/…&sig=…
```

> Treat that URL as a secret: anyone holding it can append rows.

### Option C — Google Sheets (Apps Script)

1. Create the sheet with the same header row.
2. **Extensions → Apps Script**, then:

```js
const SECRET = 'the-same-value-as-LEAD_SHEET_SECRET';

function doPost(e) {
  if (e.parameter.secret !== SECRET) {
    return ContentService.createTextOutput('forbidden');
  }
  const row = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    row.submittedAt, row.page, row.fullName, row.email,
    row.company, row.rolesRequired, row.details, row.reference,
  ]);
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy → New deployment → Web app**, execute as yourself, access
   "Anyone". Copy the `/exec` URL.

Apps Script can't read custom headers, so append the secret as a query
parameter, and set `LEAD_SHEET_PROVIDER=webhook`:

```bash
LEAD_SHEET_ENABLED=true
LEAD_SHEET_PROVIDER=webhook
LEAD_SHEET_WEBHOOK_URL=https://script.google.com/…/exec?secret=…
LEAD_SHEET_SECRET=the-same-value
```

`LEAD_SHEET_SECRET` is also sent as an `X-Upscalix-Secret` header for any
endpoint that can read headers.

### What we need from you

Option A is the implemented default. To switch it on, send through:

- the four Entra values (tenant id, client id, client secret, and the
  workbook's Copy-link URL),
- the table name, if it isn't `Leads`.

The header row does not need to match anything — the code adapts to it. If a
field consistently arrives blank, check the server log for the
`has no column for: …` warning and either add that column or add its spelling to
`HEADER_ALIASES` in `lib/landing/spreadsheet.ts`.

---

## 3. Pulse CRM (Virtual-Office)

`syncLeadToPulse()` posts to `POST /public/leads` on the Pulse backend. The JSON
body is signed with `HMAC-SHA256(PULSE_SYNC_SECRET)` and sent as the
`X-Pulse-Signature` header — the same scheme `vafe-landing` uses for its
checkout sync, and the only authentication on the route.

Pulse creates a **Contact**, an optional **Company**, and an **unassigned Deal
in the `New` stage** stamped `DealSource.UPSCALIX_LANDING_PAGE`. The deal is
left unowned deliberately: it stays visibly up-for-grabs in the New column, and
the team already gets the notification email above on every submission.

The pipeline is chosen from the page the enquiry came from:

| Landing page | Pulse pipeline | Deal name |
|---|---|---|
| `it-outsourcing` | Staff | `[JN] IT Outsourcing` |
| `offshore-developers` | Staff | `[JN] Offshore Developers` |
| `custom-software-development` | Project | `[JN] Custom Software Development` |

`leadId` is the idempotency key. Pulse stores it on `deals.external_lead_id`
behind a partial unique index, so a retry — or a visitor double-clicking submit
— resolves to the original deal and responds `{"processed": false}` instead of
creating a duplicate.

The payload this app sends:

```json
{
  "leadId": "uuid — idempotency key",
  "firstName": "Jamie",
  "lastName": "Nguyen",
  "email": "jamie@example.com.au",
  "companyName": "Riverbend Logistics",
  "source": "it-outsourcing",
  "notes": "Roles required: …\n\n<project details>"
}
```

`source` is the page **slug**, not a display name — Pulse maps it to a pipeline
and rejects anything outside the three above. `notes` lands in the deal's
description.

To switch it on, set these to the same values as the Pulse backend:

```bash
PULSE_SYNC_ENABLED=true
PULSE_SYNC_URL=https://pulse.your-domain
PULSE_SYNC_SECRET=<shared secret>
```

`PULSE_SYNC_URL` is the backend origin — `/public/leads` is appended.

### The Pulse side

Implemented in `Virtual-Office/backend/src/public-leads/`. If you change the
wire format, both ends must move together: `CreatePublicLeadDto` validates it,
and `src/public-leads/contract.spec.ts` verifies real captured payloads from
this app against that DTO and the signature check. Regenerate the fixture with
`scratchpad/pulsetest/capture.mjs` if the payload changes.

Adding a fourth landing page means adding its slug to `UPSCALIX_LEAD_PAGES` in
the DTO and to `LEAD_PAGE_ROUTING` in `public-lead.service.ts`, or Pulse will
reject it with a 400.

---

## Testing

With the server running:

```bash
curl -s -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"fullName":"Test Person","email":"test@example.com","company":"Acme","details":"hello","source":"it-outsourcing"}'
```

Expected: `{"ok":true}`. Check the server log for `[notify]`, `[sheet]` or
`[pulse]` warnings — each names the env var it is missing.

The form also carries a hidden `website` honeypot field. Submissions that fill
it get a `200` with no side effects, so bots don't learn to work around it.
