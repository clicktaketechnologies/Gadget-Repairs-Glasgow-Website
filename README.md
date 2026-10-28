# 🔧 Gadget Repairs Glasgow — Website + Admin Dashboard

A complete, production-ready business website and admin dashboard for **Gadget Repairs Glasgow**, a professional repair shop at 172 Trongate, Glasgow G1 5EL, United Kingdom. Offering mobile phone, MacBook, laptop, GHD, tablet, game console, computer, and smart watch repair services.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC) ![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

---

## 🌐 Live Demo

- **Website:** [https://gadget-repairs-glasgow.web.app](https://gadget-repairs-glasgow.web.app)
- **Admin Panel:** [https://gadget-repairs-glasgow.web.app/admin](https://gadget-repairs-glasgow.web.app/admin)
- **Admin Login:** `admin@gadgetrepairsglasgow.co.uk` / `3jf%$uQ42$`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Public Website Pages](#public-website-pages)
7. [Admin Dashboard Modules](#admin-dashboard-modules)
8. [Media Library](#media-library)
9. [Blog System](#blog-system)
10. [Booking System](#booking-system)
11. [SEO Features](#seo-features)
12. [Local Development](#local-development)
13. [Deployment](#deployment)
14. [Environment Variables](#environment-variables)
15. [Project Structure](#project-structure)

---

## 📖 Overview

This project is a full-stack web application for a Glasgow-based repair shop. It includes:

- A **public-facing website** with 13+ pages, SPA navigation, SEO optimization, booking system, blog, and review system
- A **complete admin dashboard** with 13 modules for managing bookings, services, reviews, blog posts, media, branding, and more
- **localStorage persistence** — all admin data (bookings, reviews, blog posts, services, media) persists in the browser and syncs with public-facing pages in real-time
- **Split deployment**: static frontend on Firebase Hosting + dynamic API backend on Render + PostgreSQL on Supabase

The site serves 8 repair service categories, each with its own dedicated page featuring pricing tables, FAQs, common issues, and device lists.

---

## ✨ Features

### Public Website
- 🏠 **Home page** — hero, 60-second quote widget, featured services, reviews preview, blog preview, contact CTA
- 🔧 **Services page** — all 8 services with category filter tabs and a mega menu in the header
- 📄 **Service detail pages** — per-service content with pricing tables, common issues, devices serviced, process steps, and FAQs
- 🚚 **Collection page** — free doorstep collection service details
- ⭐ **Reviews page** — customer reviews grid + leave-a-review form (saves to localStorage)
- 📞 **Contact page** — booking form (generates ticket ID, saves to localStorage), contact info, map embed, business hours
- 🔍 **Track Repair** — ticket ID lookup with status timeline (reads from localStorage)
- 📝 **Blog** — featured posts + post grid with category filter (reads admin-created posts from localStorage)
- 📄 **Blog Detail** — markdown rendering with inline images, share buttons, author box, related posts
- 📄 **Privacy Policy** — 15-section GDPR-compliant policy with sticky TOC
- 📄 **Terms & Conditions** — 17 official T&C clauses with callout boxes
- 🗺️ **Sitemap page** — visual index of all pages with links

### Admin Dashboard (13 Modules)
- 📊 **Overview** — KPI cards (real-time from localStorage), 14-day trend chart, device-type pie chart, recent bookings
- 📋 **Bookings Manager** — bulk selection, bulk status change, bulk delete, trash (soft delete), restore, search, filter, CSV export, detail dialog with status workflow, reply-to-customer email, duplicate booking, print ticket, copy ticket ID
- 🚶 **Walk-in Customer** — quick-add form for in-store customers
- 🔧 **Services CMS** — full CRUD with instant popular/active toggles, grouped by category
- ⭐ **Reviews Manager** — approve/reject, edit, delete with tabs (Pending/Approved/All)
- 📝 **Blog Manager** — full CRUD with image insertion (upload from device or URL), cover image upload with live preview, schedule posts with date/time picker, instant published/featured toggles
- 📄 **Pages Editor** — per-page CMS content editor with 6 pages, pre-populated with real content, localStorage persistence
- 🖼️ **Media Library** — upload images and videos (drag & drop or file picker), grid view with thumbnails, search, filter, preview dialog, copy URL, download, delete
- 🎛️ **Content Manager** — site-wide toggles (collection, announcement, ticket visibility)
- 🎨 **Branding Manager** — business name, address, phone, hours, socials, colors, logo
- 📧 **Email Settings** — SMTP config with test email button, sent email log
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
| **State Management** | Zustand (client) with persist middleware |
| **Database** | PostgreSQL (Supabase) / SQLite (dev) |
| **ORM** | Prisma |
| **Charts** | Recharts |
| **Markdown** | React Markdown |
| **Email** | Nodemailer (dynamic import) |
| **Analytics** | Firebase Analytics |
| **Frontend Hosting** | Firebase Hosting (static export) |
| **Backend Hosting** | Render (Docker) |
| **Database Hosting** | Supabase (PostgreSQL) |
| **Data Persistence** | Browser localStorage (offline mode) |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Firebase Hosting│     │  Render Backend  │     │  Supabase DB    │
│  (Static Export) │────▶│  (Next.js Server)│────▶│  (PostgreSQL)   │
│                  │     │                  │     │                 │
│  - All 13+ pages │     │  - /api/* routes │     │  - 10 Prisma    │
│  - SEO files     │     │  - Admin auth    │     │    models       │
│  - Logo/images   │     │  - CRUD ops      │     │                 │
│  - SPA catch-all │     │  - Email sending │     │                 │
│  - Admin panel   │     │                  │     │                 │
│  - Media library │     │                  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        ▲
        │  /api/** rewrite       │
        └────────────────────────┘
        
        ┌─────────────────┐
        │  Browser        │
        │  localStorage   │
        │                 │
        │  - Bookings     │
        │  - Reviews      │
        │  - Blog posts   │
        │  - Services     │
        │  - Media files  │
        │  - Page content │
        │  - Trash        │
        │  - Sent emails  │
        └─────────────────┘
```

### Offline-First Design
When the Render backend is unavailable (sleeping/deploying), the site uses **browser localStorage** for all data:
- Public forms (booking, review) save to localStorage
- Admin dashboard reads from localStorage
- All data persists across refreshes
- Real-time sync between public and admin pages via shared localStorage keys
- When Render comes online, API data overrides localStorage

---

## 🗄️ Database Schema

The Prisma schema includes 10 models:

| Model | Purpose |
|-------|---------|
| `Service` | 8 repair services (slug, pricing, icon, category) |
| `Booking` | Customer repair bookings with ticket ID (GD-XXXX) |
| `Review` | Customer reviews with 1-5 star ratings |
| `AdminUser` | Admin accounts (email, password) |
| `SiteSettings` | Site toggles, announcement text |
| `Branding` | Business name, address, phone, hours, socials |
| `BlogPost` | Blog articles with markdown content |
| `PageContent` | Per-page CMS content (key-value pairs) |
| `EmailSettings` | SMTP configuration |
| `SentEmail` | Email log |

---

## 🌐 Public Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, featured services, reviews, blog previews |
| Services | `/services` | All 8 services with category filters + mega menu |
| Service Detail | `/services/<slug>` | Per-service pricing, FAQs, process |
| Collection | `/collection` | Free doorstep collection service |
| Reviews | `/reviews` | Customer reviews + submission form |
| Contact | `/contact` | Booking form, map, hours, contact info |
| Track Repair | `/track` | Ticket ID lookup with status timeline |
| Blog | `/blog` | Blog post grid with category filter |
| Blog Detail | `/blog/<slug>` | Markdown article with images, share buttons |
| Privacy Policy | `/privacy` | 15-section GDPR policy with sticky TOC |
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

Access at `/admin` with credentials: `admin@gadgetrepairsglasgow.co.uk` / `3jf%$uQ42$`

### 1. Overview
- Real-time KPI cards (total, pending, in-progress, ready, completed, revenue)
- 14-day booking trend area chart
- Device-type pie chart
- Recent bookings table

### 2. Bookings Manager
- Bulk selection with checkboxes + Select All
- Bulk status change (Pending/In Progress/Ready/Completed/Cancelled)
- Bulk delete (moves to trash)
- Trash tab with Restore + Permanent Delete
- Search, status filter, CSV export
- Detail dialog: status workflow, technician notes, quoted/final price
- More Actions: Duplicate booking, Print ticket, Copy ticket ID, Move to trash
- Reply to customer email (saves to sent-emails localStorage)

### 3. Walk-in Customer
- Quick-add form for in-store customers (creates booking with source=walk-in)

### 4. Services & Pricing CMS
- Full CRUD for all 8 services
- Instant popular/active toggle switches
- Grouped by category

### 5. Reviews Manager
- Pending/Approved/All tabs
- Instant approve/unapprove toggle
- Add/Edit/Delete with star ratings

### 6. Blog Manager
- Full CRUD for blog posts
- Image insertion (upload from device or paste URL)
- Cover image upload with live preview
- Schedule posts with date/time picker
- Instant published/featured toggles
- Base64 image placeholders (no huge strings in editor)
- Responsive popup (mobile-friendly)

### 7. Pages Editor
- 6-page tabs (Home, Services, Collection, Reviews, Contact, Blog)
- Pre-populated with real content (37 rows total)
- Row count badges on each tab
- Add/Edit/Delete rows
- Auto-save to localStorage on every edit

### 8. Media Library
- Upload images (max 5MB) and videos (max 10MB)
- Drag & drop or file picker (multiple files)
- Grid view with thumbnails
- Search by filename, filter by type (All/Images/Videos)
- Preview dialog with full-size view
- Copy URL, download, delete
- Storage usage display

### 9. Content Manager
- Toggle cards: collection enabled, collection banner, announcement, ticket visibility
- Announcement text editor

### 10. Branding Manager
- Business identity (name, tagline, about, logo, favicon, colors)
- Contact (phone, WhatsApp, email, website)
- Location (address, GMB profile, map link, map embed)
- Business hours (7-day editor)
- Social links (5 platforms)
- Target service areas
- Stats (rating, review count, years experience)

### 11. Email Settings
- SMTP configuration (host, port, secure, user, password, from email/name)
- Test email button
- Sent email log table

### 12. Custom Code
- Header code injection (for `<head>`)
- Footer code injection (before `</body>`)
- Google site-verification tag

### 13. Admin Settings
- Change password (current + new + confirm)
- Session info display
- Logout

---

## 🖼️ Media Library

The Media Library allows admins to upload and manage images and videos:

- **Upload:** Click "Upload Media" or drag & drop files onto the upload zone
- **Storage:** Files stored as base64 in browser localStorage (`grg-admin-media`)
- **Limits:** Images max 5MB, Videos max 10MB (browser localStorage ~5MB total)
- **Management:** Search, filter by type, preview, copy URL, download, delete
- **Usage:** Copy media URL and paste into blog post content or cover image field

---

## 📝 Blog System

The blog system supports:

- **Rich content:** Markdown formatting with headings, lists, code blocks
- **Inline images:** Upload from device or paste URL — images inserted at cursor position
- **Cover images:** Upload or URL — live preview in editor, auto-set from first inserted image
- **Scheduling:** Select date and time for automatic publishing
- **Persistence:** All posts saved to localStorage (`grg-admin-blog`)
- **Public display:** Blog page reads from localStorage — admin-created posts appear instantly
- **Image placeholders:** Base64 images stored separately, short placeholders in editor

---

## 📅 Booking System

The booking system works end-to-end:

1. **Customer submits** booking on `/contact` → saved to `grg-public-bookings` in localStorage
2. **Ticket ID** generated (GD-XXXX format) → shown on success card
3. **Admin sees** the booking in Bookings Manager → merged from `grg-public-bookings` + `grg-admin-bookings`
4. **Admin updates** status (Pending → In Progress → Ready → Completed) → saved to localStorage
5. **Customer tracks** on `/track` → reads from `grg-public-bookings` → shows status timeline
6. **Overview KPIs** calculated from real booking data in localStorage

### localStorage Keys
| Key | Purpose |
|-----|---------|
| `grg-public-bookings` | Bookings submitted by customers |
| `grg-admin-bookings` | Bookings created in admin |
| `grg-admin-bookings-trash` | Soft-deleted bookings |
| `grg-public-reviews` | Reviews submitted by customers |
| `grg-admin-reviews` | Reviews created in admin |
| `grg-admin-blog` | Blog posts |
| `grg-admin-services` | Services data |
| `grg-admin-media` | Media library files |
| `grg-admin-pages` | Page content editor data |
| `grg-admin-sent-emails` | Sent email log |
| `grg-admin-auth` | Admin auth token (persisted) |

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
- ✅ **All internal links use `<a href>`** for crawler discoverability
- ✅ **OpenGraph + Twitter Card** meta tags
- ✅ **Google site-verification** meta tag
- ✅ **30-day warranty** (not 12-month) — aligned with official T&C
- ✅ No fake promises (no "same-day", no "genuine parts", no "12-month warranty")

---

## 💻 Local Development

### Prerequisites
- [Bun](https://bun.sh/) runtime
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
| Frontend | Firebase Hosting | Static export — all pages, SEO files, SPA, admin panel |
| Backend | Render (Docker) | Next.js server — `/api/*` routes + admin auth |
| Database | Supabase | PostgreSQL (Prisma ORM) |

### Step 1: Supabase Database
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string → Session pooler**
3. Copy the pooler URL (port 5432, IPv4)
4. Run the SQL from `supabase-setup.sql` in Supabase SQL Editor

### Step 2: Render Backend
1. Go to [render.com](https://render.com) → New → Web Service → Docker
2. Connect the GitHub repo
3. Set environment variables:
   - `DATABASE_URL` = Supabase pooler URL
   - `NEXT_PUBLIC_SITE_URL` = `https://gadget-repairs-glasgow.web.app`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
4. Deploy — Dockerfile handles `prisma db push` + `node server.js`

### Step 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
node scripts/build-firebase.mjs
firebase deploy --only hosting --project gadget-repairs-glasgow
```

### Step 4: Custom Domain
Add these DNS records:
```
A     @     151.101.1.195
A     @     151.101.65.195
A     @     151.101.129.195
A     @     151.101.193.195
CNAME www    gadget-repairs-glasgow.web.app.
```

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
│   └── schema.prisma              # 10 Prisma models (PostgreSQL)
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
│   │       ├── public/            # Public API (services, blog, reviews, bookings, track)
│   │       └── admin/             # Admin API (auth, overview, bookings, CRUD, email)
│   ├── components/
│   │   ├── site/                  # Public site components
│   │   │   ├── AppShell.tsx       # Entry point
│   │   │   ├── PublicSite.tsx     # Page switcher
│   │   │   ├── Header.tsx         # Header with mega menu
│   │   │   ├── Footer.tsx         # Footer with sitemap link
│   │   │   ├── staticData.ts      # Static fallback data
│   │   │   ├── serviceContent.ts  # Per-service rich content
│   │   │   └── pages/             # 13 page components
│   │   ├── admin/                 # Admin dashboard components
│   │   │   ├── AdminApp.tsx       # Admin entry point
│   │   │   ├── AdminLayout.tsx    # Sidebar + topbar (13 modules)
│   │   │   ├── AdminLogin.tsx     # Login with offline fallback
│   │   │   └── modules/           # 13 admin modules
│   │   │       ├── OverviewModule.tsx
│   │   │       ├── BookingsModule.tsx
│   │   │       ├── WalkinModule.tsx
│   │   │       ├── ServicesModule.tsx
│   │   │       ├── ReviewsModule.tsx
│   │   │       ├── BlogModule.tsx
│   │   │       ├── PagesModule.tsx
│   │   │       ├── MediaModule.tsx
│   │   │       ├── ContentModule.tsx
│   │   │       ├── BrandingModule.tsx
│   │   │       ├── EmailModule.tsx
│   │   │       ├── CodeModule.tsx
│   │   │       └── SettingsModule.tsx
│   │   └── seo/
│   │       └── SeoHead.tsx        # SPA metadata updates
│   ├── store/
│   │   └── nav.ts                 # Zustand store (navigation + auth + URL sync)
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
├── supabase-setup.sql             # Complete SQL for Supabase
├── DEPLOY.md                      # Detailed deployment guide
├── DNS-MIGRATION.md               # DNS setup guide
└── README.md                      # This file
```

---

## 📞 Business Information

| Field | Value |
|-------|-------|
| **Business Name** | Gadget Repairs Glasgow |
| **Address** | 172 Trongate, Glasgow G1 5EL, United Kingdom |
| **Phone** | +44 7777 200149 |
| **Email** | info@gadgetrepairsglasgow.co.uk |
| **Hours** | Mon–Sat: 9:00 AM – 7:00 PM, Sun: 10:30 AM – 5:30 PM |
| **Rating** | 4.9★ (150+ reviews) |
| **Experience** | 10+ years |
| **Warranty** | 30-day warranty on repairs & replaced parts |

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Blue** | `#1B4F8E` | Primary brand color (header, buttons, links) |
| **Orange** | `#F05A28` | Accent color (CTAs, highlights, stars) |

---

## 📄 Terms & Conditions

The site displays the official 17-clause Terms & Conditions including:
- 30-day warranty (not 12-month)
- £25 fee if repair declined after diagnosis
- Non-refundable repair attempts and parts
- 30-day retention then off-site storage
- 90-day unclaimed devices recycled
- HDD/SSD retained 90 days then disposed per GDPR
- No change-of-mind policy

No fake promises on the site — all claims match the official T&C.

---

## 🙏 Credits

- **Developed by:** [ClickTake Technologies](https://clicktaketech.com/)
- **Powered by:** Next.js, Firebase, Render, Supabase
- **UI Components:** shadcn/ui, Lucide Icons, Tailwind CSS

---

## 📄 License

This project is proprietary and owned by Gadget Repairs Glasgow. All rights reserved.
