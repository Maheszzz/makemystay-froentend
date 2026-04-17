# Post-Deploy Verification Checklist

Run these after every production deploy that touches SEO, routing, or prerender config.

## 1. Prerender — bots see real HTML

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://makemystay.ai/pg/bangalore | grep -c "<h1\|listing\|property"
```

Expected: > 0  
If 0: `PRERENDER_TOKEN` not set or prerender service down

## 2. Homepage schema depth

```bash
curl -s -A "Googlebot" https://makemystay.ai/ | grep -c "application/ld+json"
```

Expected: 2  
If 0: schema injection broken or prerender not serving

## 3. Canonical tags — no query params

```bash
curl -s -A "Googlebot" https://makemystay.ai/pg/bangalore \
  | grep -o '<link rel="canonical"[^>]*>'
```

Expected: `href="https://makemystay.ai/pg/bangalore"`  
If shows `?cat=` params: canonical logic broken

## 4. Legacy redirect working

```bash
curl -sI "https://makemystay.ai/properties?cat=pg" | grep -i "location"
```

Expected: `location: https://makemystay.ai/pg/bangalore`  
If missing: SPA may still load (HTTP 200) — check **nginx** `location = /properties` on EC2 ([`deploy/prerender-hosts.md`](./prerender-hosts.md)) or client redirect in `App.tsx`

## 5. Noindex on thin pages

```bash
curl -s -A "Googlebot" https://makemystay.ai/buy/in/bangalore \
  | grep "noindex"
```

Expected: `noindex` in meta robots tag  
If missing: `buildPageSEO` threshold check broken

## 6. Sitemap accessible

```bash
curl -s https://makemystay.ai/sitemap.xml | grep -c "<url>"
```

Expected: > 90  
If 0: sitemap not built or not served

## GSC Actions (after prerender confirmed working)

1. Search Console → Sitemaps → submit `https://makemystay.ai/sitemap.xml`
2. URL Inspection → request indexing for:
   - `https://makemystay.ai/`
   - `https://makemystay.ai/pg/bangalore`
   - `https://makemystay.ai/rent/bangalore`
   - `https://makemystay.ai/faq`
   - `https://makemystay.ai/blog/rental-agreement-bangalore`
3. Rich Results Test:
   - `https://makemystay.ai/` → expect LocalBusiness + WebSite
   - `https://makemystay.ai/faq` → expect FAQPage
   - `https://makemystay.ai/pg/bangalore` → expect FAQPage
   - `https://makemystay.ai/rent/bangalore` → expect FAQPage
