# PressClass — PWA Implementation

**Date:** 2026-05-13
**Plan reference:** [`PWA_IMPLEMENTATION_PLAN.md`](./PWA_IMPLEMENTATION_PLAN.md) (copied from `sop-manager-v2`)
**Scope of this pass:** Installable PWA with app-like shell, caching, offline fallback, iOS splash, mobile bottom-tab nav. Offline-data layer deferred.

---

## What's live

### Phase 1 — Web App Manifest
`app/manifest.ts` declares PressClass as installable:
- name / short_name / description
- `start_url: "/dashboard"` so launching from the home screen lands authenticated users straight on the dashboard
- `display: "standalone"` (no browser chrome)
- `theme_color: #0F766E` (primary teal), `background_color: #FFFFFF`
- All 10 icon sizes registered (72→512), plus maskable variants
- App shortcuts for **Generate**, **Notes**, **Lesson plans** (long-press the app icon on Android)

### Phase 2 — Service Worker (Serwist)
- `app/sw.ts` — Serwist source with `skipWaiting`, `clientsClaim`, navigation preload
- `tsconfig.sw.json` — separate TS config for the SW
- `next.config.ts` wrapped in `withSerwist({ swSrc, swDest, reloadOnOnline, disable in dev })`
- `.gitignore` updated to ignore compiled `public/sw.js*`

### Phase 3 — Caching strategies
Custom `runtimeCaching` in `app/sw.ts`:

| Resource | Strategy | TTL | Notes |
|---|---|---|---|
| Static assets (fonts/images/icons) | Cache First | 30 days | |
| `_next/static/*` (hashed) | Cache First | 1 year | Hashed filenames are safe to cache forever |
| `_next/image/*` | Stale-While-Revalidate | 1 day | |
| `images.unsplash.com/*` | Stale-While-Revalidate | 7 days | Hero/feature imagery |
| HTML navigation | Network First | 5s timeout / 1 day cache | |
| Supabase REST/Storage | Network First | 5s / 5 min | |
| Google Fonts | Cache First | 1 year | |

Fallback: any uncached navigation while offline lands on `/offline`.

### Phase 8 — Icons & Splash
- `scripts/generate-icons.mjs` — one-shot generator using `sharp`. Renders an SVG brand mark (`PC` wordmark on the primary teal with an accent corner) at every required size.
- Outputs:
  - `public/icons/icon-{72,96,128,144,152,192,384,512}x{...}.png`
  - `public/icons/icon-maskable-{192,512}x{...}.png`
  - `public/icons/apple-touch-icon.png` (180×180, opaque)
  - `public/favicon-32x32.png`
  - `public/icons/splash/apple-splash-{...}.png` (11 iOS device sizes — iPhone SE through 14 Pro Max + iPad lineup)
- Re-run: `node scripts/generate-icons.mjs`

### iOS PWA / splash wiring
- `appleWebApp: { capable: true, title: "PressClass", statusBarStyle: "default" }` in root metadata
- `viewportFit: "cover"` so the app uses the full screen (handles notches)
- `components/apple-splash-links.tsx` emits 11 `apple-touch-startup-image` `<link>` tags with the precise `media` queries each iPhone/iPad device class expects (Next's metadata API doesn't expose those queries)
- `formatDetection: { telephone: false }` so iOS doesn't auto-linkify phone numbers in our content

### Phase 7 — Offline UX
- `hooks/use-online-status.ts` — `useOnlineStatus()` hook tracking `navigator.onLine`
- `components/offline-banner.tsx` — fixed amber banner at the top when offline (mounted in root layout)
- `app/offline/page.tsx` — friendly fallback page with "go to dashboard / home" actions

### Bottom-tab mobile navigation (your specific ask)
`components/layout/bottom-nav.tsx` — mounted in the protected layout, **mobile only** (`md:hidden`):

| Tab | Route | Notes |
|---|---|---|
| Home | `/dashboard` | Also active on `/search` |
| Plans | `/lesson-plans` | |
| **Generate** (elevated `+` CTA) | `/generator` | Floating primary-color circle |
| Notes | `/notes` | |
| Account | `/account` | Also covers `/credits` |

- `pb-[max(0px,env(safe-area-inset-bottom))]` so the bar clears the iPhone home indicator
- Active tab uses primary color and a thicker icon stroke
- Glassmorphic backdrop, subtle top fade so cards don't feel cut off
- A 20px spacer is added above so content never sits behind the bar

The existing sidebar is unchanged — it still shows on `md:`+. On mobile, the hamburger in the header (Sheet menu) is the secondary nav for less-used routes (Calendar, Study Time, Whiteboard, Credits).

---

## What's deliberately deferred

These are Phases 4–6 + 9 of the plan. None of them are blockers for "installable + app-like":

1. **Offline data layer (IndexedDB)** — Phase 4 requires defining a schema for `notes`, `lesson_plans`, `assessments`, `study_sessions` (+ `sync_queue`) and replacing every write call in the app with a local-first pattern. It's a meaningful rework — best done in its own pass once you confirm the install + cache behavior is what you want.

2. **Background sync queue** — Phase 5. Depends on the offline data layer.

3. **Conflict resolution** — Phase 6. Depends on the offline data layer; needs `updated_at` triggers on the four core tables (only `study_sessions` has one today).

4. **Push notifications** — Phase 9 (optional in the plan). Needs VAPID keys + a server endpoint to store subscriptions. Skip until you have a notification trigger to wire up.

---

## Validation

- ✅ `npm run build` produces `public/sw.js`
- ✅ Manifest resolves at `/manifest.webmanifest` (generated dynamically from `app/manifest.ts`)
- ✅ Apple touch icon + splash links present in `<head>` of every page
- ✅ Offline banner mounts and listens to `online` / `offline` events
- ✅ Service worker disabled in dev (configured via `disable: process.env.NODE_ENV === "development"`)

## Verification checklist post-deploy

When Vercel finishes deploying, in Chrome on mobile:

1. Open `https://press-class-1256.vercel.app/` → "Add to Home Screen" prompt should appear shortly after
2. Install → app opens without browser chrome, with the PressClass icon on the home screen
3. DevTools → Application → Service Workers: shows `sw.js` activated
4. DevTools → Application → Manifest: shows all the metadata above
5. DevTools → Network → throttle to Offline → reload any visited page → loads from cache. Visit a fresh page → `/offline` fallback shows.
6. On real iPhone: install from Safari → splash screen uses the apple-touch-startup-image on launch.

## Files added / modified

**Added**
- `PWA_IMPLEMENTATION_PLAN.md` (the plan itself)
- `app/manifest.ts`
- `app/sw.ts`
- `app/offline/page.tsx`
- `tsconfig.sw.json`
- `scripts/generate-icons.mjs`
- `public/icons/icon-*.png` (10 sizes + 2 maskable + apple-touch + 11 splashes)
- `public/favicon-32x32.png`
- `hooks/use-online-status.ts`
- `components/offline-banner.tsx`
- `components/apple-splash-links.tsx`
- `components/layout/bottom-nav.tsx`
- `CHANGES_PWA.md`

**Modified**
- `next.config.ts` — wrapped with `withSerwist`
- `app/layout.tsx` — manifest link, appleWebApp metadata, viewportFit cover, mounted OfflineBanner + AppleSplashLinks
- `app/(protected)/layout.tsx` — mounted `<BottomNav />`
- `package.json` — added `@serwist/next`, `serwist`, `idb`, `sharp`
- `.gitignore` — ignore generated service worker files
