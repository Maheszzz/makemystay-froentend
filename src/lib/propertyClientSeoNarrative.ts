/**
 * Client-side long-form SEO copy when API `seo_about` is absent (e.g. older backend).
 * Mirrors backend narrative intent: unique per listing via structured data, ~500 words.
 */

import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';

/** Same shape as `FaqItem` in schema (kept local to avoid circular imports). */
export interface PropertyPdpFaq {
    question: string;
    answer: string;
}

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function limitWords(text: string, max: number): string {
    const w = text.trim().split(/\s+/).filter(Boolean);
    if (w.length <= max) return w.join(' ');
    return `${w.slice(0, max).join(' ')}…`;
}

function fmtPrice(property: Property): string {
    const p = property.price?.trim();
    if (p && !/request|negotiable/i.test(p)) return p;
    return '';
}

/** Plain-text excerpt for hero (no ** markers). */
export function extractHeroLeadFromNarrative(narrative: string, maxChars: number): string {
    const block = narrative.split(/\n\n+/)[0] ?? narrative;
    const plain = block
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
    if (plain.length <= maxChars) return plain;
    const cut = plain.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxChars).trim()}…`;
}

function buildPgNarrative(name: string, loc: string, property: Property): string {
    const price = fmtPrice(property);
    const priceBit = price
        ? `Monthly rent is typically discussed around **${price}** for comparable inventory in this micro-market, subject to occupancy and meal plan.`
        : 'Rent and inclusions are confirmed on enquiry so you can compare fairly against nearby PGs.';

    const feats = Array.isArray(property.features) ? property.features.slice(0, 10).join(', ') : '';
    const featBit = feats
        ? `Reported amenities and tags include ${feats}.`
        : 'Review the amenity chips on this listing before you shortlist a visit.';

    return `**${name}** is a **PG** stay in **${loc}**, positioned for renters who want bundled utilities, structured meals or kitchen access where applicable, and shorter commutes across Bangalore. ${priceBit}

When you compare paying-guest options, look beyond headline rent: Wi‑Fi stability, meal timings, housekeeping cadence, laundry, and visitor rules. ${featBit} Use this page as a checklist, then ask the operator about night access, deposit, and notice period in writing.

**${loc}** continues to attract students, exam-prep residents, and early-career professionals. Many searches combine intents like "PG near me", "coliving ${loc}", "single room PG Bangalore", and "food included PG" — this description is written to align with those queries using specific, verifiable language rather than generic filler.

Connectivity and daily rhythm matter: validate distance to your office or campus at rush hour, not only on maps. If you work night shifts, confirm meal windows and security desk coverage. If you need quiet study blocks, ask about room orientation and roommate mix.

From an SEO perspective, this listing page includes natural references to **Bangalore**, **${loc}**, **PG rental**, furnished stay, and verified listing context. MakeMyStay reduces broker noise by surfacing structured fields and a consistent enquiry path.

Booking discipline is important in high-churn corridors. If you need single occupancy or AC, ask what is allocated today — inventory moves weekly. Cross-check photos, map links, and ratings before paying any token.

Finally, treat this long-form section as a companion to your visit: lighting, ventilation, phone signal, and water pressure are best judged in person. Schedule a walkthrough, bring questions, and compare two backups in **${loc}** or adjacent areas so you decide on total monthly cost, not just a pretty thumbnail.`;
}

function buildHomeNarrative(name: string, loc: string, property: Property): string {
    const pt = (property.type || 'home').trim();
    const price = fmtPrice(property);
    const priceBit = price
        ? `Indicative rent is shown from **${price}** per month where applicable; confirm inclusions with the operator.`
        : 'Rent, maintenance, and inclusions should be confirmed on enquiry for an apples-to-apples comparison.';

    return `**${name}** offers a **${pt}** home for rent in **${loc}**, aimed at renters who want a readable story before scheduling visits. ${priceBit}

Urban housing searches in Bangalore often combine phrases like "fully furnished ${pt} ${loc}", "family ${pt} near ORR", "no brokerage ${loc}", and "ready-to-move ${pt} Bangalore". This copy is composed to help both users and search engines understand configuration, furnishing level, and location intent without keyword stuffing.

Evaluate the home against your non-negotiables: storage, kitchen usability, daylight, noise, and parking. Ask about society rules, maintenance splits, and what the monthly outflow is after utilities. If you are comparing with a slightly smaller furnished unit, model move-in costs honestly.

**${loc}** has its own commute patterns — validate peak-hour travel to your office cluster. Mention commute time when you enquire so the owner can suggest the better unit orientation or floor.

MakeMyStay focuses on transparent listing signals where available; your final diligence happens on call and site visit. Use on-page actions to book a visit, call, or chat, and keep a written checklist of questions.

