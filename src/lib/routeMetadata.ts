import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS, getBlogPost } from '@/data/blogPosts';
import { getPgNearLandmarkByPath } from '@/data/pgNearLandmarks';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';
import { getTechParkByPath } from '@/data/techParks';
import { generateTechParkLandingProfile } from '@/lib/landing';
import { generateProgrammaticBlogPost } from '@/lib/blog';
import { getLocalitySeoProfile } from '@/lib/locality';
import { buildTechParkMeta } from '@/lib/techParkContent';
import { buildNearbyLandmarkSeo } from '@/lib/seoIntentGenerators';
import {
    buildAboutPageSEO,
    buildBlogIndexSEO,
    buildContactPageSEO,
    buildFaqPageSEO,
    buildFlatsInBangaloreSEO,
    buildHomeSEO,
    buildHowWeVerifyPageSEO,
    buildNoindexUtilitySEO,
    buildPgNearMeSEO,
    buildPrivacyPageSEO,
    buildReportsPageSEO,
    buildResearchPageSEO,
    buildRefundPolicyPageSEO,
    buildStatisticsPageSEO,
    buildTermsPageSEO,
    buyBangaloreHubSeo,
    listingsPageSeo,
    pgBangaloreHubSeo,
    pgFeatureLandingSeo,
    pgFeaturePathToKind,
    pgGenderLocalitySeo,
    pgLocationSeo,
    pgVsFlatBangaloreSeo,
    plotBangaloreHubSeo,
    rentBangaloreHubSeo,
    rentLocationHubSeo,
    type PageSEOInput,
} from '@/lib/seo';
import { getLocalityComparison } from '@/data/localityComparisons';
import { resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { buildTextOgImageUrl } from '@/lib/ogImage';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { SITE_URL } from '@/lib/siteConfig';
import { OFFICES } from '@/data/offices';

function pgHyderabadHubSeo(): PageSEOInput {
    return {
        title: 'Best PG in Hyderabad — Verified, Zero Brokerage',
        description:
            'Browse verified PGs in Hyderabad near HiTech City, Gachibowli & Madhapur. Zero brokerage, real photos, transparent pricing on MakeMyStay.ai.',
        path: '/pg/hyderabad',
    };
}

function pgPuneHubSeo(): PageSEOInput {
    return {
        title: 'Best PG in Pune — Verified, Zero Brokerage',
        description:
            'Find verified PGs in Pune — Hinjewadi, Wakad, Kothrud & more. Real photos, zero brokerage on select stays on MakeMyStay.ai.',
        path: '/pg/pune',
    };
}

function rentHyderabadHubSeo(): PageSEOInput {
    return {
        title: 'Flats & Houses for Rent in Hyderabad — Zero Brokerage',
        description:
            'Browse verified rentals in Hyderabad — HiTech City, Gachibowli, Kondapur. Real photos, transparent rent on MakeMyStay.ai.',
        path: '/rent/hyderabad',
    };
}

function rentPuneHubSeo(): PageSEOInput {
    return {
        title: 'Flats & Houses for Rent in Pune — Zero Brokerage',
        description:
            'Verified flats and homes for rent in Pune — compare rent across Hinjewadi, Wakad & Kothrud on MakeMyStay.ai.',
        path: '/rent/pune',
    };
}

const PG_FEATURE_SLUGS: Record<string, 'wifi' | 'food' | 'ac'> = {
    'pg-with-wifi': 'wifi',
    'pg-with-food': 'food',
    'pg-with-ac': 'ac',
};

function hubSlugToPgSlug(hubSlug: string): string {
    return hubSlug === 'btm-layout' ? 'btm' : hubSlug;
}

/** `/compare/:pair` — locality comparison pages (AEO). */
export async function resolveComparisonMetadata(pair: string): Promise<Metadata> {
    const cmp = getLocalityComparison((pair || '').toLowerCase());
    if (!cmp) {
        return pageSeoToMetadata({
            title: 'Comparison not found',
            description: 'Browse PG locality comparisons in Bangalore on MakeMyStay.ai.',
            path: '/pg/bangalore',
            noindex: true,
        });
    }
    const path = `/compare/${cmp.pairSlug}`;
    return pageSeoToMetadata({
        title: cmp.title,
        description: cmp.description,
        path,
        ogImage: buildTextOgImageUrl({
            title: cmp.title,
            location: `${cmp.left.name} vs ${cmp.right.name}`,
            type: 'PG comparison',
        }),
    });
}

/** `/pg/:slug` — mirrors `PgSlugRoute` + `PGLocationPage` SEO. */
export async function resolvePgSlugMetadata(slug: string): Promise<Metadata> {
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return resolvePropertyPageMetadata(param);
    }

    if (param === 'bangalore') return pageSeoToMetadata(pgBangaloreHubSeo());
    if (param === 'hyderabad') return pageSeoToMetadata(pgHyderabadHubSeo());
    if (param === 'pune') return pageSeoToMetadata(pgPuneHubSeo());

    const feature = PG_FEATURE_SLUGS[param];
    if (feature) return pageSeoToMetadata(pgFeatureLandingSeo(feature));

    if (param === 'pg-vs-flat-bangalore') return pageSeoToMetadata(pgVsFlatBangaloreSeo());

    const legacy = resolveLegacyPgSlug(param);
    if (legacy) {
        const legacySeoProfile = getLocalitySeoProfile(legacy);
        if (legacySeoProfile) return legacySeoProfile.metadata;

        const loc = getPgLocationBySlug(legacy);
        if (loc) {
            const seo = pgLocationSeo(loc.name, loc.slug);
            return pageSeoToMetadata({
                ...seo,
                ogImage: buildTextOgImageUrl({
                    title: seo.title,
                    location: loc.name,
                    type: 'PG in Bangalore',
                }),
            });
        }
    }

    const localitySeoProfile = getLocalitySeoProfile(param);
    if (localitySeoProfile) {
        return localitySeoProfile.metadata;
    }

    const loc = getPgLocationBySlug(param);
    if (loc) {
        const profile = resolveLocalityProfile(loc.slug);
        const seo = pgLocationSeo(loc.name, loc.slug);
        return pageSeoToMetadata({
            ...seo,
            description: profile.quickAnswer.slice(0, 160),
            ogImage: buildTextOgImageUrl({
                title: seo.title,
                location: loc.name,
                type: 'PG in Bangalore',
            }),
        });
    }

    return resolvePropertyPageMetadata(param);
}

