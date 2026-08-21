import type { PropertyType } from "./portfolio-data";

export type SpecGroup = {
  title: string;
  items: string[];
};

export type FloorSchedule = {
  name: string;
  units: Array<{ apt: string; beds: string; size?: string }>;
};

export type Residence = {
  name: string;
  size: string;
  floor: string;
  status: string;
  image: string;
};

export type FloorPlan = {
  name: string;
  image: string;
};

export type Agent = {
  name: string;
  /** Firm and email, shown beneath the name. */
  detail: string;
  phone?: string;
  /** Overrides the use-derived "Sales Agent" / "Lettings Agent" heading. */
  label?: string;
};

export type PropertyPageData = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  type: PropertyType;
  status: string;
  heroImage: string;
  // CSS object-position for the hero crop. The hero is a wide band, so portrait
  // photography needs steering towards the part of the building that reads:
  // rooflines, entrances and signage rather than a mid-facade slice. Omit for
  // landscape imagery, which centres fine.
  heroPosition?: string;
  intro: {
    heading: string;
    body: string[];
    image: string;
    imageAlt: string;
    imagePosition?: string;
  };
  stats: Array<{ value: string; label: string }>;
  features?: {
    heading: string;
    description: string;
    items: string[];
  };
  spec?: {
    heading: string;
    description: string;
    groups: SpecGroup[];
  };
  floors?: {
    heading: string;
    description: string;
    // What a unit is called in this schedule ("Suite" for workspace);
    // defaults to "Apartment" when omitted.
    unitNoun?: string;
    schedule: FloorSchedule[];
  };
  residences?: {
    heading: string;
    description: string;
    items: Residence[];
  };
  floorPlans?: FloorPlan[];
  locationSection?: {
    heading: string;
    body: string[];
    distances: Array<{ value: string; label: string }>;
    // Optional companion site about the surrounding area, linked beneath the
    // location copy.
    link?: { label: string; href: string };
  };
  gallery?: Array<{ src: string; alt: string }>;
  /** Full postal address of the site, shown in the enquire section. */
  address?: string;
  /**
   * Appointed agents, in the order the scheme wants them listed. Schemes let or
   * sold jointly carry more than one contact, so the heading pluralises from
   * the first entry's label.
   */
  agents?: Agent[];
  listings?: Array<{ label: string; detail: string; href: string }>;
  /**
   * The scheme's own microsite. Schemes without one yet point at their own
   * page here (a relative path), which the detail page renders as an
   * internal link rather than an external one.
   */
  micrositeUrl: string;
  micrositeLabel: string;
};

