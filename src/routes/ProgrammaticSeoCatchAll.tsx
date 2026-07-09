import { redirect } from 'next/navigation';
import PGLocationPage from '@/views/PGLocationPage';

import PgNearLandmarkPage from '@/views/PgNearLandmarkPage';
import RentLocationPage from '@/views/RentLocationPage';
import { PG_NEAR_LANDMARKS } from '@/data/pgNearLandmarks';
import { canonicalRentPathForRentInSegment } from '@/lib/rentLegacyRedirects';

function hubSlugToPgSlug(hubSlug: string): string {
    return hubSlug === 'btm-layout' ? 'btm' : hubSlug;
}

/** Handles flat SEO URLs: /pg-in-*, /pg-for-*-in-*, /pg-near-*, /rent-in-* */
export default function ProgrammaticSeoCatchAll({ pathKey }: { pathKey: string }) {
    const path = pathKey.replace(/^\//, '');

    const rentIn = path.match(/^rent-in-(.+)$/);
    if (rentIn) {
        const target = canonicalRentPathForRentInSegment(rentIn[1]);
        const slug = target?.replace(/^\/rent\//, '');
        if (slug) return <RentLocationPage overrideSlug={slug} />;
        redirect('/rent');
    }

    const flatsForRentIn = path.match(/^flats-for-rent-in-(.+)$/);
    if (flatsForRentIn) {
        const target = canonicalRentPathForRentInSegment(flatsForRentIn[1]);
        const slug = target?.replace(/^\/rent\//, '');
        if (slug) return <RentLocationPage overrideSlug={slug} />;
        redirect('/rent');
    }

    const near = PG_NEAR_LANDMARKS.find((e) => e.path === path);
    if (near) {
        return <PgNearLandmarkPage />;
    }

    const boys = path.match(/^pg-for-boys-in-(.+)$/);
    if (boys) return <PGLocationPage overrideSlug={hubSlugToPgSlug(boys[1])} overrideGender="male" />;

    const girls = path.match(/^pg-for-girls-in-(.+)$/);
    if (girls) return <PGLocationPage overrideSlug={hubSlugToPgSlug(girls[1])} overrideGender="female" />;

    const men = path.match(/^pg-for-men-in-(.+)$/);
    if (men) return <PGLocationPage overrideSlug={hubSlugToPgSlug(men[1])} overrideGender="male" />;

    const women = path.match(/^pg-for-women-in-(.+)$/);
    if (women) return <PGLocationPage overrideSlug={hubSlugToPgSlug(women[1])} overrideGender="female" />;

    const priceTier = path.match(/^pg-in-(.+)-under-(\d+)$/);
    if (priceTier) {
        const baseSlug = hubSlugToPgSlug(priceTier[1]);
        return <PGLocationPage overrideSlug={baseSlug} overrideMaxPrice={priceTier[2]} />;
    }

    const featureMatch = path.match(/^pg-in-(.+)-with-(food|ac)$/);
    if (featureMatch) {
        const baseSlug = hubSlugToPgSlug(featureMatch[1]);
        return <PGLocationPage overrideSlug={baseSlug} overrideFeature={featureMatch[2]} />;
    }

    const pgIn = path.match(/^pg-in-(.+)$/);
    if (pgIn) {
        const baseSlug = hubSlugToPgSlug(pgIn[1]);
        return <PGLocationPage overrideSlug={baseSlug} />;
    }

    notFound();
}
