import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { propertyDetailPageSeo } from '@/lib/seo';
import { buildPropertyPdpFaqs } from '@/lib/propertyClientSeoNarrative';
import { buildPropertyContentGuide } from '@/lib/propertyContentEngine';
import type { Property } from '@/types/api';

function plainText(md: string): string {
    return md
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Crawler-visible PDP copy (SSR). Interactive UI hydrates in PropertyDetails on top.
 */
export function PropertyPdpSeoHtml({ property }: { property: Property }) {
    const path = getPropertyDetailPath(property);
    const seo = propertyDetailPageSeo(property, path);
    const title = formatPropertyTitle(property.title) || property.title;
    const about = plainText(
        property.seo_about?.trim() || buildClientSeoAbout(property) || property.description || '',
    );
    const faqs = buildPropertyPdpFaqs(property).slice(0, 10);
    const guide = buildPropertyContentGuide(property);
    const sections = [
        guide.overview,
        guide.suitability,
        guide.pricing,
        guide.roomTypes,
        guide.amenities,
        guide.foodWifiLaundry,
        guide.safetyAndRules,
        guide.moveInTerms,
        guide.availabilityContact,
    ];
    const reviews = (property.reviews_list || []).filter((review) => review.comment || review.review_text).slice(0, 4);

    return (
        <article
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-800 border-b border-slate-100"
            data-pdp-seo="true"
        >
            <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{seo.title}</p>
            <p className="mt-3 text-slate-600 leading-relaxed">{seo.description}</p>
            <p className="mt-2 text-sm text-slate-500">
                {property.type} · {property.location} · {property.price}
            </p>
            {about.length > 120 && (
                <div className="mt-6 space-y-3 text-slate-700 leading-relaxed text-base">
                    {about.split(/(?<=[.!?])\s+/).reduce<string[]>((acc, sentence) => {
                        const last = acc[acc.length - 1];
                        if (!last || last.length > 400) acc.push(sentence);
                        else acc[acc.length - 1] = `${last} ${sentence}`;
                        return acc;
                    }, []).map((para) => (
                        <p key={para.slice(0, 48)}>{para}</p>
                    ))}
                </div>
            )}
            {sections.map((section) => (
                <section className="mt-8" key={section.title}>
                    <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">{section.body}</p>
                    {section.items && section.items.length > 0 && (
                        <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
            <section className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">Local area guide for {guide.locality}</h2>
                {guide.localityGuide.map((section) => (
                    <div className="mt-4" key={section.title}>
                        <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                        <p className="mt-1 text-sm text-slate-700 leading-relaxed">{section.body}</p>
                    </div>
                ))}
            </section>
            <section className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">Commute estimates from {guide.locality}</h2>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                    {guide.commute.map((item) => (
                        <li key={item.destination}>
                            {item.destination}: {item.note}
                        </li>
                    ))}
                </ul>
            </section>
            {reviews.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
                    <ul className="mt-3 space-y-3 text-sm text-slate-700">
                        {reviews.map((review) => (
                            <li key={review.id}>
                                {review.rating ? `${review.rating}/5 - ` : ''}
                                {(review.comment || review.review_text || '').replace(/\s+/g, ' ').trim()}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {faqs.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-900">FAQs — {title}</h2>
                    <dl className="mt-3 space-y-4">
                        {faqs.map((item) => (
                            <div key={item.question}>
                                <dt className="font-medium text-slate-900">{item.question}</dt>
                                <dd className="mt-1 text-sm text-slate-600 leading-relaxed">{item.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
            <nav className="mt-8" aria-label="Related property links">
                <h2 className="text-lg font-semibold text-slate-900">Related properties and areas</h2>
                <ul className="mt-3 flex flex-wrap gap-3 text-sm">
                    {guide.internalLinks.map((link) => (
                        <li key={link.href}>
                            <a className="text-brand-red underline-offset-4 hover:underline" href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </article>
    );
}
