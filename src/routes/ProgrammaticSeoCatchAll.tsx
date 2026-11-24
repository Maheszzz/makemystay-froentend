import { notFound } from 'next/navigation';
import PGLocationPage from '@/views/PGLocationPage';

import PgNearLandmarkPage from '@/views/PgNearLandmarkPage';
import RentLocationPage from '@/views/RentLocationPage';
import { PG_NEAR_LANDMARKS } from '@/data/pgNearLandmarks';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { getLocalitySeoProfile } from '@/lib/locality';
import { canonicalRentPathForRentInSegment } from '@/lib/rentLegacyRedirects';

function hubSlugToPgSlug(hubSlug: string): string {
    return hubSlug === 'btm-layout' ? 'btm' : hubSlug;
}

function isKnownLocality(rawSlug: string): boolean {
    const slug = resolveLegacyPgSlug(rawSlug) ?? rawSlug.toLowerCase();
    return Boolean(getPgLocationBySlug(slug) || getLocalitySeoProfile(slug));
}

/** Handles flat SEO URLs: /pg-in-*, /pg-for-*-in-*, /pg-near-*, /rent-in-* */
export default function ProgrammaticSeoCatchAll({ pathKey }: { pathKey: string }) {
    const path = pathKey.replace(/^\//, '');

    const rentIn = path.match(/^rent-in-(.+)$/);
    if (rentIn) {
        const target = canonicalRentPathForRentInSegment(rentIn[1]);
        const slug = target?.replace(/^\/rent\//, '');
        if (slug && isKnownLocality(slug)) return <RentLocationPage overrideSlug={slug} />;
        notFound();
    }

    const flatsForRentIn = path.match(/^flats-for-rent-in-(.+)$/);
    if (flatsForRentIn) {
        const target = canonicalRentPathForRentInSegment(flatsForRentIn[1]);
        const slug = target?.replace(/^\/rent\//, '');
        if (slug && isKnownLocality(slug)) return <RentLocationPage overrideSlug={slug} />;
        notFound();
    }

    const near = PG_NEAR_LANDMARKS.find((e) => e.path === path);
    if (near) {
        return <PgNearLandmarkPage />;
    }

    const boys = path.match(/^pg-for-boys-in-(.+)$/);
    if (boys) {
        const slug = hubSlugToPgSlug(boys[1]);
        if (slug !== 'bangalore' && !isKnownLocality(slug)) notFound();
        return <PGLocationPage overrideSlug={slug} overrideGender="male" />;
    }

    const girls = path.match(/^pg-for-girls-in-(.+)$/);
    if (girls) {
        const slug = hubSlugToPgSlug(girls[1]);
        if (slug !== 'bangalore' && !isKnownLocality(slug)) notFound();
        return <PGLocationPage overrideSlug={slug} overrideGender="female" />;
    }

    const men = path.match(/^pg-for-men-in-(.+)$/);
    if (men) {
        const slug = hubSlugToPgSlug(men[1]);
        if (slug !== 'bangalore' && !isKnownLocality(slug)) notFound();
        return <PGLocationPage overrideSlug={slug} overrideGender="male" />;
    }

    const women = path.match(/^pg-for-women-in-(.+)$/);
    if (women) {
        const slug = hubSlugToPgSlug(women[1]);
        if (slug !== 'bangalore' && !isKnownLocality(slug)) notFound();
        return <PGLocationPage overrideSlug={slug} overrideGender="female" />;
    }

    const priceTier = path.match(/^pg-in-(.+)-under-(\d+)$/);
    if (priceTier) {
        const baseSlug = hubSlugToPgSlug(priceTier[1]);
        if (!isKnownLocality(baseSlug)) notFound();
        return <PGLocationPage overrideSlug={baseSlug} overrideMaxPrice={priceTier[2]} />;
    }

    const featureMatch = path.match(/^pg-in-(.+)-with-(food|ac)$/);
    if (featureMatch) {
        const baseSlug = hubSlugToPgSlug(featureMatch[1]);
        if (!isKnownLocality(baseSlug)) notFound();
        return <PGLocationPage overrideSlug={baseSlug} overrideFeature={featureMatch[2]} />;
    }

    const pgIn = path.match(/^pg-in-(.+)$/);
    if (pgIn) {
        const baseSlug = hubSlugToPgSlug(pgIn[1]);
        if (!isKnownLocality(baseSlug)) notFound();
        return <PGLocationPage overrideSlug={baseSlug} />;
    }

    notFound();
}
