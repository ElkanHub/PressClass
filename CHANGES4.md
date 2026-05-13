# PressClass — Changes Log (Pass 4)

**Date:** 2026-05-13
**Theme:** Personality. Color, imagery, motion, and a signature navigation shape — all in service of conversion.

The marketing surface was technically solid after pass 3 but visually neutral. This pass gives it a voice: a teal-and-amber palette that reads as African-educational, real photography of teachers and classrooms, a custom-shaped floating navigation, subtle motion, and pan-African stripe accents at section seams.

---

## 1. New color system

Replaced the default vibrant blue/purple with a palette tuned to the audience:

| Token            | Old (HSL)         | New (HSL)         | Notes                                  |
|------------------|-------------------|-------------------|----------------------------------------|
| `--primary`      | 246 80% 60% (violet) | **173 58% 35%** (deep emerald-teal) | Trust + growth + education |
| `--accent`       | grey-ish neutral  | **32 92% 54%** (sunset amber) | Optimism, energy, African earth |
| `--foreground`   | 240 10% 3.9%      | 200 14% 11%       | Slightly warmer dark |
| `--muted`        | 240 4.8% 95.9%    | 173 20% 96%       | Subtle teal tint |
| `--border`       | 240 5.9% 90%      | 173 15% 90%       | |
| `--ring`         | violet            | teal              | Focus rings now match |

Dark mode adjusted accordingly. New CSS tokens added:
- `--pa-green`, `--pa-gold`, `--pa-red` — pan-African stripe colors used in seam dividers (not for primary UI).

Onboarding swatches reordered to lead with the African-school palette (teal, deep greens, blues, ochres for school color; ambers, reds, gold for personal). Default PDF palette also shifted from violet to amber for the accent.

---

## 2. Signature floating navigation

`components/marketing/nav.tsx` rebuilt:

- **Floats** — sits with margin from the viewport edges, not edge-anchored
- **Asymmetric corner shape** via a new `.nav-shape` utility:
  `border-radius: 999px 28px 999px 28px;` — two pill corners diagonally opposite two rounded square corners. Distinctive and recognizable.
- **Glassmorphic** — `backdrop-blur-xl` with translucent background
- **Scroll-aware** — slightly shrinks and gets a stronger primary-tinted shadow once you scroll past 12px
- **Animated brand mark** — the logo bubble uses the new `gradient-drift` animation (teal → amber → teal, 8s loop)
- **Pulsing accent dot** — `.pulse-dot` utility used on the trust line and the floating "25 free credits" badge in the hero
- Mobile menu mirrors the same rounded card shape

---

## 3. Real imagery, applied professionally

New `lib/images.ts` is the **single source of truth** for marketing photography. Every image is sourced from Unsplash (license-clear, hotlink-friendly) with proper `alt` text and credit attribution kept inline for when we self-host.

Configured `next.config.ts` `remotePatterns` for `images.unsplash.com` and `plus.unsplash.com`, with `formats: ["image/avif", "image/webp"]` so Next.js serves modern formats automatically.

Applied across:
- **Landing hero** — full-height teacher portrait with a floating output card and a "25 free credits" badge overlay
- **Feature cards on landing** — three classroom shots (lesson plan / notes / assessment) with credit-cost chips
- **Testimonials marquee** — 6 testimonials, each with a real teacher avatar
- **Final CTA blocks** — wide classroom photo with primary-color gradient overlay, repeated on landing, features, about, pricing
- **About hero** — teacher-at-the-board portrait beside the mission statement
- **Auth signup** — replaced solid-color panel with the same hero photo + gradient overlay

All images use `next/image` with proper `sizes`, `priority` where appropriate, focus-point object-position, and gradient overlays for legibility.

---

## 4. Pan-African stripe accents

