# Task List for SEO Enhancement Sprint

- [ ] **Phase 1 – Immediate Fixes**
  - [ ] Verify robots.txt and sitemap URLs (already done).
  - [ ] Add Global JSON‑LD component (`GlobalJsonLd.tsx`).
  - [ ] Update layout (`src/app/layout.tsx` or `_app.tsx`) to include `GlobalJsonLd`.
  - [ ] Extend `ResearchHub.tsx` with FAQ JSON‑LD for the research hub.
  - [ ] Enhance property detail pages with RealEstateListing schema and FAQ schema.
  - [ ] Ensure canonical tags and OG/Twitter meta are present via `SeoHead`.

- [ ] **Phase 2 – Area Landing Pages (Highest Priority)**
  - [ ] Create data file `src/data/localities.json` with entries for Whitefield, HSR Layout, Koramangala, Marathahalli, Bellandur, Electronic City.
  - [ ] For each locality, add a directory under `src/app/`:
    - `pg-in-whitefield/page.tsx`
    - `pg-in-hsr-layout/page.tsx`
    - `pg-in-koramangala/page.tsx`
    - `pg-in-marathahalli/page.tsx`
    - `pg-in-bellandur/page.tsx`
    - `pg-in-electronic-city/page.tsx`
  - [ ] Each page renders:
    - H1 title
    - Intro paragraph (≈150‑200 words)
    - PG price table / summary
    - Nearby companies list
    - Nearby metro stations list
    - FAQ section (visible to users)
    - Links to actual PG listings (e.g., `/pg/whitefield` etc.)
    - FAQ JSON‑LD via `FaqJsonLd` component.
  - [ ] Add SEO helper `areaPageSeo(areaName, slug)` returning appropriate meta tags.
  - [ ] Update sitemap generation script to include these new pages.

- [ ] **Phase 3 – Property‑Level FAQ Schema**
  - [ ] Create `src/components/seo/FaqJsonLd.tsx`.
  - [ ] Import and use it in `src/views/PropertyDetails.tsx` (or equivalent) to emit FAQ JSON‑LD based on property fields.

- [ ] **Phase 4 – Blog Content**
  - [ ] Scaffold 20 markdown/blog files under `src/app/blog/` (e.g., `best-pg-whitefield-2026.mdx`).
  - [ ] Each article ~800–1000 words, includes internal links to locality pages.

- [ ] **Phase 5 – Title Improvements**
  - [ ] Update SEO title templates in `src/lib/seo.ts` to match the new format (e.g., `1 BHK for Rent in HSR Layout Bangalore | ₹25,000 | MakeMyStay`).

- [ ] **Phase 6 – Backlink Outreach**
  - [ ] No code change – prepare outreach list (Quora, Reddit, LinkedIn, Medium, etc.).

**Note**: Tasks are ordered to maximize early SEO impact. Subsequent phases depend on the completion of earlier ones.