Long-form property pages help search engines connect entities (project name, locality, configuration) with helpful detail. This section repeats a few key phrases only where they read naturally — a best practice for SEO and for answer engines that quote concise facts.

When you tour the property, check balconies, wardrobes, bathrooms, and power backup under real conditions. Photos rarely capture lift wait times or cross-ventilation. If the fit feels right, clarify deposit, lock-in, and handover timeline before transferring a booking amount.`;
}

function buildPlotNarrative(name: string, loc: string, property: Property): string {
    const price = fmtPrice(property);
    const p = price ? `Price guidance around **${price}** may appear on the listing; validate legally before token.` : 'Pricing and approvals must be verified with counsel before advances.';
    return `**${name}** is a land listing in **${loc}** for buyers evaluating plot investments or self-build plans. ${p}

Plot purchases require title diligence, dimensions, facing, road width, and approval checks. Compare total cost of ownership across locations, not sticker price alone. Use structured enquiry through MakeMyStay, then complete legal verification with qualified advisors.

Infrastructure timing — water, power, roads — should be validated on-site. Whether you build soon or hold long-term, clarity on encumbrances and layout reputation reduces surprises. This narrative supports discovery for searches like "plot in ${loc}" and "Bangalore land for sale" while staying readable for humans.`;
}

/**
 * ~480–550 words, unique via title/location/type/price/features.
 */
export function buildClientSeoAbout(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title.trim();
    const loc = property.location?.trim() || 'Bangalore';
    const pt = (property.type || '').toLowerCase();

    let body: string;
    if (pt === 'plot') {
        body = buildPlotNarrative(name, loc, property);
    } else if (pt === 'pg' || pt === 'hostel') {
        body = buildPgNarrative(name, loc, property);
    } else {
        body = buildHomeNarrative(name, loc, property);
    }

    const raw = (property.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let merged = body;
    if (raw.length > 60) {
        const excerpt = limitWords(raw, 120);
        merged = `Operator notes: ${excerpt}\n\n${body}`;
    }

    let wc = wordCount(merged);
    if (wc < 480) {
        merged += `\n\nAdditional context for **${name}** in **${loc}**: renters and buyers increasingly compare total monthly spend, not headline rent alone. Ask about maintenance, utilities, parking, and move-in timelines. MakeMyStay lists are updated regularly; confirm availability before travelling. Bookmark this URL, share it with co-decision makers, and keep two alternates in mind — Bangalore inventory shifts quickly in popular corridors.`;
        wc = wordCount(merged);
    }
    if (wc > 560) {
        merged = limitWords(merged, 540);
    }
    return merged.trim();
}

/** FAQ-rich snippets for answer engines (Google, Perplexity-style citations). */
export function buildPropertyPdpFaqs(property: Property): PropertyPdpFaq[] {
    const name = formatPropertyTitle(property.title) || property.title.trim();
    const loc = property.location?.trim() || 'Bangalore';
    const price = fmtPrice(property);
    const type = property.type || 'property';

    const items: PropertyPdpFaq[] = [
        {
            question: `What is the rent for ${name} in ${loc}?`,
            answer: price
                ? `This listing shows starting rent around ${price} per month. Final rent depends on room type, furnishing, and inclusions — confirm on enquiry or visit.`
                : `Rent for this ${type} in ${loc} is shared on enquiry so you can compare inclusions and total monthly outflow.`,
        },
        {
            question: `Is ${name} in ${loc} furnished and suitable for professionals?`,
            answer: `The listing describes a ${type} in ${loc} with details shown on this page. Furnishing level and house rules should be confirmed during a site visit or call.`,
        },
        {
            question: 'How do I book a visit or enquire on MakeMyStay?',
            answer:
                'Use the Book visit, Call, or WhatsApp options on this page. Our team can help you schedule a walkthrough and clarify deposit or token steps.',
        },
        {
            question: `Is this ${type} listing in ${loc} verified?`,
            answer:
                'MakeMyStay highlights structured listing data and verification cues where available. Always validate photos, pricing, and availability directly before paying any booking amount.',
        },
        {
            question: `What area is ${loc} connected to in Bangalore?`,
            answer: `${loc} is a sought-after micro-market in Bangalore. Commute times vary by time of day — plan a visit near your typical travel hours and check connectivity to your workplace or campus.`,
        },
    ];
    if (property.type === 'PG' || property.type === 'Hostel') {
        items.splice(2, 0, {
            question: `Does ${name} include WiFi, food, or housekeeping?`,
            answer:
                'PG listings often bundle WiFi, meals, and housekeeping — exact inclusions depend on the operator. Review amenity tags on this page and confirm meal timings and policies on enquiry.',
        });
    }
    return items.slice(0, 8);
}
