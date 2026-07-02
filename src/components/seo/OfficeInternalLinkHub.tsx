// src/components/seo/OfficeInternalLinkHub.tsx
// Internal linking hub for Office landing pages. Reuses existing Link component.

import { Link } from '@/lib/navigation';
import { OFFICES } from '@/data/offices';
import { haversineDistance } from '@/lib/geo';
import type { Property } from '@/types/api';

interface OfficeInternalLinkHubProps {
  officeSlug: string;
  nearbyProperties: Property[];
}

export function OfficeInternalLinkHub({ officeSlug, nearbyProperties }: OfficeInternalLinkHubProps) {
  const office = OFFICES.find((o) => o.slug === officeSlug);
  if (!office) return null;

  // Nearby offices (within ~5 km)
  const nearbyOffices = OFFICES.filter((o) => {
    if (o.slug === office.slug) return false;
    if (office.lat && o.lat) {
      const d = haversineDistance(office.lat, office.lng, o.lat, o.lng);
      return d <= 5;
    }
    return false;
  });

  // Extract distinct localities from nearby properties (simple heuristic)
  const localitySet = new Set<string>();
  nearbyProperties.forEach((p) => {
    const loc = p.location?.split(',')[0].trim();
    if (loc) localitySet.add(loc);
  });
  const nearbyLocalities = Array.from(localitySet).slice(0, 10);

  // Simple FAQ – could be expanded later
  const faqs = [
    {
      question: `What is the average rent near ${office.name}?`,
      answer: `Around ₹${nearbyProperties.reduce((sum, p) => {
        const price = Number(p.price?.replace(/[^0-9]/g, ''));
        return sum + (isNaN(price) ? 0 : price);
      }, 0) / (nearbyProperties.length || 1)} per month.`,
    },
    {
      question: `How far is ${office.name} from major IT parks?`,
      answer: 'Within a few kilometres – check individual property listings for exact distances.',
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5 space-y-6" aria-labelledby="office-link-hub-heading">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</p>
        <h2 id="office-link-hub-heading" className="mt-1 text-lg font-bold text-slate-900">
          Nearby around {office.name}
        </h2>
      </div>

      {nearbyLocalities.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Nearby localities</h3>
          <nav className="flex flex-wrap gap-2" aria-label="Nearby localities">
            {nearbyLocalities.map((loc) => (
              <Link key={loc} to={`/pg/${loc.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-brand-red/40 hover:text-brand-red">
                PG in {loc}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {nearbyOffices.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Related office hubs</h3>
          <nav className="flex flex-wrap gap-2" aria-label="Related offices">
            {nearbyOffices.map((o) => (
              <Link key={o.slug} to={`/office/${o.slug}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-brand-red/40 hover:text-brand-red">
                {o.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* FAQ Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-2">Frequently Asked Questions</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          {faqs.map((f, i) => (
            <li key={i}>
              <strong>{f.question}</strong> – {f.answer}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
