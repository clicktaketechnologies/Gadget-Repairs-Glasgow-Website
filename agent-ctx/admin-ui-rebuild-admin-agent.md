# Task: Admin Dashboard Rebuild — Work Record

**Agent**: Admin UI agent
**Task ID**: admin-ui-rebuild
**Date**: 2026-10-21

## Summary

Recreated the entire `src/components/admin/` directory (lost in a build wipe) for the
Gadget Repairs Glasgow admin dashboard. The dashboard is exposed on the `/` route via
`src/app/page.tsx` → `src/components/site/AppShell.tsx` → `@/components/admin/AdminApp`.

## Files Created (19)

### Helpers & small components
1. `src/lib/admin-fetch.ts` — `adminFetch()` + `adminJson()` helpers. Injects
   `Authorization: Bearer <token>` from the nav store; on 401 calls
   `clearAdminAuth()` and shows a "Session expired" sonner toast.
2. `src/components/admin/StatusBadge.tsx` — coloured badge using
   `STATUS_COLORS` from `@/lib/utils2`.
3. `src/components/admin/StarRow.tsx` — 5-star rating renderer.
4. `src/components/admin/ServiceIcons.tsx` — maps icon strings
   (Smartphone, Laptop, Tablet, Gamepad2, Monitor, Watch, Zap, Wrench) to Lucide.

### Shell
5. `src/components/admin/AdminLogin.tsx` — gradient login screen with
   "Fill demo" button → POST /api/admin/auth → setAdminAuth → goAdmin("admin-overview").
6. `src/components/admin/AdminLayout.tsx` — fixed 240px sidebar
   (`from-blue-900 to-slate-900`), logo, three nav groups (MAIN / CMS / CONFIG),
   "View site" + "Logout" buttons, topbar with page title + admin email,
   mobile Sheet drawer, active link uses `bg-blue-600`.
7. `src/components/admin/AdminApp.tsx` — gate: no token → `<AdminLogin/>`,
   else `<AdminLayout>` with the active module.

### Modules (12)
8. `modules/OverviewModule.tsx` — 6 KPI cards, recharts AreaChart (14-day
   trend, 4 series), PieChart (device types), recent bookings table.
9. `modules/BookingsModule.tsx` — search + status filter + CSV export,
   table, detail Dialog (status/notes/prices editable), reply-to-customer
   email Dialog, delete with AlertDialog.
10. `modules/WalkinModule.tsx` — quick-add walk-in form → POST /api/admin/walkin.
11. `modules/ServicesModule.tsx` — services grouped by category, instant
    popular/active Switch toggles (PATCH), Add/Edit Dialog, Delete (AlertDialog).
12. `modules/ReviewsModule.tsx` — Pending/Approved/All tabs, instant approve
    toggle, Add/Edit Dialog, Delete.
13. `modules/ContentModule.tsx` — toggle cards (collection enabled, banner,
    announcement, ticket visible) + announcement text → PUT /api/admin/content.
14. `modules/BrandingModule.tsx` — long form (identity, colours, contact,
    location w/ service-areas editor, opening hours, social, stats). Parses
    hoursJson/socialsJson/targetAreasJson into editable UI.
15. `modules/BlogModule.tsx` — table with instant published/featured toggles,
    Add/Edit Dialog (title, slug, excerpt, markdown content, cover, category,
    tags, author, published, featured), Delete.
16. `modules/PagesModule.tsx` — 6-page tabs, editable section/key/value rows,
    bulk save.
17. `modules/EmailModule.tsx` — SMTP form, test email button, sent-email log.
18. `modules/CodeModule.tsx` — header/footer code textareas,
    Google site-verification field, save.
19. `modules/SettingsModule.tsx` — change password form (current/new/confirm),
    session info, logout button.

## Supporting files

- **`src/store/nav.ts`** — created the Zustand store with the API specified in
  the task (`useNav`, `goAdmin`, `goPublic`, `clearAdminAuth`, `setAdminAuth`,
  `adminToken`, `adminEmail`, `Route = { kind: "admin"; page: AdminPage }`).
  Extended with `Branding`/`SiteSettings` types, `setBootstrap`, `branding`,
  `settings`, `navigate`, `verifyToken`, `installUrlSync`, and
  `"admin-login"` page so the other agent's `src/components/site/AppShell.tsx`
  (which was being recreated in parallel) also resolves cleanly.
- **`public/logo.jpg`** — generated a 1024×1024 brand logo (blue/orange,
  smartphone+wrench mark) used in the login screen and sidebar.
- **`src/app/page.tsx`** — updated to render the admin dashboard on `/`.
  (Was later overwritten by the site agent to use `AppShell`; both versions
  work because AppShell routes to `AdminApp` when `route.kind === "admin"`.)

## Design notes

- Primary blue `#1b4f8e`, accent orange `#f05a28`. NO teal/amber in the chrome.
- Status colours come from `STATUS_COLORS` in `@/lib/utils2` so the admin and
  public site stay in sync.
- Loading skeletons, empty states, and sonner toasts on every async action.
- Mobile-responsive: sidebar collapses to a Sheet drawer below `lg`.
- All API calls go through `adminJson`/`adminFetch` for consistent auth and
  401 handling.

## Verification

- `bun run lint` → **0 errors, 0 warnings** (after fixing the `module`
  reserved-word issue in AdminApp and the `setState`-in-effect issue in
  OverviewModule).
- `curl -X POST /api/admin/auth` returns a valid token.
- All 11 admin GET endpoints return 200 with the Bearer token.
- `/` returns 200 and renders the admin login screen.
