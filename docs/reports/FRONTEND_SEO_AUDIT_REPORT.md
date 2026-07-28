# MakeMyStay Frontend SEO Audit Report

Date: 2026-07-02

## Scope Audited

- Next App Router metadata bridge and client SEO head fallback
- Public route metadata for homepage, listing hubs, PG/rent localities, blogs, comparisons, policies, and property detail pages
- Property detail structured data and crawler-visible PDP content
- Image handling through `next/image` wrapper
- Sitemap, robots, and deployment SEO artifacts already present in `public/`, `dist/`, and deployment scripts

The repository is a Next/Vite React app rather than a pure Vite SPA. The SEO implementation therefore prioritizes SSR/App Router metadata while keeping the client head updater for hydrated route transitions.

## Critical

- Public pages need one canonical metadata contract across SSR and client transitions. The central metadata bridge and client updater now share author, publisher, theme color, language, geo, canonical, robots, OpenGraph, and Twitter fields.
- Property PDP rich results need complete entity context. Property schema now includes Product, Accommodation, Residence, Apartment when applicable, Offer, AggregateRating, Review, Breadcrumb, WebPage, ImageObject, and LocalBusiness context.

## High

- Property pages need crawlable quality content beyond the interactive UI. The hidden crawler-visible PDP block now includes highlights, amenities, neighborhood guide, commute, tech parks, schools, hospitals, restaurants, shopping, house rules, availability, reviews, FAQs, and related links.
- Search/filter pages must avoid crawl traps. Existing route SEO already noindexes dirty PG query strings and limits listing pagination canonicalization.
- Images are mostly handled by `next/image` through `OptimizedImage`, giving lazy loading, responsive sizing, WebP/AVIF where supported, and priority loading for hero images.

## Medium

- Locality and city pages already exist for key Bangalore areas through PG locality data, route metadata, and internal link hubs. Further expansion should be data-driven from GSC impressions and inventory coverage.
- Semantic HTML is generally strong on PDP and hub pages: visible PDP keeps one H1, with section H2s for details, about, gallery, amenities, and related content.
- Accessibility foundations are present through semantic nav, aria labels, Next image alt text, and keyboardable buttons/links. A full WCAG AA pass still requires browser-based axe testing.

## Low

- Legacy `index.html` metadata remains for Vite mode, but production Next metadata is the authoritative path.
- Lighthouse scores require a deployed production run because third-party scripts, image CDN behavior, and live API timing affect LCP/INP.

## Fixes Implemented

- Added shared publisher, author, theme color, and geo constants.
- Enriched SSR metadata via `pageSeoToMetadata`.
- Enriched client metadata fallback via `useClientSeoHead`.
- Added fuller robots directives with Googlebot image/snippet/video preview hints.
- Added property ImageObject schema nodes and primary image references.
- Added LocalBusiness context to property detail schema.
- Added Apartment type for flat/apartment PDPs.
- Expanded crawler-visible property detail content and internal links.

## Remaining Recommendations

- Run Lighthouse CI and axe against production pages: `/`, `/pg/bangalore`, one locality page, one property PDP, `/blog`, and a filtered listing page.
- Use GSC query data to prioritize city/locality templates for Bellandur, Marathahalli, Whitefield, Kadubeesanahalli, HSR, Koramangala, Electronic City, Sarjapur, and Outer Ring Road.
- Add automated checks for duplicate `<title>`, duplicate canonical, heading hierarchy, missing alt text, and internal link count.
- Validate generated JSON-LD with Google Rich Results Test after deployment.

## Estimated Lighthouse Scores After These Changes

- Performance: 80-90, depending on third-party scripts and live image/API timing.
- SEO: 95-100 for SSR metadata/schema coverage.
- Accessibility: 85-95 pending axe/browser validation.
- Best Practices: 90-100 pending production headers and third-party script behavior.

## Suggested Commit Message

feat(frontend): enterprise frontend seo optimization
