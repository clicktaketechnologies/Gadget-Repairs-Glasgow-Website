# DNS Migration Guide — Gadget Repairs Glasgow

This guide covers switching the live domain
`gadgetrepairsglasgow.co.uk` (and `www`) to the new Firebase + Render
infrastructure with **zero downtime**.

---

## Current State (assumed)

- Domain registered at your registrar (Namecheap, GoDaddy, 123-reg, etc.)
- Possibly pointed at an old host or parked.
- Email (e.g. `info@gadgetrepairsglasgow.co.uk`) possibly hosted elsewhere —
  **do not change nameservers** if email lives with the current DNS provider;
  edit records instead.

---

## Target State

| Host | Type | Value | TTL |
|------|------|-------|-----|
| `@` (apex) | `A` | Firebase Hosting IPs (see below) | 3600 |
| `www` | `CNAME` | `gadget-repairs-glasgow.web.app` | 3600 |
| `api` (optional) | `CNAME` | `gadget-repairs-glasgow.onrender.com` | 3600 |

Firebase Hosting IPs (apex `A` records — copy all of them):
```
151.101.1.195
151.101.65.195
151.101.129.195
151.101.193.195
```

---

## Step-by-Step Migration

### Step 0 — Backup current DNS (5 min)

Export / screenshot every existing DNS record for
`gadgetrepairsglasgow.co.uk` from your current provider. You'll need this
to roll back if anything breaks.

### Step 1 — Deploy backend to Render (15 min)

Follow `DEPLOY.md` §2. Confirm:
```
curl https://gadget-repairs-glasgow.onrender.com/api/health
→ {"status":"ok",...}
```

### Step 2 — Deploy frontend to Firebase (10 min)

Follow `DEPLOY.md` §3. Firebase gives you a temporary URL like
`https://gadget-repairs-glasgow.web.app`. Smoke-test the full site there
(home, services, blog, booking form, admin redirect).

### Step 3 — Add custom domain in Firebase (5 min)

```bash
firebase hosting:add-domain www.gadgetrepairsglasgow.co.uk
firebase hosting:add-domain gadgetrepairsglasgow.co.uk
```

Firebase will show you the exact records to add. Copy them.

### Step 4 — Update DNS at your registrar (the actual cutover)

**Option A — edit records (recommended, keeps email intact):**

Add/replace at your current DNS provider:

```
A     @                151.101.1.195
A     @                151.101.65.195
A     @                151.101.129.195
A     @                151.101.193.195
CNAME www              gadget-repairs-glasgow.web.app.
```

Keep all existing `MX`, `TXT` (SPF), and email-related records **untouched**.

**Option B — full nameserver change (only if email is already on a 3rd-party
provider like Google Workspace / Microsoft 365):**

Change nameservers to Firebase's — but this is rarely needed. Stick with
Option A.

### Step 5 — Wait for propagation (5 min – 2 hours)

DNS propagation for A/CNAME records is usually under 15 minutes for visitors
using public resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1). Check with:

```bash
dig +short gadgetrepairsglasgow.co.uk A
dig +short www.gadgetrepairsglasgow.co.uk
```

You should see the Firebase IPs above.

### Step 6 — Verify SSL (5 min)

Firebase auto-provisions SSL via Let's Encrypt once the DNS resolves. Check:
```
https://www.gadgetrepairsglasgow.co.uk   → green padlock
https://gadgetrepairsglasgow.co.uk       → green padlock
```

If the apex doesn't redirect to `www`, add a Firebase redirect:
```json
{ "source": "/", "destination": "https://www.gadgetrepairsglasgow.co.uk",
  "type": 301 }
```

### Step 7 — Verify the API path (5 min)

If you set up the Firebase `/api/**` rewrite to Render:
```
curl https://www.gadgetrepairsglasgow.co.uk/api/public/bootstrap
→ {"branding":{...},"settings":{...}}
```

If not, set `NEXT_PUBLIC_API_BASE=https://gadget-repairs-glasgow.onrender.com`
and rebuild — the frontend will call the Render backend directly (CORS is
already configured to allow the Firebase origin in `next.config.ts`).

### Step 8 — Verify SEO files

```
https://www.gadgetrepairsglasgow.co.uk/sitemap.xml   → XML
https://www.gadgetrepairsglasgow.co.uk/robots.txt    → text
https://www.gadgetrepairsglasgow.co.uk/manifest.json → JSON
https://www.gadgetrepairsglasgow.co.uk/llms.txt      → text
https://www.gadgetrepairsglasgow.co.uk/rss.xml       → RSS XML
```

### Step 9 — Update canonical URLs (if needed)

Search & replace `https://www.gadgetrepairsglasgow.co.uk` in:
- `src/app/layout.tsx` (SITE_URL, JSON-LD)
- `src/components/seo/SeoHead.tsx` (SITE_URL)
- `src/app/[...slug]/page.tsx` (SITE_URL)
- `public/sitemap.xml`, `public/robots.txt`, `public/rss.xml`, `public/llms.txt`

Then redeploy.

### Step 10 — Submit to search engines

1. **Google Search Console** — add property `gadgetrepairsglasgow.co.uk`
   (DNS TXT verification), submit `sitemap.xml`, request indexing of `/`.
2. **Bing Webmaster Tools** — same.
3. Set the real **Google site-verification** meta token in
   `src/app/layout.tsx` (`<meta name="google-site-verification" content="..."/>`).

---

## Rollback Plan

If anything breaks:

1. Revert DNS records to the values from Step 0 (propagation: ~5 min).
2. The old site comes back online.
3. Investigate the Firebase/Render logs without time pressure.

---

## Email Considerations

This project does **not** host email. Your existing `MX` records keep
`info@gadgetrepairsglasgow.co.uk` working wherever it currently lives
(Google Workspace, Microsoft 365, Zoho, etc.). Do **not** delete `MX`,
`TXT` (SPF/DKIM), or `SRV` records during migration.

If you want the contact form to send from
`info@gadgetrepairsglasgow.co.uk`, configure SMTP in **Admin → Email
Settings** using your email provider's SMTP details (e.g. Gmail App
Password, SendGrid, etc.).

---

## DNS Records Summary (print this)

```
; A records (apex → Firebase Hosting)
@   IN A   151.101.1.195
@   IN A   151.101.65.195
@   IN A   151.101.129.195
@   IN A   151.101.193.195

; CNAME (www → Firebase)
www IN CNAME gadget-repairs-glasgow.web.app.

; Optional: api subdomain → Render
api IN CNAME gadget-repairs-glasgow.onrender.com.

; KEEP existing MX, TXT (SPF/DKIM), SRV records for email
```