/** `/rent/:slug` — mirrors `RentSlugRoute` + `RentLocationPage`. */
export async function resolveRentSlugMetadata(slug: string): Promise<Metadata> {
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        return resolvePropertyPageMetadata(param);
    }

    if (param === 'bangalore') return pageSeoToMetadata(rentBangaloreHubSeo());
    if (param === 'hyderabad') return pageSeoToMetadata(rentHyderabadHubSeo());
    if (param === 'pune') return pageSeoToMetadata(rentPuneHubSeo());

    const loc = getPgLocationBySlug(param);
    if (loc) return pageSeoToMetadata(rentLocationHubSeo(loc.name, loc.slug));

    return resolvePropertyPageMetadata(param);
}

export function resolvePgGenderLocalityMetadata(
    slug: string,
    variant: 'boys' | 'girls' | 'men' | 'women',
): Metadata {
    const param = (slug || '').toLowerCase();
    const loc = getPgLocationBySlug(param);
    const name = loc?.name ?? param.replace(/-/g, ' ');
    const gender =
        variant === 'men' ? 'men' : variant === 'women' ? 'women' : variant === 'boys' ? 'male' : 'female';
    return pageSeoToMetadata(pgGenderLocalitySeo(name, param, gender));
}

export function resolveBlogSlugMetadata(slug: string): Metadata {
    const profile = generateProgrammaticBlogPost(slug);
    if (profile) {
        return profile.metadata;
    }
    const post = getBlogPost(slug);
    if (!post) {
        return pageSeoToMetadata({
            title: 'Article not found',
            description: 'This blog post does not exist. Browse PG and rental guides on MakeMyStay.ai.',
            path: `/blog/${slug}`,
            noindex: true,
        });
    }
    const cover = post.imageUrl?.startsWith('http')
        ? post.imageUrl
        : post.imageUrl
          ? `${SITE_URL}${post.imageUrl}`
          : undefined;
    return pageSeoToMetadata(
        {
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            ogImage: cover,
        },
        { openGraphType: 'article' },
    );
}

