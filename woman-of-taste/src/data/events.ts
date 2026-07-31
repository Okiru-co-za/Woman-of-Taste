export interface EventHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  startDateIso?: string;
  time?: string;
  location: string;
  locationDetail?: string;
  venueUrl?: string;
  description: string;
  story: string;
  storyAct2?: string;
  type: "upcoming" | "private";
  category?: string;
  ctaLabel?: string;
  sold_out?: boolean;
  price?: number;
  ticketsLeft?: number;
  totalCapacity?: number;
  dressCode?: string;
  bookingOpen?: boolean;
  highlights: EventHighlight[];
  theme: {
    season: string;
    gradient: string;
    gradientDark: string;
    accent: string;
    accentDark: string;
    textLight: string;
  };
  cardTagline: string;
  partners?: { name: string; logoUrl: string }[];
  heroStyle?: "gradient" | "poster";
  heroTitleFont?: string;
  heroDateLabel?: string;
  heroTimeLabel?: string;
  heroCtaLabel?: string;
  heroBackgroundImage?: string;
}

export const events: Event[] = [
  {
    id: "devil-wears-prada-screening-apr-2026",
    title: "The Devil Wears Prada II",
    subtitle: "A Private Screening Evening",
    date: "1 May 2026",
    startDateIso: "2026-05-01T17:30:00+02:00",
    time: "17:30 — Late",
    location: "Egrek Cinema, Parkhurst",
    locationDetail: "Venue details shared upon reservation",
    description:
      "An exclusive private screening of The Devil Wears Prada sequel — curated for women who understand that style is not just what you wear, but how you live.",
    story: `She didn't just walk into the room. She changed the temperature of it.\n\nThe Devil Wears Prada defined a generation of women who dared to want more — who understood that ambition and elegance are not opposites, but companions. Now, the sequel arrives. And Woman of Taste is hosting an exclusive private screening for the women who understood that from the very beginning.\n\nThis is not a movie night. This is a declaration.`,
    storyAct2: `Arrive dressed as the editor of your own life. Mingle with women who are building something — brands, careers, legacies, dining tables worth gathering around. Sip bubbly in a setting designed to feel like the opening scene of a film you were always meant to be in.\n\nThen settle in. Watch the story unfold. Let it remind you — if you ever needed reminding — that the best seats at the table belong to those who show up dressed for them.`,
    type: "upcoming",
    category: "Private Screening",
    ctaLabel: "Claim Your Seat",
    price: 650,
    totalCapacity: 30,
    dressCode: "Fashion Editorial — your most compelling look",
    bookingOpen: true,
    cardTagline: "An evening where ambition meets elegance",
    highlights: [
      { icon: "🎬", title: "Exclusive Screening", description: "A private cinema experience before the film reaches mainstream audiences" },
      { icon: "🥂", title: "Bubbly Reception", description: "Arrive to welcome drinks and a styled reception area" },
      { icon: "👗", title: "Style Moment", description: "Dress as the editor of your own life — best dressed wins a WOT prize" },
      { icon: "✦", title: "WOT Gifting", description: "Every guest leaves with a curated Woman of Taste goodie bag" },
    ],
    theme: {
      season: "autumn",
      gradient: "linear-gradient(160deg, #1a0808 0%, #2a0e0e 40%, #3d1212 70%, #200a0a 100%)",
      gradientDark: "linear-gradient(135deg, #1a0808 0%, #2a0e0e 100%)",
      accent: "hsl(5,65%,68%)",
      accentDark: "hsl(5,60%,52%)",
      textLight: "rgba(255,238,238,0.85)",
    },
  },
  {
    id: "la-femme-luna-lusa-aug-2026",
    title: "La Femme by Luna Lusa",
    subtitle: "Women of Taste Soirée",
    date: "9 August 2026",
    startDateIso: "2026-08-09T12:00:00+02:00",
    time: "Noon — 17:00",
    location: "Luna Lusa, Kyalami",
    locationDetail: "Corner Allandale & President Drive, Kyalami, Midrand, 1685",
    venueUrl: "https://lunalusa.com/",
    description:
      "An afternoon soirée in shades of pink and white, featuring a two-course set menu, a crafted cocktail flight, and a full pampering experience at Luna Lusa, Kyalami.",
    story: `Some afternoons ask you to arrive fully, dressed in softness, ready to be poured into.\n\nLa Femme by Luna Lusa is Woman of Taste's ode to that kind of afternoon. Pink and white as far as the eye can see. Prosecco that never stops arriving. A room full of women who came to be celebrated, not just to celebrate.\n\nThis is not just lunch. This is a whole afternoon designed around the art of being a woman of taste, savoured slowly, from noon until the light turns golden.`,
    storyAct2: `Woman of Taste has partnered with Luna Lusa in Kyalami, alongside DineXp, PORE Aesthetic Clinic, CORE Reformer Pilates, and Cuvée Zero de Bain, to curate a soirée that goes far beyond the table. Settle in for a two-course set menu and a crafted cocktail flight, top up your glass with complimentary Italian prosecco, and drift between a personalised body scrub station and a mist & hydration booth between courses.\n\nCome dressed in shades of pink and white. Bring the version of yourself that's ready to be looked after for a change.`,
    type: "upcoming",
    category: "Women's Soirée",
    ctaLabel: "Reserve Your Seat",
    price: 850,
    totalCapacity: 100,
    dressCode: "Shades of pink and white",
    bookingOpen: true,
    cardTagline: "An afternoon in shades of pink and white",
    highlights: [
      { icon: "🍽️", title: "2-Course Set Menu", description: "A seasonal two-course menu, plated for a leisurely afternoon" },
      { icon: "🍸", title: "Cocktail Flight", description: "A crafted flight of signature cocktails to sip your way through" },
      { icon: "🥂", title: "Italian Prosecco", description: "Complimentary Italian prosecco, courtesy of Cuvée Zero de Bain" },
      { icon: "🧴", title: "Body Scrub Station", description: "A personalised body scrub station, courtesy of PORE Aesthetic Clinic" },
      { icon: "📸", title: "Professional Photographer", description: "A professional photographer capturing every shade of the afternoon" },
      { icon: "💦", title: "Mist & Hydration Booth", description: "A mist & hydration booth to keep you glowing from noon to close" },
    ],
    partners: [
      { name: "DineXp", logoUrl: "/images/partners/dinexp.png" },
      { name: "PORE Aesthetic Clinic", logoUrl: "/images/partners/pore.png" },
      { name: "CORE Reformer Pilates", logoUrl: "/images/partners/core.png" },
      { name: "Cuvée Zero de Bain", logoUrl: "/images/partners/cuvee-zero-de-bain.png" },
    ],
    heroStyle: "poster",
    heroTitleFont: "'Alex Brush', cursive",
    heroDateLabel: "9 AUGUST",
    heroTimeLabel: "NOON TO 5PM",
    heroCtaLabel: "Book Now",
    heroBackgroundImage: "/images/events/la-femme/hero-bg.jpg",
    theme: {
      season: "la-femme",
      gradient: "linear-gradient(160deg, #6b2440 0%, #96395c 35%, #c96f8c 65%, #f5dbe4 100%)",
      gradientDark: "linear-gradient(135deg, #6b2440 0%, #8a3454 100%)",
      accent: "hsl(340,70%,88%)",
      accentDark: "hsl(335,55%,68%)",
      textLight: "rgba(255,245,248,0.92)",
    },
  },
  {
    id: "high-tea-buitengeluk-jun-2026",
    title: "High Tea at Buitengeluk",
    subtitle: "A Winter Afternoon in the Country",
    date: "19 September 2026",
    startDateIso: "2026-09-19T17:00:00+02:00",
    time: "17:00 — 20:00",
    location: "Buitengeluk, Broadacres",
    locationDetail: "Buitengeluk, Broadacres, Johannesburg",
    description:
      "An intimate late-winter high tea at the beloved Buitengeluk in Broadacres, Johannesburg. Think crisp August air, open fires, delicate tiered stands, and the kind of afternoon that stays with you long after the last cup.",
    story: `There is a specific kind of magic that only winter knows.\n\nWhen Johannesburg exhales its summer heat and the highveld turns gold. When the air sharpens and every warm drink becomes an act of grace. When the world slows down just enough to remember that the most luxurious thing you can give yourself is time — unhurried, present, and fully alive.\n\nBuitengeluk means "outside happiness". And on an August afternoon in Broadacres, tucked into one of Johannesburg's most beloved hidden escapes, you will feel exactly that.`,
    storyAct2: `Woman of Taste has curated an afternoon high tea at Buitengeluk — a destination known for its warmth, its gardens, and the way it makes you forget the city is just beyond the gate. Think white linen, tiered stands dressed in seasonal pastries, finger sandwiches crafted with care, and tea blends chosen for the kind of conversation that follows the second cup.\n\nThis is a gathering for women who understand the art of pause. Who know that slowness is not the opposite of ambition — it is what sustains it.`,
    type: "upcoming",
    category: "High Tea",
    ctaLabel: "Reserve Your Seat",
    price: 950,
    ticketsLeft: 20,
    dressCode: "Garden elegance — florals, linen, your softest self",
    bookingOpen: true,
    cardTagline: "Where winter warmth meets countryside elegance",
    highlights: [
      { icon: "🫖", title: "Curated High Tea", description: "A full tiered spread of pastries, scones, finger sandwiches and seasonal blends" },
      { icon: "🌿", title: "Buitengeluk, Broadacres", description: "The gardens and interiors of this Johannesburg hidden gem, dressed for the occasion" },
      { icon: "🔥", title: "Open Fires & Warmth", description: "Intimate seating around fireplaces in the estate's beautiful interior" },
      { icon: "📸", title: "Styled Moments", description: "A beautifully curated setting designed to be experienced and remembered" },
    ],
    theme: {
      season: "winter",
      gradient: "linear-gradient(160deg, #1e2d1e 0%, #2d3d28 35%, #3a4a30 65%, #4a5a3a 100%)",
      gradientDark: "linear-gradient(135deg, #1e2d1e 0%, #2d3d28 100%)",
      accent: "hsl(85,40%,68%)",
      accentDark: "hsl(85,45%,52%)",
      textLight: "rgba(240,248,235,0.85)",
    },
  },
  {
    id: "spring-bloom-sep-2026",
    title: "In Full Bloom",
    subtitle: "A Spring Celebration",
    date: "11 October 2026",
    startDateIso: "2026-10-11T17:00:00+02:00",
    time: "17:00 — Late",
    location: "Johannesburg",
    locationDetail: "Garden venue — details to follow",
    description:
      "Spring returns. The jacarandas bloom. And Woman of Taste hosts an outdoor celebration of new beginnings, beauty, and the joy of being fully, seasonally alive.",
    story: `There is a moment in September when Johannesburg exhales.\n\nThe jacarandas release their purple — slowly at first, then all at once — and the city remembers what it looks like to be in bloom. Streets become canopies. The light turns softer. Even the morning tastes different.\n\nIt is our favourite season. And we have decided it deserves a celebration.`,
    storyAct2: `In Full Bloom is a spring outdoor experience designed to feel like the most beautiful afternoon of the year. A garden setting, fresh florals, a grazing table overflowing with seasonal produce, and a programme built around the things that make spring feel alive — colour, connection, and the distinct pleasure of being exactly where you're meant to be.\n\nCome dressed in your spring colours. Bring the version of yourself that's been waiting for the season to change. Because this is your moment to bloom.`,
    type: "upcoming",
    category: "Spring Event",
    ctaLabel: "Reserve Your Spot",
    price: 780,
    ticketsLeft: 50,
    dressCode: "Spring florals, pastels, and your brightest self",
    bookingOpen: false,
    cardTagline: "When the jacarandas bloom, we gather",
    highlights: [
      { icon: "🌸", title: "Garden Setting", description: "A beautifully styled outdoor venue celebrating the season in full colour" },
      { icon: "🫐", title: "Spring Grazing Table", description: "A lavish spread of seasonal produce, charcuterie, and artisan selections" },
      { icon: "📷", title: "Floral Moments", description: "A styled bloom installation — the backdrop for your spring portraits" },
      { icon: "🎶", title: "Live Soundtrack", description: "Curated acoustic music setting the tone for the most beautiful afternoon" },
    ],
    theme: {
      season: "spring",
      gradient: "linear-gradient(160deg, #3a0a0a 0%, #601020 30%, #9a1a30 65%, #c04050 100%)",
      gradientDark: "linear-gradient(135deg, #3a0a0a 0%, #601020 100%)",
      accent: "hsl(348,65%,75%)",
      accentDark: "hsl(348,60%,58%)",
      textLight: "rgba(255,240,242,0.88)",
    },
  },
  {
    id: "december-braai-farmhouse58-dec-2026",
    title: "The December Braai",
    subtitle: "A Summer Gathering at Farmhouse 58",
    date: "6 December 2026",
    startDateIso: "2026-12-06T17:00:00+02:00",
    time: "17:00 — Sundown",
    location: "Farmhouse 58, Johannesburg",
    locationDetail: "Farmhouse 58, Johannesburg",
    description:
      "An elevated end-of-year braai at the beautiful Farmhouse 58 — think wood smoke, warm Johannesburg sunshine, long tables, and a community of women celebrating everything the year has held.",
    story: `There is no better way to close a year than around a fire.\n\nDecember in Johannesburg is something specific — the air thick with heat and the smell of rain just done, the light golden and forgiving, the city finally exhaling. Everyone is softer in December. More present. More willing to sit a little longer.\n\nWoman of Taste is gathering her community for an end-of-year braai at Farmhouse 58 — a venue that feels like stepping into someone's most beautiful idea of a country home, right in the heart of Johannesburg.`,
    storyAct2: `This is not a formal affair. This is a long afternoon with the women who made your year meaningful — or the women who are about to.\n\nExpect fire-kissed food crafted with care. Cold drinks sweating in the summer heat. Music that moves between background and foreground. Laughter that carries. Gratitude that settles somewhere in your chest and stays.\n\nBring your appetite. Bring your warmth. The year deserves to be celebrated — and so do you.`,
    type: "upcoming",
    category: "Braai & Gathering",
    ctaLabel: "Join the Gathering",
    price: 850,
    ticketsLeft: 50,
    dressCode: "Summer ease — linen, colour, and comfortable shoes",
    bookingOpen: false,
    cardTagline: "Close the year around a fire with your people",
    highlights: [
      { icon: "🔥", title: "The Braai", description: "A fire-crafted spread — meats, salads, sides, and all the good things" },
      { icon: "🌿", title: "Farmhouse 58", description: "A gorgeous Johannesburg venue that feels like an escape from the city" },
      { icon: "🎶", title: "Afternoon Vibes", description: "Curated music flowing from lunch through to the golden hour" },
      { icon: "🥂", title: "End-of-Year Toast", description: "A collective celebration of everything the year held — and what's coming" },
    ],
    theme: {
      season: "summer",
      gradient: "linear-gradient(160deg, #3a1a05 0%, #6b2f0a 30%, #c4601a 65%, #e8932a 100%)",
      gradientDark: "linear-gradient(135deg, #3a1a05 0%, #6b2f0a 100%)",
      accent: "hsl(35,90%,68%)",
      accentDark: "hsl(35,85%,52%)",
      textLight: "rgba(255,245,228,0.88)",
    },
  },
  {
    id: "restaurant-immersion-experience",
    title: "Restaurant Immersion Experience",
    subtitle: "A Private Dining Journey",
    date: "By Invitation Only",
    location: "Partner Restaurant — Johannesburg",
    description:
      "A private dining experience hosted in collaboration with one of our curated restaurant partners. Guests receive a behind-the-scenes perspective on hospitality excellence.",
    story: "An exclusive look behind the pass at one of Johannesburg's finest establishments.",
    type: "private",
    category: "Private Experience",
    ctaLabel: "Express Your Interest",
    cardTagline: "Behind the scenes of hospitality excellence",
    highlights: [],
    theme: {
      season: "private",
      gradient: "linear-gradient(135deg, hsl(225,50%,22%), hsl(225,42%,32%))",
      gradientDark: "linear-gradient(135deg, hsl(225,50%,22%), hsl(225,42%,32%))",
      accent: "hsl(38,45%,65%)",
      accentDark: "hsl(38,45%,55%)",
      textLight: "rgba(255,248,235,0.85)",
    },
  },
  {
    id: "wot-x-dinexp-sip-and-connect",
    title: "WOT × DineXP: Sip & Connect",
    subtitle: "A Community Gathering",
    date: "By Invitation Only",
    location: "Rotating Venues — Johannesburg & Cape Town",
    description:
      "A quarterly gathering of restaurant owners, hospitality professionals, and the Woman of Taste community around what it means to deliver truly exceptional dining experiences.",
    story: "An invitation-only evening of conversation and strategy for the hospitality community.",
    type: "private",
    category: "Community Gathering",
    ctaLabel: "Express Your Interest",
    cardTagline: "Where hospitality leaders connect",
    highlights: [],
    theme: {
      season: "private",
      gradient: "linear-gradient(135deg, hsl(225,50%,22%), hsl(225,42%,32%))",
      gradientDark: "linear-gradient(135deg, hsl(225,50%,22%), hsl(225,42%,32%))",
      accent: "hsl(38,45%,65%)",
      accentDark: "hsl(38,45%,55%)",
      textLight: "rgba(255,248,235,0.85)",
    },
  },
];

export const isEventPast = (event: Event): boolean =>
  event.startDateIso ? new Date(event.startDateIso).getTime() < Date.now() : false;

export const getUpcomingEvents = () => events.filter((e) => e.type === "upcoming" && !isEventPast(e));
export const getPastEvents = () =>
  events
    .filter((e) => e.type === "upcoming" && isEventPast(e))
    .sort((a, b) => new Date(b.startDateIso!).getTime() - new Date(a.startDateIso!).getTime());
export const getPrivateEvents = () => events.filter((e) => e.type === "private");
export const getEventById = (id: string) => events.find((e) => e.id === id);
