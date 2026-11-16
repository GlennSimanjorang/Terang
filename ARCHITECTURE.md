# TERANG website architecture

## Current project

The repository is a small Next.js App Router project using Next.js 16.4.6, React 19.3.1, and TypeScript 6.0.3. It has no UI, animation, or i18n dependencies. The existing `app/page.tsx`, `app/layout.tsx`, and `app/globals.css` are the starter screen and its styles. No Figma exports, brand assets, or approved design tokens are present yet.

Keep the existing root-level `app/` convention. Use the App Router for routes and layouts, React Server Components by default, and client components only for interactions that need browser state. Keep the current dependencies; a small two-language site does not need an i18n package until translation needs outgrow static locale dictionaries.

## Target structure

```text
app/
  [locale]/
    layout.tsx             # Locale validation, metadata, document language
    page.tsx                # Home composition
    projects/[slug]/page.tsx # Add when project detail pages are required
  globals.css               # Global reset and token import
next.config.ts              # Simple / -> default-locale redirect
components/
  layout/                   # Header, Footer
  navigation/               # DesktopNav, MobileNav, MobileMenuOverlay, LanguageSwitcher
  ui/                       # Button, SectionHeading, ProjectCard
  animation/                # Small reusable reveal wrapper only if needed
sections/                   # Hero, ProjectGallery, Services, About, Contact
public/assets/
  brand/ hero/ projects/ showreels/ icons/ team/
styles/
  tokens.css                # Figma-derived CSS custom properties
locales/
  en.json
  id.json
data/                       # Locale-neutral project/service records and navigation
lib/                         # Locale helpers and small shared utilities
hooks/                       # Browser-only hooks, added when needed
types/                       # Shared content types, added when needed
config/                      # Site-wide constants, added when needed
```

`app/[locale]/layout.tsx` is the shared page layout; a separate top-level `layouts/` folder would duplicate App Router's layout role. Keep `hooks/`, `types/`, and `config/` empty until there is code to put in them. The folder scaffold is in place; the current starter route remains unchanged until implementation begins.

## Component hierarchy

```text
LocaleLayout
└── HomePage
    ├── Header
    │   ├── DesktopNav
    │   ├── MobileNav
    │   ├── MobileMenuOverlay
    │   └── LanguageSwitcher
    ├── Hero
    ├── ProjectGallery
    │   └── ProjectCard → ProjectPreview or /projects/[slug]
    ├── Services
    ├── About
    ├── Contact
    └── Footer
```

Sections own their semantic section markup and compose smaller components. Use shared `Button` and `SectionHeading` primitives where the Figma shows the same treatment. Avoid a generic component framework or an animation wrapper until repeated behavior exists.

## Bilingual content

Use `/en` and `/id` as the source of truth for language. The locale switcher changes the locale segment while preserving the current route or section anchor. This keeps navigation, reloads, and shared links in the selected language without client storage. Redirect `/` to the agreed default locale in `next.config.ts` and validate locale segments in the locale layout. Add Proxy only if locale negotiation later needs request headers or cookies.

Store UI copy in `locales/en.json` and `locales/id.json` with matching nested keys (for example `navigation`, `hero`, `services`, `about`, and `contact`). Keep project facts and service records in `data/`; store localized fields by locale key rather than duplicating page components. Add another locale by adding a dictionary and extending the locale type/validation.

## Assets and responsive loading

Place static, public assets under `public/assets/` by role. Name files in lowercase kebab case with project or subject, role, and optional width, for example `festival-opening-hero-1920.avif`, `brand-wordmark.svg`, and `festival-opening-thumb-640.webp`. Keep source video in `showreels/` and use poster images for previews. Prefer AVIF/WebP for raster imagery and SVG for logos/icons when supplied. Use Next.js `Image` for responsive images with known dimensions or `fill` plus an accurate `sizes` value; lazy-load below-the-fold media and prioritize only the actual hero asset.

## Design tokens

Put Figma-approved values in `styles/tokens.css` as CSS custom properties grouped by color, type, spacing, radius, layout, breakpoints, and motion. Components consume semantic names (such as `--color-text` and `--space-section`) rather than raw values. Do not fill brand colors, font families, spacing scales, or breakpoint numbers until the Figma variables and target frames are available. Define button and section treatments in component styles using these tokens.

## Motion and accessibility

Prefer CSS transitions/animations for hero entrance, text reveal, hover, and mobile menu states. Use Intersection Observer only if the Figma requires scroll-triggered reveals that CSS cannot provide. Keep timing/easing as tokens and provide a `prefers-reduced-motion: reduce` override that removes nonessential movement. Keep menu state and focus handling in the mobile navigation client component; preserve semantic buttons, visible focus, keyboard dismissal, and `aria-expanded`/`aria-controls`. Use native anchor scrolling for section navigation unless a demonstrated requirement needs custom scrolling.

## Responsive approach

Use one DOM/component structure with CSS Grid/Flexbox and fluid sizing. Derive breakpoints from the actual Figma desktop, tablet, and mobile frames; avoid invented breakpoint values and separate device-specific pages. Use `clamp()` only where it matches the approved type/spacing behavior, and set image `sizes` to match the gallery layout at each breakpoint.

## Metadata and implementation order

Use the App Router Metadata API for localized title, description, canonical/alternate language URLs, and social preview metadata when approved images exist. Keep page metadata descriptive without inventing company claims.

1. Confirm Figma frame sizes, variables, fonts, copy, and supplied asset inventory.
2. Add locale routes/dictionaries and the default-locale behavior.
3. Map approved variables into tokens and establish the responsive container/grid.
4. Build the shared header, navigation, footer, and primitives.
5. Build the homepage sections and gallery from approved copy/assets.
6. Add interaction and motion details, then localized metadata and accessibility/performance review.

No full page, copy, visual tokens, or business details were implemented as part of this architecture setup.