export const PROPERTY_PAGES: PropertyPageData[] = [
  {
    slug: "the-courthouse",
    name: "The Courthouse",
    eyebrow: "Hibel Road · Macclesfield",
    tagline: "A collection of 13 one & two bedroom apartments",
    type: "Residential",
    status: "For Sale",
    heroImage: "/images/courthouse/hero-v2.jpg",
    intro: {
      heading: "Welcome to The Courthouse",
      body: [
        "The Courthouse is an elegant conversion of the former Macclesfield courthouse, consisting of 13 one and two-bedroom apartments in the heart of the bustling market town.",
        "Each home has been expertly designed to offer spacious, light-filled interiors, beautifully finished and equipped with an exceptional standard of specification. Built in 1934 and part of the fabric of Macclesfield's landscape for 90 years, the building has been re-imagined with a new roof-top extension boasting magnificent views towards Macclesfield Forest.",
      ],
      image: "/images/courthouse/kitchen.jpg",
      imageAlt: "Open-plan kitchen and living interior at The Courthouse",
    },
    stats: [
      { value: "13", label: "Apartments" },
      { value: "1934", label: "Originally built" },
      { value: "0.5mi", label: "To Macclesfield station" },
    ],
    spec: {
      heading: "Specification",
      description:
        "A scheme designed to cook, entertain and relax, with careful consideration given to ergonomics, materials and energy efficiency throughout.",
      groups: [
        {
          title: "Kitchens",
          items: [
            "British-made cabinetry",
            "Quartz work surfaces",
            "Branded integrated appliances",
            "Integrated dishwasher",
            "Separate store with washer/dryer",
          ],
        },
        {
          title: "Bathrooms",
          items: [
            "Contemporary branded sanitaryware",
            "Chrome brassware and thermostatic showers",
            "Full-height tiling to wet areas",
            "Heated towel rails",
          ],
        },
        {
          title: "Heating & Safety",
          items: [
            "Electric panel heating",
            "Intercom system",
            "External lighting",
          ],
        },
        {
          title: "Decoration",
          items: [
            "White emulsion throughout",
            "Carpet to bedrooms",
            "Hard flooring to kitchen, living and hall",
            "Tiled floors to bathrooms",
          ],
        },
        {
          title: "External",
          items: [
            "Bike & bin store",
            "1 parking space per apartment",
            "Security lighting",
          ],
        },
        {
          title: "General",
          items: ["10 year structural warranty"],
        },
      ],
    },
    floors: {
      heading: "The Apartments",
      description: "Thirteen homes across four floors.",
      schedule: [
        {
          name: "Lower Ground",
          units: [
            { apt: "01", beds: "2 Bedrooms" },
            { apt: "02", beds: "1 Bedroom" },
          ],
        },
        {
          name: "Upper Ground",
          units: [
            { apt: "03", beds: "2 Bedrooms" },
            { apt: "04", beds: "2 Bedrooms" },
            { apt: "05", beds: "1 Bedroom" },
            { apt: "06", beds: "1 Bedroom" },
          ],
        },
        {
          name: "First Floor",
          units: [
            { apt: "07", beds: "2 Bedrooms" },
            { apt: "08", beds: "1 Bedroom" },
            { apt: "09", beds: "1 Bedroom" },
            { apt: "10", beds: "2 Bedrooms" },
          ],
        },
        {
          name: "Second Floor",
          units: [
            { apt: "11", beds: "2 Bedrooms" },
            { apt: "12", beds: "2 Bedrooms" },
            { apt: "13", beds: "2 Bedrooms" },
          ],
        },
      ],
    },
    locationSection: {
      heading: "Magnificent Macclesfield",
      body: [
        "Sitting on the edge of the Peak District, Macclesfield combines contemporary culture and cuisine with spectacular landscapes. The historic market town ranks high among the UK's happiest places to live.",
        "Cobblestone streets, hills and former mills provide the backdrop for an exciting food and drink scene, and the monthly Treacle Market brings over 160 stalls of artisan food, drink and vintage finds to the town centre. Macclesfield Forest, Lyme Park and Tegg's Nose are all close by for Sunday walks.",
      ],
      distances: [
        { value: "0.5 mi", label: "Macclesfield Station" },
        { value: "5.9 mi", label: "Alderley Edge" },
        { value: "8.2 mi", label: "Wilmslow" },
        { value: "12.6 mi", label: "Stockport" },
        { value: "12.8 mi", label: "Manchester Airport" },
        { value: "20.3 mi", label: "Manchester" },
      ],
    },
    address: "The Courthouse, Hibel Road, Macclesfield, Cheshire",
    agents: [
      {
        name: "Bridgfords",
        detail: "Appointed sales agent · Macclesfield",
      },
    ],
    listings: [
      {
        label: "One & Two Bedroom Apartments",
        detail: "For Sale · Listed via Bridgfords on Rightmove",
        href: "https://www.bridgfords.co.uk/properties/21990064/sales/LKS260140",
      },
    ],
    gallery: [
      { src: "/images/courthouse/bedroom.jpg", alt: "Bedroom with serene styling" },
      { src: "/images/courthouse/bathroom.jpg", alt: "Marble-tiled bathroom" },
      { src: "/images/courthouse/peak-view.jpg", alt: "View towards the Peak District" },
      { src: "/images/courthouse/macc-market.jpg", alt: "Macclesfield Market House" },
      { src: "/images/courthouse/macc-forest.jpg", alt: "Walks in Macclesfield Forest" },
      { src: "/images/courthouse/macc-treacle.jpg", alt: "Treacle Market in the town centre" },
    ],
    micrositeUrl: "https://thecourthousemacclesfield.co.uk",
    micrositeLabel: "thecourthousemacclesfield.co.uk",
  },
  {
    slug: "hazelgate",
    name: "Hazelgate",
    eyebrow: "Hazel Grove · Stockport",
    tagline: "A new collection of nineteen one-bedroom apartments",
    type: "Residential",
    status: "For Sale",
    heroImage: "/images/hazelgate/exterior-v4.jpg",
    intro: {
      heading: "A new way of living in Hazel Grove",
      body: [
        "Hazelgate, the transformation of the former Chester House on Chester Road, is an exclusive collection of beautifully designed apartments in the vibrant centre of Hazel Grove. Contemporary architecture meets elegant modern interiors in a refined balance of style, comfort and convenience, with sweeping views towards the Peak District from the upper floors.",
        "Open-plan living areas feel bright and effortlessly stylish, paired with modern kitchens of handleless cabinetry and integrated appliances. Bedrooms are softly carpeted; bathrooms wrap in large-format tiling with wall-hung fittings.",
      ],
      image: "/images/hazelgate/living-kitchen.jpg",
      imageAlt: "Open-plan living and kitchen at Hazelgate",
    },
    stats: [
      { value: "19", label: "Apartments" },
      { value: "4 min", label: "Walk to Hazel Grove station" },
      { value: "13 min", label: "By rail to Manchester Piccadilly" },
    ],
    spec: {
      heading: "Specification",
      description:
        "Considered to the smallest detail: clean, contemporary living finished with high-quality LVT, handleless kitchens, integrated appliances and large-format tiled bathrooms.",
      groups: [
        {
          title: "Kitchen",
          items: [
            "Contemporary designer kitchen",
            "Cabinetry with soft-close doors and drawers",
            "Durable worktops and splashback",
            "Integrated sink with mixer tap",
          ],
        },
        {
          title: "Appliances",
          items: [
            "Integrated oven and electric hob",
            "Extractor hood",
            "Integrated fridge freezer",
            "Integrated dishwasher",
            "Washer / dryer",
          ],
        },
        {
          title: "Bathrooms & En-suites",
          items: [
            "Fully tiled bathrooms and shower areas",
            "Branded sanitary ware",
            "Contemporary WC and basin",
            "Mixer taps and fittings",
            "Thermostatic shower system",
            "Mirror",
          ],
        },
        {
          title: "Flooring",
          items: [
            "LVT flooring to living areas, kitchen and hallways",
            "Soft-pile carpet to bedrooms",
          ],
        },
        {
          title: "Lighting & Electrical",
          items: [
            "Energy-efficient spotlights throughout",
            "Brushed chrome switches and sockets",
          ],
        },
        {
          title: "Technology & General",
          items: [
            "Secure intercom entry system",
            "High-speed broadband ready",
            "Smoke detectors",
            "Double-glazed windows",
            "Energy-efficient heating system",
            "Modern internal doors with brushed chrome ironmongery",
            "Neutral contemporary décor throughout",
          ],
        },
      ],
    },
    floors: {
      heading: "The Apartments",
      description:
        "Nineteen one-bedroom homes across three storeys, from 37 to 56 sq m.",
      schedule: [
        {
          name: "Ground Floor",
          units: [
            { apt: "01", beds: "1 Bed", size: "41 sq m · 441 sq ft" },
            { apt: "02", beds: "1 Bed", size: "37 sq m · 398 sq ft" },
            { apt: "03", beds: "1 Bed", size: "39 sq m · 420 sq ft" },
          ],
        },
        {
          name: "First Floor",
          units: [
            { apt: "04", beds: "1 Bed", size: "56 sq m · 603 sq ft" },
            { apt: "05", beds: "1 Bed", size: "41 sq m · 441 sq ft" },
            { apt: "06", beds: "1 Bed", size: "38 sq m · 409 sq ft" },
            { apt: "07", beds: "1 Bed", size: "39 sq m · 420 sq ft" },
            { apt: "08", beds: "1 Bed", size: "44 sq m · 474 sq ft" },
            { apt: "09", beds: "1 Bed", size: "37 sq m · 398 sq ft" },
            { apt: "10", beds: "1 Bed", size: "37 sq m · 398 sq ft" },
            { apt: "11", beds: "1 Bed", size: "40 sq m · 431 sq ft" },
          ],
        },
        {
          name: "Second Floor",
          units: [
            { apt: "12", beds: "1 Bed", size: "56 sq m · 603 sq ft" },
            { apt: "13", beds: "1 Bed", size: "43 sq m · 463 sq ft" },
            { apt: "14", beds: "1 Bed", size: "38 sq m · 409 sq ft" },
            { apt: "15", beds: "1 Bed", size: "39 sq m · 420 sq ft" },
            { apt: "16", beds: "1 Bed", size: "44 sq m · 474 sq ft" },
            { apt: "17", beds: "1 Bed", size: "37 sq m · 398 sq ft" },
            { apt: "18", beds: "1 Bed", size: "37 sq m · 398 sq ft" },
            { apt: "19", beds: "1 Bed", size: "40 sq m · 431 sq ft" },
          ],
        },
      ],
    },
    floorPlans: [
      { name: "Ground Floor", image: "/images/hazelgate/floor-ground.jpg" },
      { name: "First Floor", image: "/images/hazelgate/floor-first.jpg" },
      { name: "Second Floor", image: "/images/hazelgate/floor-second.jpg" },
    ],
    locationSection: {
      heading: "Stockport, the new Berlin",
      body: [
        "Ideally situated in Hazel Grove, Hazelgate offers excellent connectivity to Stockport town centre, the Peak District and beyond, with the proposed Metrolink expansion as part of the Bee Network set to strengthen the area further.",
        "Stockport is in an exciting period of regeneration, bringing fresh energy, creativity and opportunity. Independent cafés, bars, homes and cultural venues are rapidly transforming the town, which was named by The Sunday Times as the best place to live in the North West in 2024.",
      ],
      distances: [
        { value: "3 mi", label: "Stockport town centre" },
        { value: "£1bn", label: "Town centre regeneration programme" },
        { value: "410 acres", label: "Of town centre redevelopment" },
        { value: "8,000", label: "New homes planned over 15 years" },
        { value: "£56.3m", label: "Good Growth Fund allocation" },
        { value: "110 min", label: "Stockport to London by rail" },
      ],
    },
    address: "Hazelgate, London Road, Hazel Grove, Stockport",
    gallery: [
      { src: "/images/hazelgate/bedroom.jpg", alt: "Modern bedroom" },
      { src: "/images/hazelgate/bathroom.jpg", alt: "Contemporary bathroom" },
      { src: "/images/hazelgate/spec-kitchen-cgi.jpg", alt: "Designer kitchen" },
      { src: "/images/hazelgate/stockport-weir-mill.jpg", alt: "Weir Mill, Stockport" },
      { src: "/images/hazelgate/stockport-exchange.jpg", alt: "Stockport Exchange" },
      { src: "/images/hazelgate/stockport-foodie-friday.jpg", alt: "Foodie Friday, Stockport" },
    ],
    micrositeUrl: "https://hazelgate.co.uk",
    micrositeLabel: "hazelgate.co.uk",
  },
  {
    slug: "barrington-house",
    name: "Barrington House",
    eyebrow: "Altrincham · Residential Living",
    tagline: "Refined living in the heart of Altrincham",
    type: "Residential",
    status: "To Let",
    heroImage: "/images/barrington/hero.jpg",
    heroPosition: "center 32%",
    intro: {
      heading: "A new standard of living",
      body: [
        "Barrington House is a collection of thoughtfully designed residences in the heart of Altrincham. Conceived as a quiet counterpoint to the noise of new-build, it pairs architectural restraint with the warmth and texture of its market-town setting.",
        "Every apartment is shaped around how you actually live: generous proportions, considered light, and a material palette of brushed bronze, smoked oak and natural stone.",
      ],
      image: "/images/barrington/interior-spec.jpg",
      imageAlt: "Considered interior at Barrington House",
    },
    stats: [
      { value: "3", label: "Residence types" },
      { value: "10 min", label: "Walk to Altrincham Metrolink" },
      { value: "30 min", label: "To Manchester by tram" },
    ],
    features: {
      heading: "Built around the way you live",
      description:
        "Spaces designed for stillness and substance: natural materials, restrained palettes and refined detail throughout, framed by landscaped communal areas.",
      items: [
        "Italian-sourced kitchens",
        "Integrated Bosch appliances",
        "Porcelain-tiled bathrooms",
        "Landscaped communal areas",
        "CCTV & security cameras",
        "Wi-Fi included",
      ],
    },
    residences: {
      heading: "The Residences",
      description:
        "Three distinct ways of living, each designed with the same uncompromising attention to material and proportion.",
      items: [
        {
          name: "En-suite Rooms",
          size: "Furnished · Bills included",
          floor: "Ground floor to 2nd",
          status: "From £995 pcm",
          image: "/images/barrington/ensuite.jpg",
        },
        {
          name: "One Bedroom",
          size: "Two-storey mezzanine",
          floor: "Penthouse top floor",
          status: "£1,250 pcm · To Let",
          image: "/images/barrington/one-bed.jpg",
        },
        {
          name: "Two Bedroom",
          size: "894 sq ft",
          floor: "Basement flat with full windows",
          status: "Available",
          image: "/images/barrington/two-bed.jpg",
        },
      ],
    },
    locationSection: {
      heading: "Connected. Vibrant. Refined.",
      body: [
        "An award-winning market town with excellent transport links into Manchester city centre, tree-lined streets, independent restaurants and considered boutiques. Barrington House sits in the quietest pocket of it.",
        "We keep a companion site of Altrincham living stories: the places, people and everyday routines that make the town what it is.",
      ],
      distances: [
        { value: "30 min", label: "Manchester city centre (tram)" },
        { value: "10 min", label: "Walk to Altrincham Metrolink" },
        { value: "12 min", label: "Walk to Altrincham Market" },
        { value: "15 min", label: "Manchester Airport (car)" },
      ],
      link: {
        label: "Explore Altrincham living stories",
        href: "https://altrincham-living-stories.lovable.app",
      },
    },
    address: "Barrington House, Barrington Road, Altrincham",
    gallery: [
      {
        src: "/images/barrington/one-bed.jpg",
        alt: "Open-plan kitchen and living space with the stair to the mezzanine above",
      },
      {
        src: "/images/barrington/two-bed.jpg",
        alt: "Kitchen with island and marble-tiled floor in the two-bedroom apartment",
      },
      {
        src: "/images/barrington/ensuite.jpg",
        alt: "Furnished en-suite room with a desk and the shower room beyond",
      },
      {
        src: "/images/barrington/gallery-5.jpg",
        alt: "En-suite room with a bay window over the street",
      },
      {
        src: "/images/barrington/gallery-6.jpg",
        alt: "Desk, shelving and shower room in an en-suite room",
      },
      {
        src: "/images/barrington/gallery-1.jpg",
        alt: "Mezzanine living space beneath the arched dormer window",
      },
      {
        src: "/images/barrington/gallery-2.jpg",
        alt: "Top-floor living space with an oak stair and arched window",
      },
      {
        src: "/images/barrington/gallery-4.jpg",
        alt: "Porcelain-tiled bathroom with bath and shower screen",
      },
      {
        src: "/images/barrington/exterior-dusk.jpg",
        alt: "Barrington House exterior at dusk",
      },
      {
        src: "/images/barrington/altrincham.jpg",
        alt: "Altrincham town centre",
      },
    ],
    agents: [
      {
        name: "Gallacom",
        detail: "Appointed letting agent · Altrincham",
        label: "Letting Agent",
      },
    ],
    listings: [
      {
        label: "En-suite Rooms",
        detail: "From £995 pcm · Bills included · Listed via SpareRoom",
        href: "https://www.spareroom.co.uk/flatshare/greater_manchester/altrincham/18161546",
      },
      {
        label: "One Bedroom",
        detail: "£1,250 pcm · To Let · Listed via Rightmove",
        href: "https://www.rightmove.co.uk/properties/89035545#/?channel=RES_LET",
      },
    ],
    micrositeUrl: "https://barringtonhouse.co.uk",
    micrositeLabel: "barringtonhouse.co.uk",
  },
  {
    slug: "22-st-john",
    name: "22 St John",
    eyebrow: "Deansgate · Manchester",
    tagline: "Sophisticated workspace in Manchester",
    type: "Commercial",
    status: "Workspace (To Let)",
    heroImage: "/images/22stjohn/building.jpg",
    heroPosition: "center 75%",
    intro: {
      heading: "Welcome to St John Street",
      body: [
        "22 St John Street is a stunning Grade II listed building, located on the only surviving Georgian terraced street in central Manchester. Nestled between Deansgate and Spinningfields, it is the perfect location for your business.",
        "Elegantly restyled while retaining the heritage of the historic building, the property has been fully remodelled to provide 13 private office suites for the city's thriving business community, with a range of communal spaces available over three floors.",
      ],
      image: "/images/22stjohn/offices.jpg",
      imageAlt: "Private offices at 22 St John",
    },
    stats: [
      { value: "13", label: "Private office suites" },
      { value: "3", label: "Floors of workspace" },
      { value: "Grade II", label: "Listed Georgian building" },
    ],
    features: {
      heading: "The Building",
      description:
        "Modern, flexible workspace with offices from 3 people upwards, retaining stunning heritage features while incorporating new spaces so you can work as efficiently as possible.",
      items: [
        "Business lounge",
        "Meeting rooms",
        "Zoom rooms",
        "Breakout space",
        "Original heritage features",
        "Lift access",
        "Fully fitted-out offices",
        "Ultra-fast Wi-Fi",
        "Individual temperature control",
        "Excellent natural daylight",
        "Superior acoustic performance",
        "Biophilic design",
        "Indoor air quality",
        "Cycle storage",
        "Car parking",
        "Shower & changing room",
      ],
    },
    floors: {
      heading: "The Suites",
      unitNoun: "Suite",
      description:
        "Thirteen fully fitted suites over three floors, from three desks upwards, with flexible terms available.",
      schedule: [
        {
          name: "Ground Floor",
          units: [
            {
              apt: "GA",
              beds: "18 desks",
              size: "Design your own space · furniture packages available",
            },
          ],
        },
        {
          name: "First Floor",
          units: [
            { apt: "1A", beds: "6 desks" },
            { apt: "1B", beds: "4 desks" },
            { apt: "1C", beds: "8 desks" },
            { apt: "1D", beds: "11 desks" },
            { apt: "1E", beds: "9 desks" },
            { apt: "1F", beds: "7 desks" },
          ],
        },
        {
          name: "Second Floor",
          units: [
            { apt: "2A", beds: "4 desks" },
            { apt: "2B", beds: "3 desks" },
            { apt: "2C", beds: "17 desks" },
            { apt: "2D", beds: "6 desks" },
            { apt: "2E", beds: "8 desks" },
            { apt: "2F", beds: "12 desks" },
          ],
        },
      ],
    },
    spec: {
      heading: "On every floor",
      description:
        "Each floor of workspace is self-sufficient, pairing fully fitted offices with the meeting, calling and breakout space a team needs through the day.",
      groups: [
        {
          title: "Work",
          items: [
            "Fully fitted offices",
            "1-2-1 room",
            "6-person conference room",
            "2x Zoom rooms",
          ],
        },
        {
          title: "Between Meetings",
          items: [
            "Modern kitchen and dining area",
            "Business lounge",
            "Ground-floor reception",
          ],
        },
        {
          title: "Practical",
          items: ["WC and shower", "Lift access", "Car park"],
        },
      ],
    },
    floorPlans: [
      { name: "Ground Floor", image: "/images/22stjohn/floor-ground.png" },
      { name: "First Floor", image: "/images/22stjohn/floor-first.png" },
      { name: "Second Floor", image: "/images/22stjohn/floor-second.png" },
    ],
    locationSection: {
      heading: "Your neighbourhood",
      body: [
        "Perfectly placed between Deansgate and Spinningfields, with St John's, the Great Northern and the city's best restaurants, gyms and cultural venues on the doorstep, and every station within easy reach.",
        "Soho House, The Ivy, 20 Stories, Hawksmoor and Albert's Schloss are all within a few minutes' walk, with Rudy's, Maray and Federal for more casual days, and Barry's, PureGym and the Everyman close at hand. 22 St John Street, Manchester, M3 4EB.",
      ],
      distances: [
        { value: "3 min", label: "Walk to Spinningfields" },
        { value: "6 min", label: "Walk to St Peter's Square" },
        { value: "8 min", label: "Walk to Market Street" },
        { value: "15 min", label: "Walk to Piccadilly Station" },
        { value: "30 min", label: "Manchester Airport" },
        { value: "160 min", label: "London Euston by train" },
      ],
    },
    gallery: [
      { src: "/images/22stjohn/gallery-1.jpg", alt: "Workspace interior" },
      { src: "/images/22stjohn/gallery-2.jpg", alt: "Office suite" },
      { src: "/images/22stjohn/gallery-3.jpg", alt: "Heritage features" },
      { src: "/images/22stjohn/gallery-4.jpg", alt: "Communal space" },
      { src: "/images/22stjohn/gallery-5.jpg", alt: "Meeting room" },
      { src: "/images/22stjohn/gallery-6.jpg", alt: "Building detail" },
      { src: "/images/22stjohn/dump/photo-01.jpg", alt: "Boardroom with fireplace, dark joinery and wall-mounted screen" },
      { src: "/images/22stjohn/dump/photo-02.jpg", alt: "Post room with brass-numbered mailboxes for every suite" },
      { src: "/images/22stjohn/dump/photo-03.jpg", alt: "Atrium lounge with deep red panelling and tan leather seating" },
      { src: "/images/22stjohn/dump/photo-04.jpg", alt: "Boardroom table with upholstered chairs beneath original sash windows" },
      { src: "/images/22stjohn/dump/photo-05.jpg", alt: "Shared kitchen and bar seating beneath the glazed atrium roof" },
      { src: "/images/22stjohn/dump/photo-06.jpg", alt: "Kitchen bar with pendant lighting and counter stools" },
      { src: "/images/22stjohn/dump/photo-07.jpg", alt: "Kitchenette beside a glazed meeting pod" },
      { src: "/images/22stjohn/dump/photo-08.jpg", alt: "Office suite with herringbone flooring, fireplace and task seating" },
      { src: "/images/22stjohn/dump/photo-09.jpg", alt: "Original staircase with panelled walls and black balustrade" },
      { src: "/images/22stjohn/dump/photo-10.jpg", alt: "Breakout lounge with leather sofa and kitchen beyond" },
      { src: "/images/22stjohn/dump/photo-11.jpg", alt: "Meeting room with oval table and cane-backed chairs" },
      { src: "/images/22stjohn/dump/photo-12.jpg", alt: "Shaker kitchen run with integrated appliances" },
      { src: "/images/22stjohn/dump/photo-13.jpg", alt: "Full-length kitchen with terrazzo splashback and brass fittings" },
      { src: "/images/22stjohn/dump/photo-14.jpg", alt: "Kitchen run with under-cabinet lighting and counter seating" },
      { src: "/images/22stjohn/dump/photo-15.jpg", alt: "Sweeping staircase rising through the listed interior" },
      { src: "/images/22stjohn/dump/photo-16.jpg", alt: "Meeting room with oval table beside original windows" },
      { src: "/images/22stjohn/dump/photo-17.jpg", alt: "Kitchenette detail with brass sockets and styled shelving" },
      { src: "/images/22stjohn/dump/photo-18.jpg", alt: "Reception desk in the red-panelled entrance" },
      { src: "/images/22stjohn/dump/photo-19.jpg", alt: "WC with green tiling and patterned mosaic floor" },
      { src: "/images/22stjohn/dump/photo-20.jpg", alt: "Reception beneath the glazed atrium with planting" },
      { src: "/images/22stjohn/dump/photo-21.jpg", alt: "Office suite with white desking and original sash windows" },
      { src: "/images/22stjohn/dump/photo-22.jpg", alt: "Brass plaque: another development by Satis Group" },
    ],
    address: "22 St John Street, Manchester, M3 4EB",
    agents: [
      {
        name: "Scott Shufflebottom",
        detail: "Sixteen Real Estate · scott@sixteenrealestate.com",
        phone: "07715 683 369",
      },
    ],
    micrositeUrl: "https://www.22stjohn.co.uk",
    micrositeLabel: "22stjohn.co.uk",
  },

  // Legacy/completed developments from satisgroup.co.uk. Details are limited
  // to what the current site lists (name, use, unit count); expand when
  // fuller information and photography are supplied.
  {
    slug: "tabula",
    name: "Tabula",
    eyebrow: "Barnett House · 53 Fountain Street · Manchester",
    tagline: "A contemporary office development at Barnett House",
    type: "Commercial",
    status: "Coming Soon",
    heroImage: "/images/tabula/hero.jpg",
    heroPosition: "center 88%",
    intro: {
      heading: "A workspace built around modern business",
      body: [
        "Tabula is the repositioning of Barnett House at 53 Fountain Street in central Manchester, transforming a previous Regus office into flexible, high-quality workspace.",
        "The scheme reflects our approach to commercial redevelopment: retain the character, upgrade the fabric, and deliver space that modern businesses actually want to occupy.",
      ],
      image: "/images/tabula/hero.jpg",
      imageAlt: "Tabula: the entrance canopy and signage at 53 Fountain Street",
      imagePosition: "center 88%",
    },
    stats: [
      { value: "Office", label: "Use" },
      { value: "53", label: "Fountain Street" },
      { value: "Manchester", label: "City" },
    ],
    micrositeUrl: "/portfolio/tabula",
    micrositeLabel: "Tabula",
  },
  {
    slug: "st-johns-corner",
    name: "St John's Corner",
    eyebrow: "3-5 St John Street · Manchester",
    tagline: "Nine apartments & two penthouse suites",
    type: "Residential",
    status: "Coming Soon",
    heroImage: "/images/stjohnscorner/hero.jpg",
    heroPosition: "center 42%",
    intro: {
      heading: "Eleven homes on a well-connected corner",
      body: [
        "St John's Corner is a residential development of nine apartments and two penthouse suites at 3-5 St John Street, in Manchester's St John's conservation area, a few doors from our workspace scheme at number 22.",
        "Each home will be finished to the standard our buyers and tenants expect: light-filled layouts, quality kitchens and bathrooms, and a specification designed to last.",
      ],
      image: "/images/stjohnscorner/hero.jpg",
      imageAlt: "St John's Corner: the restored corner building with its rooftop storey",
    },
    stats: [
      { value: "9", label: "Apartments" },
      { value: "2", label: "Penthouse suites" },
      { value: "Manchester", label: "City" },
    ],
    micrositeUrl: "/portfolio/st-johns-corner",
    micrositeLabel: "St John's Corner",
  },
  {
    slug: "lancaster-house",
    name: "Lancaster House",
    eyebrow: "London Road · Hazel Grove · Stockport",
    tagline: "Twenty-six apartments",
    type: "Residential",
    status: "Coming Soon",
    heroImage: "/images/lancaster/hero.jpg",
    heroPosition: "center 55%",
    intro: {
      heading: "Twenty-six homes above an active frontage",
      body: [
        "Lancaster House (also known simply as London Road) is a residential conversion of twenty-six apartments being brought forward by Satis Group above an active retail frontage.",
        "Brochure and branding for the scheme are in development, and fuller details will be published here in due course.",
      ],
      image: "/images/lancaster/hero.jpg",
      imageAlt: "Lancaster House on London Road at dusk",
    },
    stats: [
      { value: "26", label: "Apartments" },
      { value: "Coming Soon", label: "Status" },
      { value: "Hazel Grove, Stockport", label: "Location" },
    ],
    micrositeUrl: "/portfolio/lancaster-house",
    micrositeLabel: "Lancaster House",
  },
  {
    slug: "qube",
    name: "QUBE",
    eyebrow: "St Petersgate · Stockport",
    tagline: "Grade A workspace and fifty-eight apartments",
    type: "Mixed Use",
    status: "Mixed Use",
    heroImage: "/images/qube/hero.jpg",
    intro: {
      heading: "Our largest scheme to date",
      body: [
        "QUBE (formerly Petersgate House) is a mixed-use redevelopment of fifty-eight apartments and five floors of Grade A workspace in Stockport town centre.",
        "Qube at Petersgate, the workspace at its heart, is a comprehensive refurbishment of a landmark Stockport building: fully fitted first-floor suites alongside four open Cat A floors, let individually or in combination. Light-filled interiors, exposed soffits and a premium specification create a workplace that supports focus, collaboration and wellbeing in equal measure.",
        "Coming forward as Stockport's regeneration gathers pace, it will bring a significant number of new homes to a town The Sunday Times has named the best place to live in the North West, and place teams at the centre of one of the North's fastest-growing destinations.",
      ],
      image: "/images/qube/workspace-atrium.jpg",
      imageAlt: "Reception and atrium at Qube at Petersgate",
    },
    stats: [
      { value: "58", label: "Apartments" },
      { value: "5", label: "Floors of workspace" },
      { value: "4,155 sqft", label: "Cat A floorplate" },
    ],
    features: {
      heading: "A consistent base build on every floor",
      description:
        "Every floor is delivered to a consistent, high-quality base build, so occupiers can fit out with confidence whichever suite or floorplate they take.",
      items: [
        "24/7 access",
        "Concierge",
        "Fitted kitchen",
        "Air-conditioning",
        "Fibre broadband",
        "Showers",
        "Cycle storage",
        "On-site parking",
        "Sustainable design",
        "EPC rating A (anticipated)",
      ],
    },
    floors: {
      heading: "The Workspace",
      unitNoun: "Suite",
      description:
        "Fitted first-floor suites from Spring 2027, sharing a coworking suite, communal kitchen, meeting rooms and focus pods, with four Cat A floors above available individually or in combination.",
      schedule: [
        {
          name: "First Floor",
          units: [
            { apt: "1.0", beds: "1:6 desk ratio", size: "86 sqm / 926 sqft" },
            { apt: "1.1", beds: "1:6 desk ratio", size: "45 sqm / 484 sqft" },
            { apt: "1.2", beds: "1:5 desk ratio", size: "56 sqm / 603 sqft" },
          ],
        },
        {
          name: "Cat A Floors",
          units: [
            { apt: "2.0", beds: "Open floorplate", size: "386 sqm / 4,155 sqft" },
            { apt: "3.0", beds: "Open floorplate", size: "386 sqm / 4,155 sqft" },
            { apt: "4.0", beds: "Open floorplate", size: "386 sqm / 4,155 sqft" },
            { apt: "5.0", beds: "Open floorplate", size: "386 sqm / 4,155 sqft" },
          ],
        },
      ],
    },
    floorPlans: [
      { name: "First Floor: Cat B workspace", image: "/images/qube/floor-first.jpg" },
      {
        name: "Cat A workspace: second to fifth floors",
        image: "/images/qube/floor-cat-a.jpg",
      },
    ],
    locationSection: {
      heading: "A central hub, exceptionally connected",
      body: [
        "Qube at Petersgate sits in the heart of Stockport, a five-minute walk from the newly redeveloped Stockport Transport Interchange and its direct rail services to Manchester, the North West and London.",
        "Merseyway, the Market Hall and the town's renewed independent quarter are all within a seven-minute walk, with Manchester city centre and Manchester Airport each around 7.2 miles away. St Petersgate, Stockport SK1 1HE.",
      ],
      distances: [
        { value: "8 min", label: "Manchester Piccadilly by rail" },
        { value: "20 min", label: "Manchester Airport by rail" },
        { value: "25 min", label: "Crewe by rail" },
        { value: "55 min", label: "Liverpool Lime Street by rail" },
        { value: "80 min", label: "Birmingham New Street by rail" },
        { value: "115 min", label: "London Euston by rail" },
      ],
    },
    gallery: [
      {
        src: "/images/qube/workspace-atrium.jpg",
        alt: "Reception and atrium beneath a glazed roof with hanging planting",
      },
      {
        src: "/images/qube/workspace-open-plan.jpg",
        alt: "Open-plan workspace with exposed soffits and planted storage runs",
      },
      {
        src: "/images/qube/workspace-coworking.jpg",
        alt: "Coworking space with parquet flooring, booth seating and a central planter",
      },
      {
        src: "/images/qube/workspace-kitchen.jpg",
        alt: "Communal kitchen and breakout area with banquette seating",
      },
      {
        src: "/images/qube/workspace-meeting-room.jpg",
        alt: "Meeting room with a boardroom table, screen and linear pendant",
      },
      {
        src: "/images/qube/workspace-boardroom.jpg",
        alt: "Boardroom seating either side of a planted timber divider",
      },
      {
        src: "/images/qube/building-day.jpg",
        alt: "The existing building on the corner of St Petersgate",
      },
    ],
    address: "St Petersgate, Stockport SK1 1HE",
    agents: [
      {
        name: "Fionnuala McCallion",
        detail:
          "Canning O'Neill · Senior Surveyor · fionnuala@canningoneill.com",
        phone: "0776 520 5652",
        label: "Letting Agent",
      },
      {
        name: "James Dickinson",
        detail: "Canning O'Neill · james@canningoneill.com",
        phone: "07876 654062",
      },
      {
        name: "Michael Blackshaw",
        detail: "MBRE · 0161 850 1111",
        phone: "07792 201467",
      },
    ],
    micrositeUrl: "https://qubeatpetersgate.co.uk",
    micrositeLabel: "qubeatpetersgate.co.uk",
  },
  {
    slug: "springfield-house",
    name: "Springfield House",
    eyebrow: "Ashton-under-Lyne",
    tagline: "Five apartments",
    type: "Residential",
    status: "Coming Soon",
    heroImage: "/images/springfield/hero.jpg",
    heroPosition: "center 58%",
    intro: {
      heading: "A boutique conversion of five homes",
      body: [
        "Springfield House is a boutique residential conversion of five apartments being brought forward by Satis Group.",
        "Smaller schemes like this one let us take particular care over detail, giving each home its own character within a single building.",
      ],
      image: "/images/springfield/hero.jpg",
      imageAlt: "Springfield House at dusk",
    },
    stats: [
      { value: "5", label: "Apartments" },
      { value: "Coming Soon", label: "Status" },
      { value: "Ashton-under-Lyne", label: "Location" },
    ],
    micrositeUrl: "/portfolio/springfield-house",
    micrositeLabel: "Springfield House",
  },
  {
    slug: "woodfield-road",
    name: "Woodfield Road",
    eyebrow: "Woodfield Road · Altrincham",
    tagline: "A mixed-use development",
    type: "Mixed Use",
    status: "Completed",
    heroImage: "/images/woodfield/hero.jpg",
    intro: {
      heading: "A mixed-use development",
      body: [
        "Woodfield Road is a mixed-use development delivered by Satis Group on an Altrincham corner plot: a commercial unit behind a restored shopfront at street level, with homes on the floors above.",
        "The building's Victorian brickwork, canopied bay and stone detailing were retained and repaired, while the interiors were rebuilt to modern standards. Mixed-use projects like this keep a street active through the whole day, and reflect how town centres are changing across the North West.",
      ],
      image: "/images/woodfield/hero.jpg",
      imageAlt: "Woodfield Road: shopfront and homes above, at dusk",
    },
    stats: [
      { value: "Mixed", label: "Use" },
      { value: "Completed", label: "Status" },
      { value: "Altrincham", label: "Location" },
    ],
    micrositeUrl: "https://altrincham-living-stories.lovable.app",
    micrositeLabel: "altrincham-living-stories.lovable.app",
  },
  {
    slug: "the-press",
    name: "The Press",
    eyebrow: "15 Alldis Street · Great Moor · Stockport",
    tagline: "Creative heritage · Contemporary living",
    type: "Residential",
    status: "Coming Soon",
    heroImage: "/images/alldis/hero.jpg",
    intro: {
      heading: "The Press: coming soon to Great Moor",
      body: [
        "The Press is a forthcoming Satis Group residential development at 15 Alldis Street in Great Moor, Stockport: creative heritage, contemporary living.",
        "Plans, specification and availability will be published here as the scheme progresses. Register your interest with the team to be kept informed.",
      ],
      image: "/images/alldis/hero.jpg",
      imageAlt: "The Press, 15 Alldis Street, Great Moor",
    },
    stats: [
      { value: "Residential", label: "Use" },
      { value: "Coming soon", label: "Status" },
      { value: "Stockport", label: "Location" },
    ],
    micrositeUrl: "/portfolio/the-press",
    micrositeLabel: "The Press",
  },
  {
    slug: "davenport-park",
    name: "Davenport Park",
    eyebrow: "Davenport · Stockport",
    tagline: "A completed residential development",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/davenport/hero.jpg",
    heroPosition: "center 55%",
    intro: {
      heading: "Homes beside Davenport station",
      body: [
        "Davenport Park is a completed Satis Group residential development beside Davenport station, with direct rail links into Manchester Piccadilly.",
        "The scheme reflects our approach across Stockport: well-connected locations, quality specification and homes designed for how people actually live.",
      ],
      image: "/images/davenport/hero.jpg",
      imageAlt: "Davenport Park at dusk",
    },
    stats: [
      { value: "Residential", label: "Use" },
      { value: "Completed", label: "Status" },
      { value: "Stockport", label: "Location" },
    ],
    micrositeUrl: "/portfolio/davenport-park",
    micrositeLabel: "Davenport Park",
  },
  {
    slug: "southbank",
    name: "Southbank",
    eyebrow: "Altrincham",
    tagline: "A terrace of contemporary townhouses",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/southbank/hero.jpg",
    intro: {
      heading: "A terrace of contemporary townhouses",
      body: [
        "Southbank is a completed residential development delivered by Satis Group: a terrace of contemporary townhouses in warm red brick, each with its own front door, private frontage and generous glazing across three storeys.",
        "The scheme shows how new-build can sit comfortably in an established streetscape: traditional materials and a rhythmic gabled roofline, paired with the layouts and efficiency buyers expect today.",
      ],
      image: "/images/southbank/hero.jpg",
      imageAlt: "Southbank townhouses at dusk",
    },
    stats: [
      { value: "Residential", label: "Use" },
      { value: "Completed", label: "Status" },
      { value: "Altrincham", label: "Location" },
    ],
    micrositeUrl: "/portfolio/southbank",
    micrositeLabel: "Southbank",
  },
  {
    slug: "meyer-street",
    name: "Meyer Street",
    eyebrow: "Meyer Street · Stockport",
    tagline: "A light residential conversion to three HMOs",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/meyer/hero-v2.jpg",
    intro: {
      heading: "Fourteen en-suite rooms behind a restored facade",
      body: [
        "Meyer Street is a light residential conversion in Stockport, delivered by Satis Group as three houses in multiple occupation: one four-bedroom and two five-bedroom homes, every bedroom with its own en-suite.",
        "The building's arched windows, gabled roofline and rendered elevations were repaired and repainted rather than replaced, while the interiors were rebuilt to a contemporary standard throughout, and a shared roof terrace added above.",
      ],
      image: "/images/meyer/living.jpg",
      imageAlt: "Open-plan living space at Meyer Street",
    },
    stats: [
      { value: "3", label: "HMOs delivered" },
      { value: "14", label: "En-suite bedrooms" },
      { value: "Stockport", label: "Location" },
    ],
    features: {
      heading: "What the conversion delivered",
      description:
        "Three self-contained homes, each let by the room, with a specification aimed at long tenancies.",
      items: [
        "1 × four-bedroom HMO",
        "2 × five-bedroom HMO",
        "En-suite to every bedroom",
        "Shared roof terrace",
        "Fitted kitchens with integrated appliances",
        "Restored arched windows",
        "Repaired and repainted render",
        "Contemporary interiors throughout",
      ],
    },
    gallery: [
      { src: "/images/meyer/exterior-detail.jpg", alt: "Meyer Street: gabled elevation and arched window" },
      { src: "/images/meyer/terrace.jpg", alt: "Shared roof terrace with seating" },
      { src: "/images/meyer/kitchen.jpg", alt: "Fitted kitchen and dining area" },
      { src: "/images/meyer/bedroom.jpg", alt: "En-suite bedroom" },
      { src: "/images/meyer/living.jpg", alt: "Open-plan living space" },
    ],
    address: "Meyer Street, Stockport",
    micrositeUrl: "/portfolio/meyer-street",
    micrositeLabel: "Meyer Street",
  },
];


export function getPropertyPage(slug: string): PropertyPageData | undefined {
  return PROPERTY_PAGES.find((property) => property.slug === slug);
}