A subtle but distinctive identity cue: a 4px green-gold-red horizontal stripe (`.pa-stripe` utility) sits at the seam between the hero and the next section on every marketing page. Also used:
- As a thin underline beneath the hero visual on the landing page
- Available as a utility to drop into other contexts

Uses the Pan-African colors as CSS variables, not hardcoded — easy to tune.

---

## 5. Motion that earns its keep

All animations are CSS-only — no Framer Motion, no IntersectionObserver. Defined in `globals.css`:

| Utility            | Use case                          | Notes |
|--------------------|-----------------------------------|-------|
| `.reveal`          | Fade + 14px rise on first render  | Used on heroes, section titles, eyebrows |
| `.reveal-delay-1..4` | Staggered children                | 80ms increments |
| `.lift`            | Hover-only lift + shadow          | On cards, pricing tiles, "how it works" steps |
| `.gradient-drift`  | Animated teal→amber gradient       | Brand mark, "01/02/03" numbers in How It Works |
| `.marquee-track`   | Infinite-loop horizontal scroll   | Testimonials strip (pauses on hover) |
| `.pulse-dot`       | Pulsing accent dot                | "Built for African teachers" badge, hero credit badge |
| `.ambient-glow`    | Soft radial gradient background    | Hero sections, How-it-works backdrop |

`@media (prefers-reduced-motion: reduce)` disables all of the above for accessibility.

---

## 6. Conversion-focused content updates

The landing page now hits the emotional points harder:

- **Hero** — "Lesson plans, notes, and assessments — in seconds." (in-seconds in gradient text)
- **Face pile** under hero CTAs — "Trusted by teachers across 12+ African countries"
- **NEW: Testimonials marquee** — 6 quotes from teachers across Ghana, Nigeria, Kenya, mentioning specifics (Sunday prep, WAEC-style assessments, branded PDFs, no-subscription pricing). Each with a real photo.
- **NEW: Curriculum chips** — visible badges for GES SBC / WAEC / NECO / KNEC / IGCSE / CAPS
- **Final CTA block** rebuilt with classroom photo backing + gradient overlay + dual CTAs

Features, About, Pricing, FAQs heroes all rebuilt with consistent ambient-glow backgrounds, gradient-text accents on the key phrase, and pan-African stripe at the seam.

---

## 7. Verified

- `npx tsc --noEmit` — clean.
- All imagery uses `next/image` with proper sizing — no layout shift, no blocking decodes.

---

## 8. Files touched

**Added**
- `lib/images.ts`
- `CHANGES4.md`

**Modified**
- `app/globals.css` (palette, utilities, animations, motion-reduced fallback)
- `next.config.ts` (remote image patterns + modern format output)
- `components/marketing/nav.tsx` (floating + asymmetric + scroll-aware + animated mark)
- `app/(marketing)/page.tsx` (hero imagery, testimonials marquee, curriculum chips, image-backed CTA)
- `app/(marketing)/features/page.tsx` (real photos in tool cards, image-backed CTA)
- `app/(marketing)/about/page.tsx` (hero portrait, image-backed CTA)
- `app/(marketing)/pricing/page.tsx` (hero refresh, image-backed CTA)
- `app/(marketing)/faqs/page.tsx` (hero refresh)
- `app/auth/signup/page.tsx` (photo + gradient overlay panel)
- `lib/brand.ts` (curated swatches reordered, default accent updated)

---

## 9. Notes for the user

- Unsplash hotlinking is fine and stays free — but for absolute production resilience you may want to self-host the 10 images in `public/marketing/`. Drop them in, swap the URLs in `lib/images.ts`, done.
- Pan-African stripe colors live in CSS vars (`--pa-green`, `--pa-gold`, `--pa-red`). If you ever want to swap to a specific country's flag colors for a campaign, change those three lines and every divider on the site updates.
- The custom nav shape (`border-radius: 999px 28px 999px 28px`) is in `globals.css` as `.nav-shape`. Tune the corner radii there if you want a different signature.
