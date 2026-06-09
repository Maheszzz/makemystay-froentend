// src/data/localityContent.ts
export interface LocalityContent {
  overview: string;
  rentTrends: string;
  metroConnectivity: string;
  safety: string;
  nearbyITParks: string;
  nearbyColleges: string;
  foodAndLifestyle: string;
  whoShouldStayHere: string;
  prosAndCons: string;
  faq: { q: string; a: string }[];
}

export const LOCALITY_CONTENT: Record<string, LocalityContent> = {
  whitefield: {
    overview: "Whitefield is Bangalore’s premier IT and commercial corridor. Historically a quiet Anglo-Indian settlement, it transformed in the late 1990s and early 2000s into a massive technology hub, spearheaded by the establishment of the International Tech Park Bangalore (ITPB). Today, it houses hundreds of multinational corporations, ranging from software giants to manufacturing and engineering firms. The locality is a magnet for software engineers, product managers, data scientists, and corporate professionals who move to Bangalore from all over the country. The high concentration of high-paying jobs has fueled a massive demand for verified PG accommodations, co-living spaces, and serviced apartments. Living in Whitefield allows professionals to escape the city's notorious traffic by staying close to their offices. The area features broad roads, modern gated societies, and a self-sufficient ecosystem with hospitals, entertainment hubs, and educational institutes. With the recent completion of the Namma Metro Purple Line extension, connectivity to central Bangalore has improved dramatically, making it even more attractive for young professionals who want to balance work and social life.",
    rentTrends: "Rent in Whitefield varies based on the type of sharing, building age, and included amenities like food, housekeeping, and power backup. Single occupancy PG rooms range from ₹12,000 to ₹20,000 per month, offering privacy and premium facilities. Double sharing options are highly popular among budget-conscious interns and early-career professionals, averaging between ₹8,000 and ₹14,000 per month. Triple sharing rooms are the most economical, costing between ₹6,000 and ₹11,000 per month. Premium co-living spaces with modern interiors, fitness zones, and community areas can command slightly higher prices, but they eliminate the hassle of managing utility bills and maintenance.",
    metroConnectivity: "The Namma Metro Purple Line extension has revolutionized transit for Whitefield residents. The major stations in the locality include Kadugodi Bridge Metro Station and Hope Farm Channasandra Metro Station. Commuters can reach central hubs like Indiranagar, MG Road, and Majestic in 35 to 50 minutes, avoiding the congested Outer Ring Road and Old Airport Road. Feeder buses and auto-rickshaws provide convenient last-mile connectivity from the stations to major tech parks.",
    safety: "Whitefield is considered a highly safe and secure locality. The presence of numerous gated residential communities, tech parks with 24/7 private security, and regular police patrolling contributes to a secure environment. Streets are generally well-lit, and the high foot traffic of corporate employees working late shifts ensures that public areas remain active and safe even during late hours. The Kadugodi Police Station and Whitefield Police Station actively monitor the region.",
    nearbyITParks: "The locality is centered around the International Tech Park Bangalore (ITPB). Other major technology parks in the immediate vicinity include GR Tech Park, Sigma Tech Park, Brigade Tech Gardens, and the Vydehi IT Park. Large MNC campus operations for companies like Oracle, IBM, SAP, and TCS are scattered across this zone, making it the highest density employment corridor in the city.",
    nearbyColleges: "While primarily commercial, Whitefield is home to several reputed educational institutions. The Vydehi Institute of Medical Sciences and Research Centre is a major landmark. Other nearby colleges include the MVJ College of Engineering, Gopalan College of Engineering and Management, and the Sri Sathya Sai Institute of Higher Medical Sciences, drawing a steady population of students and interns.",
    foodAndLifestyle: "Whitefield offers an elite social lifestyle. It features major shopping malls like Phoenix Marketcity and VR Bengaluru, which host premium retail brands, multiplexes, and restaurants. The microbrewery culture is highly active here, with popular spots like Windmills Craftworks and Biergarten. For daily needs, numerous supermarkets, fitness centers, and organic stores line the major streets.",
    whoShouldStayHere: "The area is ideal for software developers, IT consultants, medical students at Vydehi, and corporate employees working in local tech parks. It is also well-suited for young professionals who prefer modern, self-contained neighbourhoods with upscale dining, malls, and direct metro connectivity to the city center.",
    prosAndCons: "Pros: Proximity to major global tech employers, excellent metro connectivity, premium shopping malls, and highly secure gated societies. Cons: High traffic congestion along Hoodi and Graphite India junctions during peak hours, and a higher cost of living compared to older residential areas of Bangalore.",
    faq: [
      { q: "Which PG is best in Whitefield?", a: "Premium co-living options near ITPB and Hope Farm are highly rated due to their proximity to workplaces and metro stations." },
      { q: "What is the average rent in Whitefield?", a: "The average rent ranges from ₹6,500 for triple sharing to ₹18,000+ for premium single rooms." },
      { q: "Are food facilities included in Whitefield PGs?", a: "Yes, most PGs offer 2 or 3 meals daily (North and South Indian menus) included in the rent." },
      { q: "Is Whitefield safe for women?", a: "Yes, with active police patrols, well-lit roads, and 24/7 security at most properties, it is highly safe." },
      { q: "What is the nearest metro station to ITPB?", a: "The Kadugodi Bridge Metro Station is located directly opposite the tech park." },
      { q: "Are security deposits high in Whitefield?", a: "No, most PG and co-living operators charge only 1 to 2 months of rent as a refundable security deposit." },
      { q: "Is there 24/7 power backup?", a: "Yes, given the professional demographic, most verified PGs provide automatic generator backup." },
      { q: "How is the water supply in Whitefield?", a: "Standard PGs manage water through a mix of municipal supply and private tankers, ensuring uninterrupted availability." }
    ],
  },
  marathahalli: {
    overview: "Marathahalli is one of Bangalore's most strategically located suburbs, serving as the bridge between East and South Bangalore. Positioned along the Outer Ring Road (ORR), it witnessed a massive boom with the development of the IT corridor. The area acts as a central transit hub, connecting Whitefield, HAL, Koramangala, and Sarjapur. It is heavily populated by young software engineers, tech interns, and customer support representatives working in the nearby business parks. Because of its excellent transport links and relatively affordable housing options, Marathahalli is a prime hub for budget-friendly paying guest (PG) accommodations and shared apartments. Areas like Spice Garden and AECS Layout have become famous student and professional enclaves, lined with cafes, salons, gymnasiums, and PG buildings. The population is highly diverse, bringing together people from across India. The constant bustle of commuters, shoppers, and residents makes Marathahalli feel lively at all hours of the day and night.",
    rentTrends: "Marathahalli is known for offering some of the most competitive rental rates along the IT corridor. Single sharing PG rooms are priced between ₹10,000 and ₹16,000 per month. Double sharing rooms, which are the most popular choice for young professionals, cost between ₹7,000 and ₹12,000 per month. Triple sharing rooms are highly economical, ranging from ₹5,500 to ₹9,000 per month. Rents usually include basic amenities like Wi-Fi, daily housekeeping, and security.",
    metroConnectivity: "While Marathahalli does not have an active metro station within the locality yet, the upcoming Outer Ring Road Metro line will bring direct connectivity. Currently, residents use the Purple Line stations at Kadubeesanahalli (upcoming) or travel to Indiranagar Metro Station (approx. 6 km) via BMTC Volvo buses. The locality's main bridge is a major boarding point for buses traveling across Bangalore.",
    safety: "Marathahalli is a highly active and populated area, which means streets are rarely deserted. The presence of CCTV cameras in commercial streets and the proximity of the Marathahalli Police Station ensure a stable security environment. Gated PG buildings with warden supervision and biometric access provide excellent safety for male and female tenants alike.",
    nearbyITParks: "The locality is exceptionally close to major business parks on the Outer Ring Road, including Prestige Tech Park, Cessna Business Park, RMZ Tech Park, and the Embassy TechVillage. Tech professionals can easily commute via local buses, auto-rickshaws, or corporate cabs within 10 to 15 minutes.",
    nearbyColleges: "Marathahalli is close to educational centers like the New Horizon College of Engineering, Sri Venkateshwara College of Engineering, and various professional training institutes in AECS Layout. This creates a large demand for student housing and affordable PGs in the immediate area.",
    foodAndLifestyle: "The locality is a paradise for budget shopping and diverse dining. Lined with factory outlets of top apparel brands, it is a shopping destination. For food, the area offers everything from local South Indian mess halls to North Indian dhabas, street food corners, and modern cafes in AECS Layout. Multiplexes like Innovative Multiplex provide entertainment options.",
    whoShouldStayHere: "Marathahalli is ideal for early-career tech professionals, interns, customer service agents, and students who want a well-connected, budget-friendly place to stay with easy access to the Outer Ring Road tech parks.",
    prosAndCons: "Pros: Affordable rents, excellent BMTC bus connectivity, and an abundance of food and shopping options. Cons: Traffic congestion around the Marathahalli bridge is severe during peak hours, and some parts can get crowded and noisy.",
    faq: [
      { q: "Is Marathahalli affordable for students?", a: "Yes, it is one of the most budget-friendly PG hubs along the Bangalore IT belt." },
      { q: "What is the average rent in Marathahalli?", a: "Average PG rents range from ₹5,500 for triple sharing to ₹15,000 for single occupancy." },
      { q: "How is the connectivity to Outer Ring Road?", a: "Excellent. BMTC buses run constantly from Marathahalli Bridge to all major ORR tech parks." },
      { q: "Are there single room PGs in AECS Layout?", a: "Yes, AECS Layout has many premium PG buildings offering private single rooms." },
      { q: "Is power backup common in Marathahalli PGs?", a: "Most established PGs in AECS Layout and Spice Garden offer power backup, though smaller PGs might have limited backup." },
      { q: "What are the top landmarks in Marathahalli?", a: "Marathahalli Bridge, Innovative Multiplex, and AECS Layout are the key landmarks." },
      { q: "Do PGs in Marathahalli provide South and North Indian food?", a: "Yes, almost all PGs cater to both regional tastes with standard menus." },
      { q: "What is the typical deposit amount here?", a: "Most operators ask for a deposit equal to 1 or 2 months of rent." }
    ],
  },
  bellandur: {
    overview: "Bellandur has evolved from a rural suburb into a hyper-growth tech enclave and one of Bangalore's most vital economic centers. Situated along the southern stretch of the Outer Ring Road (ORR), it is bounded by HSR Layout to the west and Sarjapur Road to the south. Bellandur is home to several massive technology parks that house global development centers for companies like Wells Fargo, Cisco, Intel, and Adobe. This concentration of tech jobs has created a massive influx of professionals, making it a hotspot for modern co-living spaces and paying guest accommodations. The local infrastructure is designed around the needs of this corporate demographic, featuring modern apartments, fitness centers, supermarkets, and dining complexes. Although the area has faced rapid urbanization challenges, it remains one of the most popular places to live for anyone working along the ORR corridor. Staying in Bellandur allows workers to walk or take a short auto ride to work, avoiding the long commutes that define Bangalore living.",
    rentTrends: "Because of its prime location and proximity to major tech parks, rental demand is extremely high in Bellandur. Single sharing PG rooms typically cost between ₹12,000 and ₹19,000 per month. Double sharing rooms are priced from ₹8,000 to ₹14,000 per month. Triple sharing options are available between ₹6,000 and ₹10,000 per month. Modern co-living brands that offer premium amenities like gaming zones, housekeeping, and community events are popular here and command the higher end of these rent bands.",
    metroConnectivity: "The nearest operating metro station is currently at Silk Board or Indiranagar, but the upcoming Outer Ring Road metro line will have dedicated stations in Bellandur, which will significantly improve connectivity. Currently, residents rely on BMTC Volvo buses, auto-rickshaws, and ride-hailing services for daily transit.",
    safety: "Bellandur is a bustling tech hub with active streets and high corporate presence. Properties are equipped with modern security systems, CCTV cameras, and 24/7 security guards. The Bellandur Police Station keeps a close watch on the neighborhood, making it a secure place for young professionals working different shifts.",
    nearbyITParks: "The area is the epicenter of ORR tech parks, including RMZ Ecospace, RMZ Ecoworld, Prestige Tech Park, Global Technology Park, and Embassy TechVillage. It is a short commute to offices of major companies like Cisco, Intel, Honeywell, and Wells Fargo.",
    nearbyColleges: "The area is close to New Horizon College of Engineering, Krupanidhi Group of Institutions, and is a short drive from colleges in HSR Layout and Koramangala, attracting students and research scholars.",
    foodAndLifestyle: "Bellandur boasts a lively lifestyle with trendy restaurants, cafes, and pubs. Malls like Central Mall (now retail hubs) and nearby shopping centers offer shopping, dining, and multiplex options. Numerous fitness centers, supermarkets, and organic markets cater to health-conscious tech professionals.",
    whoShouldStayHere: "It is ideal for software engineers, finance professionals, and tech consultants working in the ORR tech parks who want to minimize their commute and live in a modern, self-contained community.",
    prosAndCons: "Pros: Walking distance to major corporate tech parks, abundant dining and lifestyle choices, and modern co-living facilities. Cons: Heavy traffic congestion on the Outer Ring Road during peak hours, and municipal water supply challenges in some sectors.",
    faq: [
      { q: "Which tech parks are closest to Bellandur?", a: "RMZ Ecospace and RMZ Ecoworld are located directly in Bellandur." },
      { q: "What is the average rent for a double sharing room in Bellandur?", a: "Double sharing rooms average between ₹8,000 and ₹14,000 per month depending on the amenities." },
      { q: "Are food and Wi-Fi included in Bellandur PGs?", a: "Yes, standard PG accommodations include high-speed Wi-Fi, daily housekeeping, and 2 or 3 meals a day." },
      { q: "How is the safety for female residents in Bellandur?", a: "It is highly safe; most PGs feature CCTV surveillance, biometric locks, and security guards." },
      { q: "Is there 24/7 power backup in co-living spaces?", a: "Yes, almost all co-living and premium PGs in Bellandur feature automatic generator backup." },
      { q: "What is the typical security deposit in Bellandur PGs?", a: "The standard deposit is 1 to 2 months of rent, refundable upon checkout." },
      { q: "How do residents commute to Indiranagar from Bellandur?", a: "Residents frequently use BMTC bus routes running along the Outer Ring Road or book auto-rickshaws." },
      { q: "Are there sports or fitness centers nearby?", a: "Yes, Bellandur has multiple fitness clubs, badminton courts, and gyms." }
    ],
  },
  "hsr-layout": {
    overview: "HSR Layout (Hosur-Sarjapur Road Layout) is one of Bangalore's most planned and upscale residential areas. Divided into seven sectors, it is renowned for its wide, tree-lined avenues, beautiful parks, and organized layout. Over the last decade, HSR Layout has emerged as the startup capital of India, housing the headquarters and offices of major unicorns like Swiggy, Cure.fit, and numerous early-stage ventures. The presence of these companies has attracted a large population of young founders, software engineers, designers, and marketing professionals. The locality offers a perfect blend of peaceful residential streets and buzzing commercial sectors. Sector 1 through Sector 7 are lined with trendy cafes, boutique restaurants, co-working spaces, and fitness centers. The high standard of living, combined with the proximity to workplaces, makes HSR Layout one of the most sought-after areas for premium PG accommodations, co-living spaces, and independent flats. It is a highly active neighborhood that appeals to young, ambitious professionals who value both productivity and lifestyle.",
    rentTrends: "Rents in HSR Layout reflect its premium status and high demand. Single sharing PG rooms typically range from ₹12,000 to ₹22,000 per month, offering modern interiors and top-tier services. Double sharing rooms cost between ₹9,000 and ₹16,000 per month. Triple sharing rooms are priced between ₹6,500 and ₹12,000 per month. Premium co-living properties that cater to startup employees often include amenities like rooftop lounges, gym access, and regular community networking events.",
    metroConnectivity: "The closest active metro station is at Silk Board (upcoming interchange) or Jayanagar. BMTC buses, auto-rickshaws, and metro feeder services connect HSR Layout residents to other parts of the city. The planned Silk Board metro station will provide excellent rail connectivity to Electronic City and the Outer Ring Road.",
    safety: "HSR Layout is one of the safest residential areas in Bangalore. Its wide sectors, active street life, community parks, and local police presence make it highly secure. Most PG accommodations feature advanced security systems including biometric entrance gates, continuous CCTV monitoring, and full-time wardens.",
    nearbyITParks: "HSR Layout is a major startup hub itself, and it provides easy access to tech parks on the Outer Ring Road (like Ecospace and TechVillage) and Hosur Road. It serves as a central residence for professionals working in these major office clusters.",
    nearbyColleges: "Reputed institutions like the National Institute of Fashion Technology (NIFT) and The Oxford College of Science are located within HSR Layout, creating a strong student community that drives demand for budget PGs.",
    foodAndLifestyle: "The food scene in HSR Layout is legendary, featuring popular cafes, microbreweries, and street food. 27th Main Road and 19th Main Road are major commercial streets lined with retail stores, gyms, and dessert parlors. The area has multiple parks and sports arenas for recreation.",
    whoShouldStayHere: "HSR Layout is perfect for startup founders, software engineers, designers, fashion students at NIFT, and young professionals who want to live in a highly organized, green, and vibrant neighborhood.",
    prosAndCons: "Pros: Highly organized sectors, excellent food and cafe culture, safe and green environment, and a thriving startup ecosystem. Cons: Higher rental rates compared to neighboring areas, and traffic congestion during rush hours on major commercial roads.",
    faq: [
      { q: "Which sectors in HSR Layout have the best PGs?", a: "Sectors 2, 3, and 7 are highly preferred due to their proximity to cafes, startup offices, and NIFT." },
      { q: "What is the average rent in HSR Layout?", a: "Average PG rents range from ₹7,000 for shared rooms to ₹20,000+ for premium private rooms." },
      { q: "Is HSR Layout safe for women?", a: "Yes, it is widely considered one of the safest and most secure residential neighborhoods in Bangalore." },
      { q: "Are there PGs near NIFT HSR Layout?", a: "Yes, there are several dedicated ladies' and boys' PGs within walking distance of the NIFT campus." },
      { q: "How far is HSR Layout from Koramangala?", a: "Koramangala is adjacent to HSR Layout, approximately 3 to 5 km away depending on the sector." },
      { q: "Do PGs in HSR Layout offer parking?", a: "Yes, many PGs provide dedicated two-wheeler parking, though four-wheeler parking can be limited." },
      { q: "Is food provided on weekends?", a: "Yes, most PGs provide three meals on weekends and breakfast/dinner on weekdays." },
      { q: "What is the typical deposit for HSR PGs?", a: "The typical security deposit is equal to 1 or 2 months of rent." }
    ],
  },
  koramangala: {
    overview: "Koramangala is one of Bangalore's oldest, most prestigious, and culturally vibrant neighborhoods. Divided into 8 blocks, it has transitioned from a quiet residential suburb into a major commercial, startup, and educational hub. Koramangala was the birthplace of India's e-commerce revolution, hosting the early offices of companies like Flipkart and Infosys. Today, it is packed with startup incubators, venture capital offices, co-working spaces, and corporate headquarters. The presence of prestigious institutions like Christ University draws a massive student population, creating a unique, youthful energy. The locality is famous for its tree-canopied streets, trendy boutiques, and the highest concentration of cafes, pubs, and restaurants in Bangalore. From luxury gated villas to modern high-rise co-living spaces, Koramangala caters to a diverse demographic of students, corporate executives, and creative professionals. Its central location provides easy access to MG Road, Indiranagar, and HSR Layout, making it one of the most desirable places to live in the city.",
    rentTrends: "Rental prices in Koramangala are on the higher side due to its central location and premium lifestyle. Single sharing PG rooms typically range from ₹13,000 to ₹24,000 per month, offering high-end amenities and prime location access. Double sharing rooms are priced between ₹9,500 and ₹17,000 per month. Triple sharing rooms cost between ₹7,000 and ₹13,000 per month. Students often share double or triple rooms near Christ University to manage costs.",
    metroConnectivity: "While Koramangala does not have a metro station within its immediate blocks yet, the Trinity and Halasuru Metro Stations on the Purple Line are about 4 to 5 km away. The upcoming South-Second Line will bring closer stations. BMTC buses, auto-rickshaws, and cabs are widely used for daily transit.",
    safety: "Koramangala is a well-policed and highly active area, with bustling streets that remain lively late into the night. It is home to many families, professionals, and students. PG properties implement strict security measures, including round-the-clock guards, CCTV cameras, and secure digital entry locks.",
    nearbyITParks: "The locality is close to the Embassy GolfLinks Business Park (EGL), which houses tech giants like IBM, Microsoft, and Goldman Sachs. It also contains numerous independent office buildings, co-working spaces, and startup incubators.",
    nearbyColleges: "Prestigious institutions like Christ University (Main Campus), St. John's Medical College, and Jyoti Nivas College are located in Koramangala, attracting thousands of students from across India.",
    foodAndLifestyle: "Koramangala is Bangalore’s culinary and nightlife capital. Popular areas like 80 Feet Road and 5th Block are filled with microbreweries, rooftop cafes, and international restaurants. Malls like Forum Mall (Nexus) offer shopping, dining, and movie experiences.",
    whoShouldStayHere: "Koramangala is perfect for Christ University students, young startup employees, venture capitalists, and professionals working in Embassy GolfLinks who want a lively, central location with excellent social infrastructure.",
    prosAndCons: "Pros: Unmatched dining and social scene, central location with easy access to other parts of Bangalore, and close proximity to major universities and tech hubs. Cons: High rental costs and heavy traffic congestion on major roads like Hosur Road and 80 Feet Road.",
    faq: [
      { q: "Which block in Koramangala is best for PGs?", a: "7th Block and 5th Block are highly popular among professionals, while 1st and 8th Blocks are popular for students due to their proximity to Christ University." },
      { q: "What is the average rent in Koramangala?", a: "Average PG rents range from ₹7,000 for shared rooms to ₹22,000+ for premium private rooms." },
      { q: "Are there PGs near Christ University?", a: "Yes, there are numerous student PGs and co-living facilities within walking distance of the Christ University campus." },
      { q: "Is Koramangala safe for students?", a: "Yes, it is a highly active, safe, and student-friendly neighborhood with round-the-clock activity." },
      { q: "How is the connectivity to Indiranagar?", a: "Indiranagar is approximately 5 to 6 km away and is easily reachable via Intermediate Ring Road." },
      { q: "Do PGs in Koramangala have laundry facilities?", a: "Yes, most modern PGs provide washing machines or professional laundry services." },
      { q: "Is food included in Koramangala PG rent?", a: "Yes, meals (breakfast and dinner on weekdays) are typically included in standard packages." },
      { q: "What is the typical deposit in Koramangala?", a: "Security deposits are generally 1 to 2 months of rent, depending on the operator." }
    ],
  },
  "electronic-city": {
    overview: "Electronic City is a massive tech park with ample housing options.",
    rentTrends: "PG rent typically ₹5,000‑₹9,000.",
    metroConnectivity: "Closest metro: Electronic City – 2 km away.",
    safety: "Generally safe with many gated societies.",
    nearbyITParks: "Electronic City itself hosts numerous IT firms.",
    nearbyColleges: "Cambridge Institute of Technology, etc.",
    foodAndLifestyle: "Numerous eateries, supermarkets.",
    whoShouldStayHere: "Best for IT employees working inside Electronic City.",
    prosAndCons: "Pros: proximity to work. Cons: limited nightlife.",
    faq: [],
  },
  brookefield: {
    overview: "Brookefield offers a mix of residential and commercial spaces.",
    rentTrends: "PG rent ₹6,000‑₹9,000.",
    metroConnectivity: "Closest metro: Brookefield – 3 km.",
    safety: "Well‑secured gated communities.",
    nearbyITParks: "Innovative IT Parks nearby.",
    nearbyColleges: "BMS Institute of Technology (nearby).",
    foodAndLifestyle: "Good variety of restaurants and grocery stores.",
    whoShouldStayHere: "Suitable for IT workers commuting to Whitefield.",
    prosAndCons: "Pros: quieter than Whitefield. Cons: slightly farther from main hubs.",
    faq: [],
  },
  mahadevapura: {
    overview: "Mahadevapura is a fast‑growing suburb with many IT campuses.",
    rentTrends: "PG rent ₹5,500‑₹9,000.",
    metroConnectivity: "Nearest metro: Whitefield – 5 km.",
    safety: "Mixed; gated societies are secure.",
    nearbyITParks: "Many IT parks like Ecity, etc.",
    nearbyColleges: "BMS Institute of Technology.",
    foodAndLifestyle: "Emerging food scene, malls.",
    whoShouldStayHere: "Excellent for IT professionals.",
    prosAndCons: "Pros: proximity to workplaces. Cons: traffic.",
    faq: [],
  },
  hoodi: {
    overview: "Hoodi is an upcoming locality near Whitefield.",
    rentTrends: "PG rent ₹5,000‑₹8,000.",
    metroConnectivity: "Nearest metro: Whitefield – 4 km.",
    safety: "Generally safe with many new projects.",
    nearbyITParks: "Close to many tech parks.",
    nearbyColleges: "Near BMS Institute.",
    foodAndLifestyle: "Developing with new cafes and shops.",
    whoShouldStayHere: "Good for budget‑conscious students.",
    prosAndCons: "Pros: affordable. Cons: still developing.",
    faq: [],
  },
  "kr-puram": {
    overview: "KR Puram is a well‑connected suburb near Whitefield.",
    rentTrends: "PG rent ₹5,500‑₹9,000.",
    metroConnectivity: "Nearest metro: Whitefield – 5 km.",
    safety: "Decent safety, many residential societies.",
    nearbyITParks: "Close to ITPL and other parks.",
    nearbyColleges: "Near BMS Institute.",
    foodAndLifestyle: "Growing number of eateries.",
    whoShouldStayHere: "Ideal for commuters.",
    prosAndCons: "Pros: connectivity. Cons: distance from core.",
    faq: [],
  },
};

export default LOCALITY_CONTENT;
