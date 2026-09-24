# Landing-page contact form — integration setup

The contact form on `/it-outsourcing`, `/offshore-developers`,
`/custom-software-development`, `/dedicated-development-teams` and
`/mobile-app-development` posts to `POST /api/contact`, which fans the enquiry
out to three destinations concurrently. The last two pages render the form
twice — once in the hero, once in the footer — per the Figma frames; both post
to the same endpoint and are indistinguishable downstream.

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
| 5 | `phone` | `+61 400 000 000` |
| 6 | `company` | `Riverbend Logistics` |
| 7 | `jobTitle` | `Head of Engineering` |
| 8 | `rolesRequired` | `2 backend, 1 QA` |
| 9 | `details` | the free-text project description |
| 10 | `reference` | the lead's uuid, also quoted in the notification email |

`jobTitle` was added in CU-14ymjnvz37v. **An existing workbook will not have the
column**, and nothing breaks if you leave it that way: the Graph provider logs
`[sheet] table "Leads" has no column for: jobTitle` on the first append after a
restart and records the other nine. Add a `Job Title` column to start capturing
it — `jobtitle`, `title` and `position` are all accepted spellings.

`rolesRequired` is only populated on the offshore-developers page; every other
page sends an empty string. `phone` is marked required in the form and enforced
by the browser, but the API deliberately does not validate it — a name and a
working email are enough to follow up on, and rejecting the request would throw
the enquiry away — so it can still arrive empty.

**You do not have to use all ten, or keep this order.** The Graph provider
reads the table's real header row and lays each enquiry out to match, so you can
drop, reorder or rename columns in Excel and submissions keep working. Header
matching ignores case, spaces and punctuation, and accepts common variants —
`Full Name`, `fullname` and `Name` all map to the same field, as do
`Business Email`/`email`, `Company Name`/`company`,
`Job Title`/`title`/`position`, `Project Details`/`details`,
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
   `submittedAt`, `page`, `fullName`, `email`, `phone`, `company`,
   `jobTitle`, `rolesRequired`, `details`, `reference`.
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
    "phone": { "type": "string" },
    "company": { "type": "string" },
    "jobTitle": { "type": "string" },
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
    row.phone, row.company, row.jobTitle, row.rolesRequired, row.details,
    row.reference,
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

The pipeline comes from the brand's default — Staff — overridden per page only
where that default is wrong:

| Landing page | Pulse pipeline | Deal name |
|---|---|---|
| `it-outsourcing` | Staff | `[JN] IT Outsourcing` |
| `offshore-developers` | Staff | `[JN] Offshore Developers` |
| `custom-software-development` | **Project** (override) | `[JN] Custom Software Development` |
| `dedicated-development-teams` | Staff | `[JN] Dedicated Development Teams` |
| `mobile-app-development` | Staff | `[JN] Mobile App Development` |

Only the override is configured in Pulse. A page not listed above still reaches
the CRM: it lands in Staff and is titled from the `sourceLabel` this app sends.

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
  "phone": "+61 400 000 000",
  "companyName": "Riverbend Logistics",
  "brand": "upscalix",
  "source": "it-outsourcing",
  "sourceLabel": "IT Outsourcing",
  "notes": "Roles required: …\n\n<project details>"
}
```

Three fields decide where the deal lands:

- **`brand`** is the closed set — `upscalix`, `vafe` or `scalout`. It carries the
  deal source, the record source and the default pipeline, and only changes when
  a whole new brand starts feeding Pulse.
- **`source`** is the page slug. It is *not* an allowlist: Pulse checks only that
  it looks like a slug. A page Pulse has never heard of still creates a deal.
- **`sourceLabel`** names the deal. It comes from `PAGE_LABELS` in
  `lib/landing/lead.ts`, so the site that owns the page owns its name.

`notes` lands in the deal's description.

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
this app against that DTO and the signature check. Regenerate the fixture after
any payload change:

```bash
node --experimental-strip-types scripts/capture-pulse-contract.mjs \
  ../Virtual-Office/backend/src/public-leads/__fixtures__/payloads.json