/** `/pg-near-[tech-park]` — rich tech park pillar page metadata. */
export function resolveTechParkMetadata(pathname: string): Metadata {
    const seg = pathname.replace(/^\/+|\/+$/g, '').replace(/^pg-near\//, '');
    const profile = generateTechParkLandingProfile(seg);
    if (profile) {
        return profile.metadata;
    }
    const park = getTechParkByPath(seg);
    if (park) {
        const meta = buildTechParkMeta(park);
        return pageSeoToMetadata({
            title: meta.title,
            description: meta.description,
            path: meta.path,
            ogImage: meta.ogImage,
        });
    }
    // Fallback to legacy landmark SEO
    return resolveLandmarkPathMetadata(pathname);
}

export function resolveLandmarkPathMetadata(pathname: string): Metadata {
    const entry = getPgNearLandmarkByPath(pathname);
    if (!entry) {
        return pageSeoToMetadata({
            title: 'PG near landmark',
            description: 'Browse verified PG stays near major Bangalore tech parks on MakeMyStay.ai.',
            path: pathname,
            noindex: true,
        });
    }
    const loc = getPgLocationBySlug(entry.hubSlug);
    const name = loc?.name ?? entry.hubSlug;
    // Prefer tech park rich metadata if available
    const park = getTechParkByPath(entry.path);
    if (park) {
        const meta = buildTechParkMeta(park);
        return pageSeoToMetadata({
            title: meta.title,
            description: meta.description,
            path: meta.path,
        });
    }
    return pageSeoToMetadata(buildNearbyLandmarkSeo(entry.landmark, name, `/${entry.path}`));
}

/** Flat SEO URLs handled by `[...path]` catch-all. */
export function resolveCatchAllPathMetadata(pathKey: string): Metadata {
    const path = pathKey.startsWith('/') ? pathKey : `/${pathKey}`;
    const seg = path.replace(/^\//, '');

    if (seg === '404') {
        notFound();
    }

    const rentIn = seg.match(/^rent-in-(.+)$/);
    if (rentIn) {
        const slug = hubSlugToPgSlug(rentIn[1]);
        const loc = getPgLocationBySlug(slug);
        if (loc) return pageSeoToMetadata(rentLocationHubSeo(loc.name, loc.slug));
    }

    const flatsForRentIn = seg.match(/^flats-for-rent-in-(.+)$/);
    if (flatsForRentIn) {
        const slug = hubSlugToPgSlug(flatsForRentIn[1]);
        const loc = getPgLocationBySlug(slug);
        if (loc) return pageSeoToMetadata(rentLocationHubSeo(loc.name, loc.slug));
    }

    const near = getPgNearLandmarkByPath(path);
    if (near) return resolveLandmarkPathMetadata(path);

    const boys = seg.match(/^pg-for-boys-in-(.+)$/);
    if (boys) return resolvePgGenderLocalityMetadata(boys[1], 'boys');
    const girls = seg.match(/^pg-for-girls-in-(.+)$/);
    if (girls) return resolvePgGenderLocalityMetadata(girls[1], 'girls');
    const men = seg.match(/^pg-for-men-in-(.+)$/);
    if (men) return resolvePgGenderLocalityMetadata(men[1], 'men');
    const women = seg.match(/^pg-for-women-in-(.+)$/);
    if (women) return resolvePgGenderLocalityMetadata(women[1], 'women');

    const priceTier = seg.match(/^pg-in-(.+)-under-(\d+)$/);
    if (priceTier) {
        const baseSlug = hubSlugToPgSlug(priceTier[1]);
        const loc = getPgLocationBySlug(baseSlug);
        if (loc) {
            const seo = pgLocationSeo(loc.name, loc.slug);
            return pageSeoToMetadata({
                ...seo,
                ogImage: buildTextOgImageUrl({
                    title: seo.title,
                    location: loc.name,
                    type: 'PG in Bangalore',
                }),
            });
        }
    }

    const pgIn = seg.match(/^pg-in-(.+)$/);
    if (pgIn) {
        const baseSlug = hubSlugToPgSlug(pgIn[1]);
        const loc = getPgLocationBySlug(baseSlug);
        if (loc) {
            const seo = pgLocationSeo(loc.name, loc.slug);
            return pageSeoToMetadata({
                ...seo,
                ogImage: buildTextOgImageUrl({
                    title: seo.title,
                    location: loc.name,
                    type: 'PG in Bangalore',
                }),
            });
        }
    }

    const feature = pgFeaturePathToKind(path);
    if (feature) return pageSeoToMetadata(pgFeatureLandingSeo(feature));

    notFound();
    // Unreachable return for type safety
    return pageSeoToMetadata({ title: 'Page not found', description: '', path });
}

/** Known static app routes (pathname without query). */
export function resolveStaticPathMetadata(pathname: string): Metadata {
    const path = pathname.split('?')[0] || '/';
    const map: Record<string, PageSEOInput | (() => PageSEOInput)> = {
        '/': buildHomeSEO,
        '/about': buildAboutPageSEO,
        '/faq': buildFaqPageSEO,
        '/research': buildResearchPageSEO,
        '/reports': buildReportsPageSEO,
        '/statistics': buildStatisticsPageSEO,
        '/how-we-verify': buildHowWeVerifyPageSEO,
        '/contact-us': buildContactPageSEO,
        '/blog': () => buildBlogIndexSEO(BLOG_POSTS.length),
        '/pg-near-me': buildPgNearMeSEO,
        '/pg-vs-flat-bangalore': pgVsFlatBangaloreSeo,
        '/flats-in-bangalore': buildFlatsInBangaloreSEO,
        '/privacy': buildPrivacyPageSEO,
        '/terms': buildTermsPageSEO,
        '/refund-policy': buildRefundPolicyPageSEO,
        '/buy/in/bangalore': buyBangaloreHubSeo,
        '/plots/in/bangalore': plotBangaloreHubSeo,
        '/pg': () =>
            listingsPageSeo({
                pathname: '/pg',
                pageTitle: 'PG in Bangalore',
                pageSubtitle: 'Verified paying guest stays',
                category: 'pg',
                cityLabel: 'Bangalore',
            }),
        '/rent': () =>
            listingsPageSeo({
                pathname: '/rent',
                pageTitle: 'Rent in Bangalore',
                pageSubtitle: 'Flats and houses for rent',
                category: 'rent',
                cityLabel: 'Bangalore',
            }),
        '/properties': () =>
            listingsPageSeo({
                pathname: '/properties',
                pageTitle: 'Properties in Bangalore',
                pageSubtitle: 'PG, rent, buy & plots',
                category: 'all',
                cityLabel: 'Bangalore',
            }),
    };

    const entry = map[path];
    if (entry) {
        const input = typeof entry === 'function' ? entry() : entry;
        return pageSeoToMetadata(input);
    }

    const feature = pgFeaturePathToKind(path);
    if (feature) return pageSeoToMetadata(pgFeatureLandingSeo(feature));

    if (path.startsWith('/pg-near-')) return resolveLandmarkPathMetadata(path);

    return resolveCatchAllPathMetadata(path);
}

/** `/office/:slug` — office hub pages (title/description built from office name, no property fetch). */
export function resolveOfficeMetadata(slug: string): Metadata {
    const office = OFFICES.find((o) => o.slug === slug);
    const name = office?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return pageSeoToMetadata({
        title: `PG & Coliving near ${name}, Bangalore | MakeMyStay`,
        description: `Find verified PGs, coliving spaces, and rentals near ${name} in Bangalore. Compare listings with transparent pricing and zero brokerage on MakeMyStay.ai.`,
        path: `/office/${slug}`,
    });
}

/** `/services/:serviceId` — utility/conversion page, intentionally noindexed. */
export function resolveServiceMetadata(serviceId: string): Metadata {
    return pageSeoToMetadata(
        buildNoindexUtilitySEO(
            serviceId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            `/services/${serviceId}`,
        ),
    );
}

/** Dynamic city-level hub pages (`/rent/in/[city]`, `/buy/in/[city]`, `/plots/in/[city]`, `/properties/in/[city]`). */
export function resolveCityListingsMetadata(
    city: string,
    category: 'rent' | 'buy' | 'plot' | 'all',
): Metadata {
    const cityLabel = city
        ? city.charAt(0).toUpperCase() + city.slice(1)
        : 'Bangalore';
    const pathname = category === 'rent'
        ? `/rent/in/${city}`
        : category === 'buy'
          ? `/buy/in/${city}`
          : category === 'plot'
            ? `/plots/in/${city}`
            : `/properties/in/${city}`;
    const titles: Record<string, string> = {
        rent: `Flats & Houses for Rent in ${cityLabel} — Verified | MakeMyStay`,
        buy: `Buy Property in ${cityLabel} — Verified Flats & Homes | MakeMyStay`,
        plot: `Plots & Land for Sale in ${cityLabel} — Verified | MakeMyStay`,
        all: `Properties in ${cityLabel} — PG, Rent, Buy & Plots | MakeMyStay`,
    };
    const descs: Record<string, string> = {
        rent: `Browse verified flats and houses for rent in ${cityLabel} with real photos and transparent pricing. Zero brokerage on many listings on MakeMyStay.ai.`,
        buy: `Explore verified apartments and homes for sale in ${cityLabel}. Compare prices and book site visits on MakeMyStay.ai.`,
        plot: `Browse verified residential plots and land in ${cityLabel}. Compare sizes and pricing on MakeMyStay.ai.`,
        all: `Search verified PGs, rental homes, and properties for sale in ${cityLabel} on MakeMyStay.ai.`,
    };
    return pageSeoToMetadata({
        title: titles[category],
        description: descs[category],
        path: pathname,
    });
}
