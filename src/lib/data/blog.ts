export interface Author {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
  author: Author;
  tags: string[];
  readingTime?: number;
  featured?: boolean;
}

const authors: Author[] = [
  {
    id: "author-1",
    name: "Minh Tran",
    imageUrl: "/avatar-holder.png",
    bio: "Minh is a travel writer and bus enthusiast with over 10 years of experience exploring Vietnam's most scenic routes.",
  },
  {
    id: "author-2",
    name: "Linh Nguyen",
    imageUrl: "/avatar-holder.png",
    bio: "Linh is a travel blogger specializing in budget-friendly transportation options across Southeast Asia.",
  },
  {
    id: "author-3",
    name: "Hung Pham",
    imageUrl: "/avatar-holder.png",
    bio: "Hung is a transportation expert who has worked with various bus companies throughout Vietnam.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Top 10 Most Scenic Bus Routes in Vietnam",
    slug: "top-scenic-bus-routes-vietnam",
    excerpt:
      "Discover the most beautiful landscapes Vietnam has to offer through these unforgettable bus journeys.",
    content: `
      <p>Vietnam is a country blessed with diverse landscapes, from misty mountains to pristine beaches. One of the best ways to experience this natural beauty is by taking a bus journey through the countryside.</p>
      
      <h2>1. Hai Van Pass</h2>
      <p>The winding road between Hue and Da Nang offers breathtaking views of mountains meeting the sea. This 21km stretch was featured on Top Gear and is considered one of the most scenic coastal roads in the world.</p>
      
      <h2>2. Sa Pa to Hanoi</h2>
      <p>The journey from the terraced rice fields of Sa Pa back to the capital takes you through stunning mountain scenery and traditional villages of Vietnam's northern highlands.</p>
      
      <h2>3. Ho Chi Minh to Dalat</h2>
      <p>Watch as the landscape transforms from urban sprawl to pine-covered highlands as you ascend to Vietnam's favorite mountain retreat.</p>
      
      <h2>4. Mui Ne to Nha Trang</h2>
      <p>This coastal route offers spectacular views of pristine beaches and dramatic sand dunes.</p>
      
      <h2>5. Ha Giang Loop</h2>
      <p>While technically best done by motorbike, many bus companies now offer trips through this remote northern region with its karst plateaus and winding roads.</p>
      
      <h2>6. Hanoi to Cat Ba Island</h2>
      <p>The journey takes you through the industrial heartland of northern Vietnam before a short ferry ride to the jungle-clad island in Ha Long Bay.</p>
      
      <h2>7. Kon Tum to Pleiku</h2>
      <p>This Central Highlands route takes you through coffee plantations and minority villages with a distinctly different feel from coastal Vietnam.</p>
      
      <h2>8. Phong Nha to Hue</h2>
      <p>Travel from the world's most spectacular caves through rural Vietnam to the former imperial capital.</p>
      
      <h2>9. Mekong Delta Routes</h2>
      <p>Any journey through the Mekong Delta region offers views of lush rice paddies, fruit orchards, and life along the mighty river.</p>
      
      <h2>10. Cao Bang to Ban Gioc Waterfall</h2>
      <p>This northern route takes you through some of Vietnam's most dramatic limestone karst scenery to the country's most magnificent waterfall on the Chinese border.</p>
      
      <p>When booking your next bus journey in Vietnam, consider taking one of these routes for an unforgettable travel experience that showcases the country's natural beauty.</p>
    `,
    date: "August 15, 2023",
    imageUrl: "/bus-photo.jpg",
    author: authors[0],
    tags: ["travel", "scenic routes", "tourism", "Vietnam"],
    featured: true,
  },
  {
    id: "blog-2",
    title: "How to Choose the Best Bus Operator for Your Vietnam Journey",
    slug: "choose-best-bus-operator-vietnam",
    excerpt:
      "A comprehensive guide to selecting reliable and comfortable bus services for your travels across Vietnam.",
    content: `
      <p>With dozens of bus companies operating throughout Vietnam, choosing the right one can significantly impact your travel experience. This guide will help you make an informed decision.</p>
      
      <h2>Safety Record</h2>
      <p>Safety should always be your primary concern. Research companies online and read reviews focusing on driver behavior and vehicle maintenance. Major operators like Futa (Phuong Trang), The Sinh Tourist, and Hanh Cafe generally maintain higher safety standards.</p>
      
      <h2>Bus Types and Comfort</h2>
      <p>Vietnamese buses come in several varieties:</p>
      <ul>
        <li><strong>Sleeper buses</strong>: Ideal for overnight journeys with reclining seats or beds</li>
        <li><strong>Limousine buses</strong>: Premium minivans with comfortable seating and fewer passengers</li>
        <li><strong>Local buses</strong>: Basic transportation used mainly by locals</li>
        <li><strong>Express buses</strong>: Standard seating with fewer stops than local buses</li>
      </ul>
      
      <h2>Amenities</h2>
      <p>Better operators provide amenities like:</p>
      <ul>
        <li>Onboard toilets</li>
        <li>USB charging ports</li>
        <li>Blankets and pillows</li>
        <li>Water bottles</li>
        <li>WiFi (though connection quality varies)</li>
      </ul>
      
      <h2>Booking Options</h2>
      <p>Consider companies that offer online booking through their website or apps like Busify. This ensures you have a confirmed seat and reduces the risk of scams.</p>
      
      <h2>Price Transparency</h2>
      <p>Beware of operators that advertise very low prices but add hidden charges. Reputable companies clearly state their prices and what's included.</p>
      
      <h2>Pick-up and Drop-off Locations</h2>
      <p>Some companies offer hotel pick-up and centralized drop-offs, while others only depart from bus stations outside the city center. Check these details when booking to avoid additional transportation costs.</p>
      
      <h2>Top-Rated Bus Operators in Vietnam</h2>
      <ol>
        <li><strong>Futa Bus (Phuong Trang)</strong>: Extensive network with modern fleet</li>
        <li><strong>The Sinh Tourist</strong>: Popular with international travelers</li>
        <li><strong>Hanh Cafe</strong>: Good option for Central Vietnam routes</li>
        <li><strong>Kumho Samco</strong>: Reliable for Mekong Delta travel</li>
        <li><strong>Sapa Express</strong>: Specializes in Hanoi-Sapa route</li>
      </ol>
      
      <p>Remember that even with the best companies, individual experiences can vary. Always book through official channels and be prepared with essentials like motion sickness medication, snacks, and entertainment for your journey.</p>
    `,
    date: "September 5, 2023",
    imageUrl: "/kimlong.jpg",
    author: authors[1],
    tags: ["bus operators", "travel tips", "transportation", "Vietnam"],
  },
  {
    id: "blog-3",
    title: "Essential Tips for Long-Distance Bus Travel in Vietnam",
    slug: "tips-long-distance-bus-travel-vietnam",
    excerpt:
      "Make your extended bus journeys more comfortable and enjoyable with these practical tips from seasoned travelers.",
    content: `
      <p>Long-distance bus travel is one of the most affordable and authentic ways to experience Vietnam. Here's how to make your journey as comfortable as possible.</p>
      
      <h2>Before Your Journey</h2>
      <h3>Pack Smart</h3>
      <p>Keep these essentials in a small bag that stays with you:</p>
      <ul>
        <li>Toilet paper or tissues (often not provided)</li>
        <li>Hand sanitizer</li>
        <li>Eye mask and earplugs</li>
        <li>Neck pillow</li>
        <li>Light jacket or sarong (buses are often heavily air-conditioned)</li>
        <li>Portable phone charger</li>
      </ul>
      
      <h3>Choose Your Seat Wisely</h3>
      <p>On sleeper buses:</p>
      <ul>
        <li>Middle deck offers the smoothest ride</li>
        <li>Avoid seats near the toilet</li>
        <li>Front seats may have more legroom but also more road noise</li>
      </ul>
      
      <h3>Dress Comfortably</h3>
      <p>Wear loose-fitting clothes in layers to adjust to changing temperatures. Slip-on shoes are convenient for frequent on/off boarding.</p>
      
      <h2>During the Journey</h2>
      <h3>Motion Sickness Prevention</h3>
      <p>Vietnamese roads can be winding, especially in mountainous areas:</p>
      <ul>
        <li>Take motion sickness medication 30 minutes before departure</li>
        <li>Avoid heavy meals before travel</li>
        <li>Focus on the horizon or keep your eyes closed</li>
        <li>Pressure bands can help some travelers</li>
      </ul>
      
      <h3>Food and Hydration</h3>
      <p>Most long-distance buses make rest stops every 3-4 hours, but it's wise to:</p>
      <ul>
        <li>Bring your own water</li>
        <li>Pack non-messy snacks</li>
        <li>Be prepared with small Vietnamese currency for rest stop purchases</li>
      </ul>
      
      <h3>Security</h3>
      <p>Keep valuables secure by:</p>
      <ul>
        <li>Using a money belt under clothing</li>
        <li>Keeping important documents in a secure inner pocket</li>
        <li>Using your bag as a pillow while sleeping</li>
        <li>Never leaving valuables in luggage stored under the bus</li>
      </ul>
      
      <h2>Communication Tips</h2>
      <p>Download these before your trip:</p>
      <ul>
        <li>Offline Google Maps of your route</li>
        <li>Google Translate with Vietnamese downloaded</li>
        <li>Screenshots of your destination in Vietnamese</li>
      </ul>
      
      <p>With these preparations, even the longest bus journey can become a comfortable and memorable part of your Vietnam experience.</p>
    `,
    date: "October 12, 2023",
    imageUrl: "/copy.jpg",
    author: authors[2],
    tags: ["bus travel", "travel tips", "long distance", "comfort"],
  },
  {
    id: "blog-4",
    title: "Understanding Vietnam's Bus Station System",
    slug: "vietnam-bus-station-system",
    excerpt:
      "Navigate Vietnam's complex network of bus stations with confidence using this comprehensive guide.",
    content: `
      <p>Vietnam's bus transportation system can be confusing to newcomers, with multiple stations serving different destinations in each city. This guide will help you understand how the system works.</p>
      
      <h2>Types of Bus Stations in Vietnam</h2>
      
      <h3>1. Major Intercity Terminals</h3>
      <p>Large cities have multiple major terminals, each serving different regions:</p>
      <ul>
        <li><strong>Hanoi</strong>: My Dinh (west/northwest destinations), Giap Bat (south destinations), Nuoc Ngam (northeast destinations)</li>
        <li><strong>Ho Chi Minh City</strong>: Mien Dong (eastern/northern destinations), Mien Tay (Mekong Delta destinations)</li>
      </ul>
      
      <h3>2. Tourist Bus Stations</h3>
      <p>Unofficial hubs in backpacker areas where tourist-oriented companies operate:</p>
      <ul>
        <li>De Tham/Pham Ngu Lao area in HCMC</li>
        <li>Old Quarter in Hanoi</li>
      </ul>
      
      <h3>3. Local Bus Depots</h3>
      <p>Smaller stations for short-distance travel to surrounding towns and villages.</p>
      
      <h2>How to Find the Right Station</h2>
      
      <p>To determine which station serves your destination:</p>
      <ol>
        <li>Ask your accommodation's reception</li>
        <li>Check online booking platforms like Busify that specify departure points</li>
        <li>Look for destination boards at the stations</li>
      </ol>
      
      <h2>Navigating Bus Stations</h2>
      
      <h3>Ticket Counters</h3>
      <p>Most stations have:</p>
      <ul>
        <li>Numbered ticket windows organized by destination or company</li>
        <li>Electronic display boards (in larger stations)</li>
        <li>Information desks (staff may have limited English)</li>
      </ul>
      
      <h3>Finding Your Bus</h3>
      <p>After purchasing your ticket:</p>
      <ul>
        <li>Check the departure platform number on your ticket</li>
        <li>Arrive at least 30 minutes before scheduled departure</li>
        <li>Confirm with station staff if unsure</li>
        <li>Look for staff holding signs with destination names</li>
      </ul>
      
      <h2>Tips for Major Bus Stations</h2>
      
      <h3>Getting to the Station</h3>
      <p>Major terminals are often located on the outskirts of cities:</p>
      <ul>
        <li>Use ride-hailing apps like Grab</li>
        <li>Take local buses (most economical but requires planning)</li>
        <li>Negotiate taxi fares in advance if not using metered taxis</li>
      </ul>
      
      <h3>Facilities at Major Stations</h3>
      <ul>
        <li>Food stalls and convenience stores</li>
        <li>Basic restrooms (may require a small fee)</li>
        <li>Luggage storage services at some locations</li>
        <li>Limited seating in waiting areas</li>
      </ul>
      
      <p>Understanding this system will help you navigate Vietnam's extensive bus network with confidence and make your journey smoother from start to finish.</p>
    `,
    date: "November 8, 2023",
    imageUrl: "/place-holder.png",
    author: authors[0],
    tags: ["bus stations", "transportation", "travel guide", "Vietnam"],
  },
  {
    id: "blog-5",
    title: "The Environmental Impact of Bus Travel in Vietnam",
    slug: "environmental-impact-bus-travel-vietnam",
    excerpt:
      "Discover how choosing bus transportation contributes to sustainable tourism in Vietnam.",
    content: `
      <p>As Vietnam faces increasing environmental challenges from rapid development and tourism growth, sustainable transportation choices have never been more important. This article examines how bus travel compares to other transportation options from an environmental perspective.</p>
      
      <h2>Carbon Footprint Comparison</h2>
      <p>Per passenger kilometer traveled:</p>
      <ul>
        <li><strong>Domestic flights</strong>: 255g CO2</li>
        <li><strong>Private car</strong>: 171g CO2</li>
        <li><strong>Motorbike</strong>: 103g CO2</li>
        <li><strong>Bus</strong>: 68g CO2</li>
        <li><strong>Train</strong>: 41g CO2</li>
      </ul>
      <p>When a bus is at full capacity, it represents one of the most environmentally friendly motorized transport options available in Vietnam.</p>
      
      <h2>Reducing Traffic Congestion</h2>
      <p>Vietnam's major cities face severe congestion issues:</p>
      <ul>
        <li>A single bus can replace approximately 30 cars on the road</li>
        <li>Reduced vehicles mean less time idling in traffic</li>
        <li>Lower overall fuel consumption and emissions</li>
      </ul>
      
      <h2>Industry Improvements</h2>
      <p>Vietnam's bus sector is gradually becoming more sustainable:</p>
      <h3>Fleet Modernization</h3>
      <ul>
        <li>Newer buses meet higher emission standards</li>
        <li>More fuel-efficient engines</li>
        <li>Some companies beginning to introduce electric buses in urban areas</li>
      </ul>
      
      <h3>Eco-Friendly Initiatives</h3>
      <p>Leading companies are implementing:</p>
      <ul>
        <li>Driver training for fuel-efficient driving techniques</li>
        <li>Plastic reduction programs on board</li>
        <li>Digital ticketing to reduce paper waste</li>
      </ul>
      
      <h2>Responsible Travel Choices</h2>
      <p>As a traveler, you can further reduce your environmental impact:</p>
      <ul>
        <li>Choose companies with newer, more efficient fleets</li>
        <li>Opt for direct routes when possible</li>
        <li>Bring your own water bottle and refuse single-use plastics</li>
        <li>Consider carbon offset programs for your journey</li>
      </ul>
      
      <h2>The Future of Green Bus Travel</h2>
      <p>Vietnam's transportation sector is evolving:</p>
      <ul>
        <li>Government initiatives promoting public transport development</li>
        <li>Investment in Bus Rapid Transit (BRT) systems</li>
        <li>Growing interest in electric and hybrid bus technology</li>
      </ul>
      
      <p>By choosing bus travel for your journeys through Vietnam, you're not only experiencing the country more intimately but also making a more environmentally responsible choice that helps preserve Vietnam's natural beauty for future generations.</p>
    `,
    date: "January 20, 2024",
    imageUrl: "/place-holder.png",
    author: authors[1],
    tags: [
      "sustainable travel",
      "environment",
      "eco-friendly",
      "green transportation",
    ],
  },
  {
    id: "blog-6",
    title: "Night Bus in Vietnam: A Complete Survival Guide",
    slug: "night-bus-vietnam-survival-guide",
    excerpt:
      "Everything you need to know about taking overnight buses in Vietnam, from choosing the right service to arriving at your destination well-rested.",
    content: `
      <p>Overnight buses are a popular way to travel long distances in Vietnam while saving on accommodation costs. This guide will prepare you for the unique experience of Vietnamese sleeper buses.</p>
      
      <h2>Types of Night Buses</h2>
      
      <h3>Standard Sleeper Buses</h3>
      <ul>
        <li>Three rows of bunk-style reclining seats</li>
        <li>Seats convert to near-horizontal position</li>
        <li>Typically arranged in two levels</li>
        <li>Shared for both locals and tourists</li>
      </ul>
      
      <h3>Luxury/VIP Sleeper Buses</h3>
      <ul>
        <li>More spacious seating arrangements</li>
        <li>Personal reading lights and USB charging</li>
        <li>Sometimes include complimentary snacks and water</li>
        <li>Better suspension systems for smoother rides</li>
      </ul>
      
      <h3>Limousine Sleeper Vans</h3>
      <ul>
        <li>Premium minivans with 9-11 fully reclining seats</li>
        <li>More privacy and comfort than standard buses</li>
        <li>Higher price point but often worth the upgrade</li>
      </ul>
      
      <h2>What to Expect</h2>
      
      <h3>Seating/Sleeping Arrangement</h3>
      <p>Vietnamese sleeper buses are unique:</p>
      <ul>
        <li>Seats are designed for the average Vietnamese frame (may feel cramped for taller travelers)</li>
        <li>You'll be asked to remove shoes (stored in plastic bags)</li>
        <li>Each "bed" is approximately 170cm long and 50cm wide</li>
        <li>Privacy is minimal - prepare to be in close proximity to others</li>
      </ul>
      
      <h3>Bathroom Breaks</h3>
      <ul>
        <li>Most buses stop every 3-4 hours at rest areas</li>
        <li>Some newer buses have onboard toilets (for emergencies only)</li>
        <li>Rest stops are typically 15-20 minutes</li>
      </ul>
      
      <h3>Overnight Schedule</h3>
      <ul>
        <li>Most night buses depart between 6-9pm</li>
        <li>Arrival times are often early morning (4-7am)</li>
        <li>Actual travel time may be longer than advertised</li>
      </ul>
      
      <h2>Survival Tips</h2>
      
      <h3>Choosing Your Seat</h3>
      <ul>
        <li><strong>Best option</strong>: Middle section, upper deck</li>
        <li><strong>Avoid</strong>: Back row (near toilet), front row (road noise and visibility of driving style)</li>
        <li><strong>For couples</strong>: Request adjacent beds when booking</li>
      </ul>
      
      <h3>Essential Items</h3>
      <ul>
        <li>Eye mask and earplugs</li>
        <li>Travel pillow (even though basic pillows are provided)</li>
        <li>Sanitizing wipes</li>
        <li>Warm layer (air conditioning can be extreme)</li>
        <li>Downloaded entertainment and battery pack</li>
        <li>Motion sickness medication</li>
      </ul>
      
      <h3>Safety Considerations</h3>
      <ul>
        <li>Keep valuables on your person while sleeping</li>
        <li>Use a small bag as a pillow for extra security</li>
        <li>Inform yourself about your arrival point before departure</li>
        <li>Save your hotel's address and phone number accessible offline</li>
      </ul>
      
      <h3>Arrival Planning</h3>
      <ul>
        <li>Research accommodation with 24-hour reception or early check-in options</li>
        <li>Have a backup plan for early morning arrival when city is still dark</li>
        <li>Arrange transportation from drop-off point in advance when possible</li>
      </ul>
      
      <p>With proper preparation, night bus travel can be not just economical but also a memorable part of your Vietnam adventure. Just remember that a sense of humor and flexibility are essential companions for this unique travel experience.</p>
    `,
    date: "February 15, 2024",
    imageUrl: "/place-holder.png",
    author: authors[2],
    tags: ["night bus", "sleeper bus", "travel tips", "overnight travel"],
  },
];