```

That script drives the real `syncLeadToPulse()` against a throwaway local
server, so the fixture is the bytes this app actually sends rather than a
hand-written guess.

**Adding a landing page needs no change in Pulse.** Add the slug to
`LANDING_PAGES` and its label to `PAGE_LABELS`, and the enquiry routes itself.
Pulse only needs touching to onboard a new *brand*, or to give a page a pipeline
other than its brand's default — `BRAND_ROUTING[brand].pipelineBySource` in
`public-lead.service.ts`.

This was not always true. Until 2026-09-10 `source` was validated against a
hardcoded allowlist, so a page Pulse had not been told about was rejected `400`
while the visitor still saw a successful submission — the lead reached email and
the spreadsheet but never the CRM. The failure mode is now the other way round:
an unrecognised page still becomes a deal, at worst with a title that needs
tidying.

This repo's side is drift-proofed: `PAGE_LABELS` in `lib/landing/lead.ts` is
typed `Record<LandingSlug, string>`, so a new page without a label fails the
build rather than sending an email titled `New enquiry — mobile-app-development`.
Nothing equivalent can span the two repositories, so **adding a landing page is
a two-repository change** — verify it with the curl below before pointing ad
spend at the new URL.

---

## 4. Pulse Lead Pipeline

`captureLeadInPulse()` posts the SAME enquiry to `POST /public/lead-capture`,
signed the same way with the same secret. Pulse creates a **Lead** — a row on
the Marketing → Sales qualification board (PRD §7), at stage `Lead`, with **no
Marketing Owner** (it reads "Unassigned" until somebody picks it up —
CU-14ymjnvz325) and a §7.10 notification to every active Pulse user whose role
grants the Leads page. The notification audience is the page grant, never the
owner, so an unowned lead is announced to exactly the same people.

**This is a second record, not a replacement.** One enquiry now produces a Deal
(section 3) *and* a Lead. They are separate endpoints in Pulse deliberately: the
deal route is a fixed production contract shared with another brand, and
widening it to carry the seven attribution fields would change that contract for
no benefit. `PULSE_LEAD_CAPTURE_ENABLED` gates this half alone, so the Deal
pipeline the sales team works today is unaffected by switching it off.

`PULSE_SYNC_URL` and `PULSE_SYNC_SECRET` are shared with section 3 — same Pulse,
same shared secret, nothing extra to rotate.

### Website Form → Lead Field mapping

The specification QA asked for in CU-14ymjnvz37v. **Every landing page renders
the same `ContactForm` component**, so the core fields are identical across all
five by construction — there is no per-page form to keep in step, and adding a
sixth page inherits the set.

| UI field | `name` | Required | Lead field | Notes |
|---|---|---|---|---|
| Full Name | `fullName` | yes | `fullName` | Also split into `firstName`/`lastName` for the Deal |
| Business Email | `email` | yes | `email` | The identity key on both endpoints |
| Phone Number | `phone` | in the browser only | `phone` | Dropped when Pulse could not identify anyone by it — see below |
| Company Name | `company` | no | `company` | |
| Job Title | `jobTitle` | no | `jobTitle` | Added in CU-14ymjnvz37v. Capped at 160 — Pulse's own `@MaxLength(160)` |
| Project Details | `details` | no | `enquiryMessage` | The label varies per page (`form.detailsLabel`); the field does not |

Two Lead fields are **derived, not collected**, and deliberately so:

| Lead field | Source | Why not an input |
|---|---|---|
| `serviceInterest` | the landing page's own label | Each page sells exactly one service, so the page IS the answer. A dropdown could contradict the page the visitor is reading |
| `landingPage` | first-touch capture in the browser | The page they ARRIVED on, which is not always the one they submit from |

**Page-specific extras are allowed; unmapped ones are not.** There is one
today — `roles` ("Roles Required", `offshore-developers` only, via
`form.extraField`) — and it is prefixed into the enquiry text on **both**
producers as `Roles required: …`, so it lands in the Lead's `enquiryMessage`
and the Deal's `notes` rather than vanishing. Any new extra needs the same
decision recorded here before it ships: an existing Lead field, a new one, or
a labelled prefix in `enquiryMessage`.

Adding a core field is a four-file change in this repo — the input in
`components/landing/contact-form.tsx`, the type in `lib/landing/lead.ts`, the
read in `app/api/contact/route.ts`, and the payload in
`lib/landing/lead-capture.ts` — plus `notify.ts` and `spreadsheet.ts` if the
team should see it in the email and the workbook, and a fixture refresh (see
"Contract test") so Pulse's contract spec tests the real shape.

### What the two records get called

| Wire field | Value | Why |
|---|---|---|
| `submissionId` | the same `leadId` the deal sync sends | Ties the Deal and the Lead to one enquiry, and is the idempotency key on both sides |
| `sourceForm` | `Upscalix — Offshore Developers` | Rendered verbatim in the lead's Enquiry section, so it is written to be read |
| `serviceInterest` | `Offshore Developers` | A different question from which form they filled in — on these pages the page is the answer |
| `enquiryMessage` | roles + details, same as the deal's `notes` | |
| `landingPage` | the page they ARRIVED on | Not necessarily the one they submitted from |
| `jobTitle` | as typed, omitted when blank | `/public/leads` has no such field, so the Deal does not carry it |

### First-touch attribution

`lib/landing/attribution.client.ts` reads the campaign parameters on arrival and
keeps them in `sessionStorage` for the visit. Both spellings of each field are
accepted, because an auto-tagged Google Ads URL and a hand-built UTM link name
the same thing differently:

| Pulse field | Query parameters (first match wins) |
|---|---|
| `campaignSource` | `utm_source` |
| `campaignMedium` | `utm_medium` |
| `campaignName` | `utm_campaign`, `campaignid` |
| `adGroup` | `utm_adgroup`, `adgroup`, `adgroupid` |
| `keyword` | `utm_term`, `keyword` |
| `campaignContent` | `utm_content` |
| `gclid` | `gclid`, `wbraid`, `gbraid` |

Four decisions worth knowing:

- **First touch, not last.** A visitor who arrives on an ad, reads two more
  pages and submits on the third is still attributed to the ad. Re-reading the
  URL at submit time would credit the internal link they clicked, which is the
  common path.
- **First CAMPAIGN touch, not first page view** (CU-14ymjnvz39h). A stored
  record that captured a campaign is the first touch and is never overwritten.
  A stored EMPTY record is a direct arrival with nothing to preserve, so the
  first campaign parameters seen later in the visit UPGRADE it — attribution
  and `landingPage` both move to the page the campaign pointed at.

  It used to discard them, which is what QA hit: browse the site directly, then
  open a tagged URL in the same tab, and the enquiry reaches Pulse with all
  seven fields null. The real-world case is worse than the test — read two
  pages, then click a Google ad, and the `gclid` that click is billed under
  never reaches the CRM. The trade is explicit: a direct arrival followed by a
  tagged link is now attributed to the campaign. A direct visit credits no
  channel and appears in no ad report, so there is nothing being taken away
  from, and a real ad click is the more useful of the two facts to keep.
- **`sessionStorage`, not `localStorage`.** Attribution expires with the visit.
  Someone who arrives from an ad today and returns directly next month is a
  direct enquiry, and a persisted `gclid` would credit a click that had nothing
  to do with it.
- **Empty is captured too, and is never sent as `""`.** Pulse stores these
  write-once and treats an empty string as a captured value, so a direct visit
  would read as attributed to a campaign with a blank name. Absent fields are
  omitted from the payload and show as "Not captured".

**A lead captured with this switched off can never be attributed afterwards** —
those columns appear on no update endpoint and no screen in Pulse.

### The phone that gets dropped

The form marks phone required in the browser and the API route deliberately does
not enforce it, so `"call me"` and `"n/a"` really do arrive. Pulse's lead
endpoint validates phone shape (at least six digits, nothing but the characters
a number is written with) and would reject the **whole** submission over it —
losing an enquiry for a field the email had already made unnecessary. So
`usablePhone()` drops a value Pulse would refuse. The text is still in the deal
and in the notification email, so nothing anyone can act on is lost.

### Contract test

`scripts/capture-pulse-contract.mjs` drives **both** producers over one list of
enquiries and writes the captured bytes as fixtures for the two consumer-side
contract tests in Pulse:

```bash
node --experimental-strip-types scripts/capture-pulse-contract.mjs \
  ../pulse/backend/src/public-leads/__fixtures__/payloads.json \
  ../pulse/backend/src/leads/__fixtures__/capture-payloads.json
