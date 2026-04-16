# SEO: post-deploy checks (Google Search Console)

After shipping changes to page titles, descriptions, or canonical URLs, validate and speed up discovery:

1. Open [Google Search Console](https://search.google.com/search-console) for the `makemystay.ai` property.
2. Use **URL Inspection** on a representative set of URLs, for example:
   - Homepage: `https://makemystay.ai/`
   - Main listing hubs: `https://makemystay.ai/pg`, `https://makemystay.ai/rent`, `https://makemystay.ai/properties`
   - A few locality listing URLs: `https://makemystay.ai/pg/{slug}`
   - A few property detail URLs: `https://makemystay.ai/pg/{property-slug}`
3. For each URL, confirm the **indexed** / **live** view shows the expected `<title>` and meta description (or use “View crawled page” / “Test live URL” as available).
4. Click **Request indexing** where you need Google to recrawl sooner.

**Expectations:** Search results and GSC title snippets often lag by **7–14+ days** after a recrawl; duplicates and soft issues can take multiple passes to clear.

This app is a **Vite + React** SPA: titles are set via `react-helmet-async` after load; the root `index.html` provides a short, brand-aligned fallback for first paint and limited crawlers.
