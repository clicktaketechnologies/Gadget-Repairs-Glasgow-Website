# Deployment Guide — Gadget Repairs Glasgow

This project uses a **split deployment** architecture:

| Layer | Platform | What lives there |
|-------|----------|------------------|
| **Frontend (public site)** | Firebase Hosting | Static export of the Next.js app — all public pages, SEO files, SPA |
| **Backend (API + admin)** | Render | Next.js server runtime — `/api/*` routes + `/admin` SPA |
| **Database** | Supabase | PostgreSQL (Prisma ORM) |

The public Firebase site serves a static export. All `/api/*` requests are made
with relative URLs from the browser to the **same Firebase origin**, which means
in production you must either:

- **(Recommended)** Point `/api/*` on Firebase at the Render backend via Firebase
  rewrites (see `firebase.json` `rewrites` for `/api/**`), OR
- Run everything on Render (simpler, single origin).

For this build we run everything on a single Render service in production and
use Firebase Hosting only if you want the static-site SEO benefits with the
SPA catch-all rewrite.

---

## 1. Supabase (Database)

1. Create a new project at https://supabase.com — region **Frankfurt (eu-central-1)** (closest to Render's frankfurt region).
2. Go to **Project Settings → Database → Connection string** and copy the
   **Session-mode / pooler** URL. It looks like:
   ```
   postgresql://postgres.<project>:<password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
   Use **port 5432** (IPv4 pooler). The direct IPv6 connection is blocked on
   Render's free tier.
3. Save the URL as `DATABASE_URL` — you'll need it for Render and local `.env`.

---

## 2. Render (Backend)

1. Push this repo to GitHub.
2. In Render, click **New → Web Service → Blueprint**, select your repo and the
   included `render.yaml`. Render will auto-detect the Docker runtime.
3. Add the environment variable:
   - `DATABASE_URL` = your Supabase pooler URL (from step 1)
   - `NEXT_PUBLIC_SITE_URL` = `https://www.gadgetrepairsglasgow.co.uk`
4. Render build command (from `render.yaml`):
   ```
   npm install --legacy-peer-deps --ignore-scripts && npx prisma generate && npm run build
   ```
   Start command:
   ```
   npx prisma db push --accept-data-loss && npm start
   ```
5. Once deployed, your backend is live at
   `https://gadget-repairs-glasgow.onrender.com`.
6. Verify with `curl https://gadget-repairs-glasgow.onrender.com/api/health` →
   `{"status":"ok",...}`.

---

## 3. Firebase Hosting (Frontend)

1. Install the Firebase CLI: `npm i -g firebase-tools`.
2. `firebase login` and create a project (e.g. `gadget-repairs-glasgow`).
3. The included `firebase.json` is pre-configured with:
   - `public: "out"` (the static export dir)
   - SPA catch-all rewrite (`**` → `/index.html`)
   - `/favicon.ico` → `/logo.svg` redirect
   - `/admin` → Render backend 302 redirect
   - Content-Type headers for `sitemap.xml`, `robots.txt`, `rss.xml`,
     `llms.txt`, `manifest.json`
   - Cache headers: `max-age=0, must-revalidate` for HTML, immutable for
     content-hashed JS/CSS/images
4. Build the static export:
   ```bash
   bun run scripts/build-firebase.mjs
   ```
   This script temporarily moves `/api` and `proxy.ts` out of the way, flips
   `next.config.ts` to `output: "export"`, runs `next build`, and restores
   everything afterward. Output lands in `./out`.
5. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
6. (Automated) The GitHub Actions workflow at
   `.github/workflows/deploy-firebase.yml` runs on every push to `main` and
   deploys automatically. Add these repo secrets:
   - `FIREBASE_SERVICE_ACCOUNT` — the service-account JSON
   - `FIREBASE_PROJECT_ID` — e.g. `gadget-repairs-glasgow`
   - `DATABASE_URL` — the Supabase pooler URL (needed at build time for
     `generateMetadata` server calls)

---

## 4. Connecting Frontend → Backend

In `firebase.json` add a rewrite so `/api/**` is proxied to Render:

```json
{
  "source": "/api/**",
  "destination": "https://gadget-repairs-glasgow.onrender.com/api/**"
}
```

Place this **above** the catch-all `**` rewrite. The browser then makes
relative `/api/...` requests which Firebase transparently proxies to Render,
keeping CORS simple (same origin).

---

## 5. Local Development

```bash
bun install
bun run db:push        # create SQLite schema
bun run scripts/seed.ts
bun run dev            # http://localhost:3000
```

- Admin: visit `http://localhost:3000/admin`
- Demo creds: `admin@gadgetrepairsglasgow.co.uk` / `securepassword123`

---

## 6. Environment Variables

| Variable | Where | Example |
|----------|-------|---------|
| `DATABASE_URL` | Render + local `.env` + GitHub secret | `postgresql://...supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SITE_URL` | Render | `https://www.gadgetrepairsglasgow.co.uk` |
| `NODE_ENV` | Render | `production` |
| `FIREBASE_SERVICE_ACCOUNT` | GitHub secret | JSON |
| `FIREBASE_PROJECT_ID` | GitHub secret | `gadget-repairs-glasgow` |

---

## 7. Admin Access

- URL: `https://www.gadgetrepairsglasgow.co.uk/admin`
- The Firebase `redirects` block 302-redirects `/admin` to the Render backend,
  which serves the same SPA. The Zustand store reads `window.location.pathname`
  on load and renders the admin login.
- Demo credentials shown on the login page:
  `admin@gadgetrepairsglasgow.co.uk` / `securepassword123`
- **Change the admin password** in Admin → Settings immediately after first
  deploy (the password is stored in plaintext in the DB for this demo — wrap
  the `requireAdmin`/auth flow with bcrypt before going fully live).

---

## 8. Post-Deploy Checklist

- [ ] `https://www.gadgetrepairsglasgow.co.uk/` loads with hero + services
- [ ] `https://www.gadgetrepairsglasgow.co.uk/sitemap.xml` returns XML
- [ ] `https://www.gadgetrepairsglasgow.co.uk/robots.txt` lists 15 crawlers
- [ ] `https://www.gadgetrepairsglasgow.co.uk/manifest.json` valid JSON
- [ ] `https://www.gadgetrepairsglasgow.co.uk/admin` redirects to Render and shows login
- [ ] Admin login with demo creds → dashboard overview with KPIs + charts
- [ ] Submit sitemap to Google Search Console
- [ ] Set real Google site-verification token in `src/app/layout.tsx`
- [ ] Configure SMTP in Admin → Email Settings (Gmail App Password, etc.)
- [ ] Change admin password
- [ ] Update canonical domain in `src/components/seo/SeoHead.tsx` and
      `src/app/layout.tsx` if you use a different domain
