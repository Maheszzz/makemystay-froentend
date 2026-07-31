/**
 * Tech Park Landing Page Generator: FAQ Generator
 * Generates 15+ comprehensive SEO/AEO FAQs targeting Google AI Overviews and speakable search
 * covering Tech Park, Commute, Companies, Rent, Metro, Parking, Food, Security, and Working Professionals.
 */

import type { TechParkEntry } from '@/data/techParks';
import type { FaqItem } from '@/lib/schema';

export function generateTechParkLandingFaqs(park: TechParkEntry): FaqItem[] {
    const compStr = (park.companies && park.companies.length > 0)
        ? park.companies.slice(0, 3).join(', ')
        : 'major IT corporations';
    const rentRange = park.avgPgCost || '₹7,500 to ₹17,000 per month';

    return [
        {
            question: `What is the average PG rent near ${park.name}, Bangalore?`,
            answer: `The average monthly rent for a verified PG near ${park.name} ranges from ${rentRange}, depending on room sharing types (single, double, or triple sharing) and amenities like AC, private balcony, and managed housekeeping.`
        },
        {
            question: `Are there walking distance PGs near ${park.name} gates?`,
            answer: `Yes, MakeMyStay lists numerous verified paying guest stays and coliving rooms within 5 to 15 minutes walking distance of ${park.name} entrance gates in ${park.locality}, allowing residents to save 1 to 2 hours of daily Bangalore traffic.`
        },
        {
            question: `Which are the best PG localities around ${park.name}?`,
            answer: `The most popular and convenient PG localities around ${park.name} include ${park.localitySlugs.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}. These areas offer strong civic infrastructure, supermarkets, gyms, and frequent feeder transit.`
        },
        {
            question: `How is the commute from nearby PGs to ${park.name}?`,
            answer: `Residents staying in nearby coliving spaces can reach ${park.name} in 5 to 15 minutes on foot or via quick BMTC feeder buses and auto-rickshaws, avoiding ORR peak-hour congestion.`
        },
        {
            question: `Are there PGs near ${park.name} suitable for IT working professionals?`,
            answer: `Yes, our listed PGs near ${park.name} are specifically tailored for software engineers, consultants, and professionals working at companies like ${compStr}, featuring high-speed WiFi, dedicated work desks, quiet hours, and power backup.`
        },
        {
            question: `Do PGs near ${park.name} provide food and homely meals?`,
            answer: `Yes, most MakeMyStay verified PGs near ${park.name} include 3 hygienic, chef-cooked meals (North and South Indian menus) on weekends and breakfast/dinner on weekdays as part of the monthly rent.`
        },
        {
            question: `What security measures are available in PGs near ${park.name}?`,
            answer: `All verified properties feature 24/7 CCTV surveillance, biometric or RFID access control, on-site wardens, and background-verified staff to ensure complete safety for men and women.`
        },
        {
            question: `Is two-wheeler or car parking available at PGs near ${park.name}?`,
            answer: `Yes, dedicated covered two-wheeler parking is standard across most PGs near ${park.name}. Premium luxury coliving properties also offer limited four-wheeler parking slots.`
        },
        {
            question: `How close is the nearest Namma Metro station to ${park.name}?`,
            answer: `Many PGs near ${park.name} are located within 1.5 to 3 km of Namma Metro stations along the Purple and Yellow/Blue corridor routes, providing seamless public transit across Bangalore.`
        },
        {
            question: `What is the difference between Single Sharing and Double Sharing PGs near ${park.name}?`,
            answer: `Single sharing PGs offer a private bedroom and ensuite washroom for maximum privacy and focus, whereas double sharing rooms accommodate two residents at an economical price point while maintaining personal wardrobes and study tables.`
        },
        {
            question: `Do luxury coliving spaces near ${park.name} have gyms and gaming zones?`,
            answer: `Yes, managed luxury coliving properties near ${park.name} feature on-site fitness studios, terrace lounges, gaming tables (pool, table tennis), and community events for residents.`
        },
        {
            question: `What is the typical security deposit for PGs around ${park.name}?`,
            answer: `Unlike traditional Bangalore rental flats that require 5 to 10 months of deposit, verified PGs near ${park.name} typically charge only 1 to 2 months rent as a refundable security deposit with zero brokerage.`
        },
        {
            question: `Are there separate PGs for ladies and gents near ${park.name}?`,
            answer: `Yes, you can filter and select dedicated Gents PGs, Ladies PGs, or unisex co-living spaces near ${park.name} based on your personal preference.`
        },
        {
            question: `Can corporate interns and trainees stay in PGs near ${park.name}?`,
            answer: `Absolutely. Corporate interns and newcomers joining companies inside ${park.name} can opt for flexible short-term or long-term stays with move-in-ready furnished rooms.`
        },
        {
            question: `How does MakeMyStay verify PGs near ${park.name}?`,
            answer: `Our ground team physically audits every property near ${park.name} across 50+ quality checkpoints including food hygiene, WiFi speeds, water pressure, safety protocols, and actual room photos.`
        }
    ];
}
