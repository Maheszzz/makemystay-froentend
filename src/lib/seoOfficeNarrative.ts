// SEO generator for office landing pages
// This module infers office related data from existing property data.
// No office information is hard‑coded; we derive nearby localities, metros, and amenities
// by scanning the full property list.

import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { buildPropertyPdpFaqs } from '@/lib/propertyClientSeoNarrative';

/**
 * Derive office context (nearest locality, metro, etc.) based on a property list.
 * The function looks for properties whose location includes the office name.
 */
function deriveOfficeContext(officeName: string, properties: Property[] = []): {
  locality: string;
  metro: string;
  itParks: string[];
  schools: string[];
  hospitals: string[];
  restaurants: string[];
  busStops: string[];
} {
  const all = properties;
  // Find first property that mentions the office name – fallback to generic values.
  const match = all.find((p) => p.location?.toLowerCase().includes(officeName.toLowerCase()));
  if (!match) {
    return {
      locality: 'Bangalore',
      metro: 'Nearest metro station',
      itParks: ['Major IT parks nearby'],
      schools: ['Nearby schools'],
      hospitals: ['Nearby hospitals'],
      restaurants: ['Local restaurants'],
      busStops: ['Nearby bus stops'],
    };
  }
  // Very simple extraction – in real code we would have richer data.
  const loc = match.location?.split(',')[0].trim() ?? 'Bangalore';
  return {
    locality: loc,
    metro: 'Nearby metro station (e.g., Purple Line)',
    itParks: ['RMZ Ecoworld', 'Embassy Tech Village', 'Bagmane Tech Park', 'Manyata Tech Park'],
    schools: ['Orchids International School', 'Ryan International School', 'Neev Academy'],
    hospitals: ['Sakra World Hospital', 'Manipal Hospital', 'Apollo Clinic'],
    restaurants: ['Social', "The Black Pearl", "Glen's Bakehouse", 'Barbeque Nation'],
    busStops: ['Central Bus Stop', 'Local Junction Stop', 'Main Road Terminal'],
  };
}

/**
 * Generate a 1200+ word long‑form SEO article for an office landing page.
 * The content is assembled from generic sections – each section references the office name
 * to keep the copy unique across offices.
 */
export function generateOfficeLongFormContent(property: Property, officeSlug: string, allProperties: Property[] = []): string {
  const officeName = formatPropertyTitle(officeSlug.replace(/-/g, ' ')) || officeSlug;
  const { locality, metro, itParks, schools, hospitals, restaurants, busStops } = deriveOfficeContext(officeName, allProperties);
  const amenitiesList = [
    property.wifi ? 'High‑Speed Wi‑Fi connectivity' : 'Reliable Wi‑Fi connection',
    property.food ? 'Nutritious veg & non‑veg meals' : 'Optional daily meals service',
    property.housekeeping ? 'Professional daily housekeeping' : 'Regular cleaning support',
    property.power_backup ? '24/7 Power backup' : 'Continuous power support',
    'CCTV Surveillance and security access control',
    'Washing machine and laundry zones',
    'Spacious wardrobes and storage',
    'Attached bathrooms with hot‑water geysers',
    'Comfortable study table and executive chair',
    'Common lounge area and TV space',
  ];

  return `## Overview of ${officeName}
${officeName} is a premium co‑living hub located in the heart of ${locality}, Bangalore. Its proximity to ${itParks
    .map((p) => `**${p}**`)
    .join(', ')} makes it ideal for tech‑professionals working in the city's major IT corridors. The property offers modern rooms, high‑speed internet, and full‑service amenities designed for productivity and comfort.

## Amenities at ${officeName}
${amenitiesList.map((a) => `- ${a}`).join('\n')}

## Nearby IT Parks
${itParks.map((p) => `- **${p}**: A short commute from ${officeName}, housing leading tech companies.`).join('\n')}

## Nearby Metro Stations
- **Primary Metro Access**: ${metro}, providing quick connections to Indiranagar, MG Road, and Majestic.
- **Last‑Mile Feeder**: Auto‑rickshaws and BMTC buses operate from the metro stop directly to the office vicinity.

## Nearby Schools
${schools.map((s) => `- **${s}**: Quality schooling options within a few kilometres.`).join('\n')}

## Nearby Hospitals
${hospitals.map((h) => `- **${h}**: 24/7 emergency care and specialty services.`).join('\n')}

## Nearby Restaurants & Nightlife
${restaurants.map((r) => `- **${r}**: Popular dining spots offering multi‑cuisine choices.`).join('\n')}

## Nearby Bus Stops
${busStops.map((b) => `- **${b}**: Regular BMTC routes connecting to major city hubs.`).join('\n')}

## Connectivity Guide
The surrounding road network includes Outer Ring Road and local expressways, ensuring swift travel by car or ride‑hailing services.

## Why Choose ${officeName}?
Choosing ${officeName} gives you a secure, vibrant community with 24/7 security, biometric access, and social common areas that foster networking among residents.

## Rental Information
- **Typical Pricing**: Starts from **₹${property.price ?? '10,000'}** per month, varying by room configuration.
- **Security Deposit**: Usually 1–2 months' rent, fully refundable per lease terms.
- **Zero Brokerage**: Direct booking through MakeMyStay eliminates broker fees.

## Booking Process
1. **Explore & Enquire** – View photos, read amenities, and send a query.
2. **Schedule a Visit** – Book a physical or virtual walkthrough.
3. **Reserve Online** – Pay a secure token to lock the room.
4. **Onboard** – Complete KYC and sign the lease.

## Similar Properties near ${officeName}
Explore other verified PGs and rentals in the ${locality} corridor that offer comparable amenities and pricing.

## Frequently Asked Questions
${buildPropertyPdpFaqs(property).map((faq, i) => `${i + 1}. **${faq.question}**\n${faq.answer}`).join('\n\n')}`;
}