```

The second path is optional. Re-run it and commit both files whenever a payload
changes, in the same PR as the change — the tests on the Pulse side verify the
signature and validate the body against the real DTO, which is the one failure
neither repo's own tests can catch.

---

## Testing

With the server running:

```bash
curl -s -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"fullName":"Test Person","email":"test@example.com","phone":"+61400000000","company":"Acme","jobTitle":"Head of Engineering","details":"hello","source":"it-outsourcing"}'
```

Expected: `{"ok":true}`. A `200` only means *at least one* destination took the
lead, so read the server log rather than the response — every submission logs a
per-destination summary:

```
[contact] partial delivery for lead <uuid> — email:delivered sheet:delivered pulse:failed pulseLead:skipped
```

That line is printed whenever any destination fails; a fully clean run logs
nothing. `[notify]`, `[sheet]`, `[pulse]` and `[pulse-lead]` warnings each name the env
var they are missing. Swap `source` for the slug you want to exercise — this is
the quickest way to confirm a newly added page is accepted by all four.

To exercise attribution, add the parameters to the page URL in a browser
(`/it-outsourcing?utm_source=google&gclid=test123`) and submit the form; a curl
straight at `/api/contact` bypasses the browser half, so pass `attribution`
explicitly if you need to test it that way.

**The first touch is per TAB and survives navigation**, so a test run is not
independent of the one before it. To retest from a clean arrival, open a new
tab, or run `sessionStorage.removeItem("upx.attribution.firstTouch")` in the
console — `clearFirstTouch()` is exported for the same purpose.

The form also carries a hidden `website` honeypot field. Submissions that fill
it get a `200` with no side effects, so bots don't learn to work around it.
