# 🔧 Gadget Repairs Glasgow — Website + Admin Dashboard

A complete, production-ready business website and admin dashboard for **Gadget Repairs Glasgow**, a professional repair shop in Glasgow, UK offering mobile phone, MacBook, laptop, GHD, tablet, game console, computer, and smart watch repair services.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC) ![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

---

## 🌐 Live Demo

- **Website:** [https://gadget-repairs-glasgow.web.app](https://gadget-repairs-glasgow.web.app)
- **Admin Panel:** [https://gadget-repairs-glasgow.web.app/admin](https://gadget-repairs-glasgow.web.app/admin)
- **Admin Login:** `admin@gadgetrepairsglasgow.co.uk` / `securepassword123`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Public Website Pages](#public-website-pages)
7. [Admin Dashboard Modules](#admin-dashboard-modules)
8. [SEO Features](#seo-features)
9. [Local Development](#local-development)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Project Structure](#project-structure)

---

## 📖 Overview

This project is a full-stack web application for a Glasgow-based repair shop. It includes:

- A **public-facing website** with 11+ pages, SPA navigation, SEO optimization, and a booking system
- A **complete admin dashboard** with 12 modules for managing bookings, services, reviews, blog posts, branding, and more
- **Split deployment**: static frontend on Firebase Hosting + dynamic API backend on Render + PostgreSQL on Supabase

The site serves 8 repair service categories, each with its own dedicated page featuring pricing tables, FAQs, common issues, and device lists.

---

## ✨ Features

### Public Website
- 🏠 **Home page** — hero, 60-second quote widget, featured services, reviews preview, blog preview, contact CTA
- 🔧 **Services page** — all 8 services with category filter tabs and a mega menu in the header
- 📄 **Service detail pages** — per-service content with pricing tables, common issues, devices serviced, process steps, and FAQs
- 🚚 **Collection page** — free doorstep collection service details
- ⭐ **Reviews page** — customer reviews grid + leave-a-review form
- 📞 **Contact page** — booking form (creates ticket ID), contact info, map embed, business hours
- 🔍 **Track Repair** — ticket ID lookup with status timeline
- 📝 **Blog** — featured posts + post grid with markdown rendering
- 📄 **Privacy Policy** — 15-section GDPR-compliant policy
- 📄 **Terms & Conditions** — 17 official clauses
- 🗺️ **Sitemap page** — visual index of all pages

### Admin Dashboard
- 📊 **Overview** — KPI cards, 14-day trend chart, device-type pie chart, recent bookings
- 📋 **Bookings Manager** — search, filter, detail dialog, CSV export, reply-to-customer email
- 🚶 **Walk-in Customer** — quick-add form for in-store customers
- 🔧 **Services CMS** — full CRUD with instant popular/active toggles
- ⭐ **Reviews Manager** — approve/reject, edit, delete
- 🎛️ **Content Manager** — site-wide toggles (collection, announcement, ticket visibility)
- 🎨 **Branding Manager** — business name, address, phone, hours, socials, colors, logo
- 📝 **Blog Manager** — full CRUD with instant published/featured toggles
- 📄 **Pages Editor** — per-page CMS content editor
- 📧 **Email Settings** — SMTP config with test email button
- 💻 **Custom Code** — header/footer code injection
- ⚙️ **Admin Settings** — change password, logout

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **State Management** | Zustand (client) + TanStack Query (server) |
| **Database** | PostgreSQL (Supabase) / SQLite (dev) |
| **ORM** | Prisma |
| **Charts** | Recharts |
| **Markdown** | React Markdown |
| **Email** | Nodemailer (dynamic import) |
| **Analytics** | Firebase Analytics |
| **Frontend Hosting** | Firebase Hosting (static export) |
| **Backend Hosting** | Render (Docker) |
| **Database Hosting** | Supabase (PostgreSQL) |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Firebase Hosting│     │  Render Backend  │     │  Supabase DB    │
│  (Static Export) │────▶│  (Next.js Server)│────▶│  (PostgreSQL)   │
│                  │     │                  │     │                 │
│  - All pages     │     │  - /api/* routes │     │  - 10 Prisma    │
│  - SEO files     │     │  - Admin auth    │     │    models       │
│  - Logo/images   │     │  - CRUD ops      │     │  - Seeded data  │
│  - SPA catch-all │     │  - Email sending │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        ▲
        │  /api/** rewrite       │
        └────────────────────────┘
```

- **Frontend** is a static export served by Firebase Hosting. SPA navigation via Zustand (state-based, not URL-based) with a catch-all route for deep links.
- **Backend** runs on Render as a Docker container. All `/api/*` requests from Firebase are proxied to Render.
- **Database** is PostgreSQL on Supabase, accessed via Prisma ORM using the Session-mode pooler (IPv4, port 5432).

---

## 🗄️ Database Schema

The Prisma schema includes 10 models:

| Model | Purpose |
|-------|---------|
| `Service` | Repair services (8 categories with slug, pricing, icon) |
| `Booking` | Customer repair bookings with ticket ID (GD-XXXX format) |
| `Review` | Customer reviews with ratings (1-5 stars) |
| `AdminUser` | Admin accounts (email, password) |
| `SiteSettings` | Singleton: site toggles, announcement text |
| `Branding` | Singleton: business name, address, phone, hours, socials |
| `BlogPost` | Blog articles with markdown content |
| `PageContent` | Per-page CMS content (key-value pairs) |
| `EmailSettings` | Singleton: SMTP configuration |
| `SentEmail` | Email log (to, subject, body, status) |

---

## 🌐 Public Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, featured services, reviews, blog previews |
| Services | `/services` | All 8 services with category filters |
| Service Detail | `/services/<slug>` | Per-service pricing, FAQs, process |
| Collection | `/collection` | Free doorstep collection service |
| Reviews | `/reviews` | Customer reviews + submission form |
| Contact | `/contact` | Booking form, map, hours, contact info |
| Track Repair | `/track` | Ticket ID lookup with status timeline |
| Blog | `/blog` | Blog post grid with category filter |
| Blog Detail | `/blog/<slug>` | Markdown article with share buttons |
| Privacy Policy | `/privacy` | 15-section GDPR policy |
| Terms & Conditions | `/terms` | 17 official T&C clauses |
| Sitemap | `/sitemap` | Visual index of all pages |

### 8 Repair Services
1. 📱 Mobile Repair Service
2. 💻 MacBook Repair Service
3. 💻 Laptop Repair Service
4. ⚡ GHD Repair Service
5. 📱 Tablet Repair Service
6. 🎮 Game Console Repair Service
7. 🖥️ Computer Repair Service
8. ⌚ Smart Watch Repair Service

---

## 🔐 Admin Dashboard Modules

Access at `/admin` with demo credentials: `admin@gadgetrepairsglasgow.co.uk` / `securepassword123`

1. **Overview** — KPI cards + charts
2. **Bookings Manager** — search, filter, edit, delete, CSV export
3. **Walk-in Customer** — quick-add form
4. **Services & Pricing CMS** — full CRUD
5. **Reviews Manager** — approve/reject/edit
6. **Content Manager** — site toggles
7. **Branding Manager** — business info editor
8. **Blog Manager** — full CRUD
9. **Pages Editor** — per-page CMS content
10. **Email Settings** — SMTP config + test email
11. **Custom Code** — header/footer injection
12. **Admin Settings** — change password

---

## 🔍 SEO Features

- ✅ **JSON-LD structured data** (LocalBusiness + WebSite schema) in layout
- ✅ **Per-page `generateMetadata`** on root + catch-all routes
- ✅ **Client-side `<SeoHead>`** updates title/description/canonical/OG on SPA route change
- ✅ **`sitemap.xml`** with all URLs (home, services, 8 service details, blog, legal pages)
- ✅ **`robots.txt`** with 15 crawler user-agents + Sitemap directive
- ✅ **`llms.txt`** (llmstxt.org spec) for AI/LLM crawlers
- ✅ **`rss.xml`** RSS 2.0 feed
- ✅ **`manifest.json`** PWA web app manifest
- ✅ **Self-referencing canonical URLs**
- ✅ **OpenGraph + Twitter Card** meta tags
- ✅ **Google site-verification** meta tag
- ✅ All internal links use `<a href>` for crawler discoverability

---

## 💻 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) runtime
- SQLite (included — no separate install needed for dev)

### Setup

```bash
# Clone the repo
git clone https://github.com/clicktaketechnologies/Gadget-Repairs-Glasgow-Website.git
cd Gadget-Repairs-Glasgow-Website

# Install dependencies
bun install

# Set up the database
bun run db:push

# (Optional) Seed with demo data
bun run scripts/seed.ts

# Start the dev server
bun run dev
```

Visit `http://localhost:3000` — the site loads. Admin at `http://localhost:3000/admin`.

### Useful Commands

```bash
bun run dev          # Start dev server (port 3000)
bun run lint         # Run ESLint
bun run db:push      # Push Prisma schema to database
bun run db:generate  # Generate Prisma client
```

---

## 🚀 Deployment

### Architecture: Firebase + Render + Supabase

| Layer | Platform | What lives there |
|-------|----------|-----------------|
| Frontend | Firebase Hosting | Static export — all pages, SEO files, SPA |
| Backend | Render (Docker) | Next.js server — `/api/*` routes + admin |
| Database | Supabase | PostgreSQL (Prisma ORM) |

### Step 1: Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string → Session pooler**
3. Copy the pooler URL (port 5432, IPv4):
   ```
   postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```

### Step 2: Render Backend

1. Go to [render.com](https://render.com) → New → Web Service → Docker
2. Connect the GitHub repo: `clicktaketechnologies/Gadget-Repairs-Glasgow-Website`
3. Set environment variables:
   - `DATABASE_URL` = your Supabase pooler URL
   - `NEXT_PUBLIC_SITE_URL` = `https://gadget-repairs-glasgow.web.app`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
4. Deploy — the Dockerfile handles `prisma db push` + `node server.js` on start
5. Test: `https://gadget-repairs-glasgow.onrender.com/api/health`

### Step 3: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Build the static export
node scripts/build-firebase.mjs

# Deploy
firebase deploy --only hosting --project gadget-repairs-glasgow
```

The `firebase.json` includes:
- SPA catch-all rewrite (`**` → `/index.html`)
- `/api/**` proxy to Render backend
- `/admin` 302 redirect to Render
- Cache headers for SEO files + static assets

### Step 4: Custom Domain (Optional)

Add these DNS records at your registrar:

```
A     @     151.101.1.195
A     @     151.101.65.195
A     @     151.101.129.195
A     @     151.101.193.195
CNAME www    gadget-repairs-glasgow.web.app.
```

Then add the domain in Firebase Console → Hosting → Add custom domain.

---

## 🔑 Environment Variables

| Variable | Where | Example |
|----------|-------|---------|
| `DATABASE_URL` | Render + local `.env` | `postgresql://...supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SITE_URL` | Render | `https://gadget-repairs-glasgow.web.app` |
| `NODE_ENV` | Render | `production` |
| `PORT` | Render | `3000` |

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma              # 10 Prisma models
├── public/
│   ├── logo.jpg                   # Business logo
│   ├── sitemap.xml                # XML sitemap
│   ├── robots.txt                 # Robots with 15 crawlers
│   ├── llms.txt                   # LLM-friendly text
│   ├── rss.xml                    # RSS feed
│   └── manifest.json              # PWA manifest
├── src/
│   ├── app/
│   │   ├── page.tsx               # Root page → AppShell
│   │   ├── [...slug]/page.tsx     # Catch-all route (SPA)
│   │   ├── layout.tsx             # Root layout + JSON-LD + metadata
│   │   └── api/                   # 32 API route files
│   │       ├── public/            # Public API (services, blog, reviews, bookings)
│   │       └── admin/             # Admin API (auth, overview, bookings, CRUD)
│   ├── components/
│   │   ├── site/                  # Public site components
│   │   │   ├── AppShell.tsx       # Entry point
│   │   │   ├── PublicSite.tsx     # Page switcher
│   │   │   ├── Header.tsx         # Header with mega menu
│   │   │   ├── Footer.tsx         # Footer with sitemap link
│   │   │   ├── staticData.ts      # Static fallback data
│   │   │   ├── serviceContent.ts  # Per-service rich content
│   │   │   └── pages/             # 12 page components
│   │   ├── admin/                 # Admin dashboard components
│   │   │   ├── AdminApp.tsx       # Admin entry point
│   │   │   ├── AdminLayout.tsx    # Sidebar + topbar
│   │   │   └── modules/           # 12 admin modules
│   │   └── seo/
│   │       └── SeoHead.tsx        # SPA metadata updates
│   ├── store/
│   │   └── nav.ts                 # Zustand store (navigation + auth)
│   └── lib/
│       ├── db.ts                  # Prisma client
│       ├── cors.ts                # CORS helpers
│       ├── auth.ts                # Admin auth middleware
│       ├── token.ts               # JWT token helpers
│       ├── utils2.ts              # Utility functions
│       ├── firebase.ts            # Firebase Analytics SDK
│       └── admin-fetch.ts         # Authenticated fetch helper
├── Dockerfile                     # Render backend Docker config
├── render.yaml                    # Render Blueprint
├── firebase.json                  # Firebase Hosting config
├── .firebaserc                    # Firebase project ID
├── scripts/
│   ├── build-firebase.mjs         # Static export build script
│   └── seed.ts                    # Database seed script
├── DEPLOY.md                      # Detailed deployment guide
└── DNS-MIGRATION.md               # DNS setup guide
```

---

## 📞 Business Information

| Field | Value |
|-------|-------|
| **Business Name** | Gadget Repairs Glasgow |
| **Address** | 172 Trongate, Glasgow, UK |
| **Phone** | +44 7777 200149 |
| **Email** | info@gadgetrepairsglasgow.co.uk |
| **Hours** | Mon–Sat: 9:00 AM – 7:00 PM, Sun: 10:30 AM – 5:30 PM |
| **Rating** | 4.9★ (150+ reviews) |
| **Experience** | 10+ years |

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Blue** | `#1B4F8E` | Primary brand color (header, buttons, links) |
| **Orange** | `#F05A28` | Accent color (CTAs, highlights, stars) |

---

## 📄 License

This project is proprietary and owned by Gadget Repairs Glasgow. All rights reserved.

---

## 🙏 Credits

- **Developed by:** [ClickTake Technologies](https://clicktaketech.com/)
- **Powered by:** Next.js, Firebase, Render, Supabase
- **UI Components:** shadcn/ui, Lucide Icons, Tailwind CSS
