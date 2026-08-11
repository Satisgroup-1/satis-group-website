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
  };
  gallery?: Array<{ src: string; alt: string }>;
  agent?: {
    name: string;
    detail: string;
    phone?: string;
  };
  listings?: Array<{ label: string; detail: string; href: string }>;
  micrositeUrl: string;
  micrositeLabel: string;
};

export const PROPERTY_PAGES: PropertyPageData[] = [
  {
    slug: "the-courthouse",
    name: "The Courthouse",
    eyebrow: "Macclesfield · Cheshire",
    tagline: "A collection of 13 one & two bedroom apartments",
    type: "Residential",
    status: "For Sale",
    heroImage: "/images/courthouse/hero.jpg",
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
            "Sanitaryware by Villeroy & Boch",
            "Brassware by Grohe",
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
    gallery: [
      { src: "/images/courthouse/bedroom.jpg", alt: "Bedroom with serene styling" },
      { src: "/images/courthouse/bathroom.jpg", alt: "Marble-tiled bathroom" },
      { src: "/images/courthouse/peak-view.jpg", alt: "View towards the Peak District" },
      { src: "/images/courthouse/macc-market.jpg", alt: "Macclesfield Market House" },
      { src: "/images/courthouse/macc-forest.jpg", alt: "Walks in Macclesfield Forest" },
      { src: "/images/courthouse/macc-treacle.jpg", alt: "Treacle Market in the town centre" },
    ],
    agent: {
      name: "Gascoigne Halman",
      detail: "Macclesfield Branch",
      phone: "01625 511367",
    },
    micrositeUrl: "https://thecourthousesatis.lovable.app",
    micrositeLabel: "thecourthousesatis.lovable.app",
  },
  {
    slug: "hazelgate",
    name: "Hazelgate",
    eyebrow: "Hazel Grove · Stockport",
    tagline: "A new collection of nineteen apartments",
    type: "Residential",
    status: "Selling Fast",
    heroImage: "/images/hazelgate/exterior.jpg",
    intro: {
      heading: "A new way of living in Hazel Grove",
      body: [
        "Hazelgate is an exclusive collection of beautifully designed apartments in the vibrant centre of Hazel Grove, blending contemporary architecture with elegant modern interiors in a refined balance of style, comfort and convenience.",
        "Open-plan living areas feel bright and effortlessly stylish, paired with modern kitchens of handleless cabinetry and integrated appliances. Bedrooms are softly carpeted; bathrooms wrap in large-format tiling with wall-hung fittings. Seven of the nineteen apartments are already sold.",
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
            "Thermostatic shower system",
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
            "Double-glazed windows",
            "Energy-efficient heating system",
          ],
        },
      ],
    },
    floors: {
      heading: "The Apartments",
      description:
        "Nineteen homes across three storeys, in a considered mix of one and two-bedroom apartments.",
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
            { apt: "04", beds: "2 Beds", size: "56 sq m · 603 sq ft" },
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
            { apt: "12", beds: "2 Beds", size: "56 sq m · 603 sq ft" },
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
      ],
    },
    gallery: [
      { src: "/images/hazelgate/bedroom.jpg", alt: "Modern bedroom" },
      { src: "/images/hazelgate/bathroom.jpg", alt: "Contemporary bathroom" },
      { src: "/images/hazelgate/spec-kitchen-cgi.jpg", alt: "Designer kitchen" },
      { src: "/images/hazelgate/stockport-weir-mill.jpg", alt: "Weir Mill, Stockport" },
      { src: "/images/hazelgate/stockport-exchange.jpg", alt: "Stockport Exchange" },
      { src: "/images/hazelgate/stockport-foodie-friday.jpg", alt: "Foodie Friday, Stockport" },
    ],
    micrositeUrl: "https://hazelgate.lovable.app",
    micrositeLabel: "hazelgate.lovable.app",
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
      ],
      distances: [
        { value: "30 min", label: "Manchester city centre (tram)" },
        { value: "10 min", label: "Walk to Altrincham Metrolink" },
        { value: "12 min", label: "Walk to Altrincham Market" },
        { value: "15 min", label: "Manchester Airport (car)" },
      ],
    },
    gallery: [
      { src: "/images/barrington/gallery-1.jpg", alt: "Inside Barrington House" },
      { src: "/images/barrington/gallery-2.jpg", alt: "Living space detail" },
      { src: "/images/barrington/gallery-3.jpg", alt: "Interior finish" },
      { src: "/images/barrington/gallery-4.jpg", alt: "Apartment interior" },
      { src: "/images/barrington/gallery-5.jpg", alt: "Bedroom interior" },
      {
        src: "/images/barrington/exterior-dusk.jpg",
        alt: "Barrington House exterior at dusk",
      },
      { src: "/images/barrington/altrincham.jpg", alt: "Altrincham town" },
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
    micrositeUrl: "https://barrington-house.lovable.app",
    micrositeLabel: "barrington-house.lovable.app",
  },
  {
    slug: "22-st-john",
    name: "22 St John",
    eyebrow: "Deansgate · Manchester",
    tagline: "Sophisticated workspace in Manchester",
    type: "Commercial",
    status: "Workspace",
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
        "Temperature control",
        "Excellent natural daylight",
        "Superior acoustic performance",
        "Biophilic design",
        "Cycle storage",
        "Car parking",
        "Showers",
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
    eyebrow: "North West",
    tagline: "A contemporary office development",
    type: "Commercial",
    status: "Completed",
    heroImage: "/images/legacy/tabula.jpg",
    heroPosition: "center 92%",
    intro: {
      heading: "A workspace built around modern business",
      body: [
        "Tabula is a contemporary office development delivered by Satis Group, transforming an underused building into flexible, high-quality workspace.",
        "The scheme reflects our approach to commercial redevelopment: retain the character, upgrade the fabric, and deliver space that modern businesses actually want to occupy.",
      ],
      image: "/images/legacy/tabula-frontage.jpg",
      imageAlt: "Tabula office development frontage and main entrance",
      imagePosition: "center 85%",
    },
    stats: [
      { value: "Office", label: "Use" },
      { value: "Completed", label: "Status" },
      { value: "North West", label: "Region" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
  {
    slug: "st-johns-corner",
    name: "St John's Corner",
    eyebrow: "North West",
    tagline: "Eleven apartments",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/legacy/st-johns-corner.jpg",
    intro: {
      heading: "Eleven homes on a well-connected corner",
      body: [
        "St John's Corner is a residential development of eleven apartments delivered by Satis Group.",
        "Each home was finished to the standard our buyers and tenants expect: light-filled layouts, quality kitchens and bathrooms, and a specification designed to last.",
      ],
      image: "/images/legacy/st-johns-corner.jpg",
      imageAlt: "St John's Corner apartments",
    },
    stats: [
      { value: "11", label: "Apartments" },
      { value: "Completed", label: "Status" },
      { value: "North West", label: "Region" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
  {
    slug: "lancaster-house",
    name: "Lancaster House",
    eyebrow: "North West",
    tagline: "Twenty-six apartments",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/legacy/lancaster-house.jpg",
    intro: {
      heading: "Twenty-six homes from one tired building",
      body: [
        "Lancaster House is a residential conversion of twenty-six apartments delivered by Satis Group.",
        "The project is a good example of the scale we work at: large enough to matter, small enough that every apartment still gets individual attention.",
      ],
      image: "/images/legacy/lancaster-house.jpg",
      imageAlt: "Lancaster House apartments",
    },
    stats: [
      { value: "26", label: "Apartments" },
      { value: "Completed", label: "Status" },
      { value: "North West", label: "Region" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
  {
    slug: "petersgate-house",
    name: "Petersgate House",
    eyebrow: "Stockport",
    tagline: "Fifty-eight apartments and two commercial units",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/legacy/petersgate-house.jpg",
    intro: {
      heading: "Our largest scheme to date",
      body: [
        "Petersgate House is a mixed-use redevelopment of fifty-eight apartments and two commercial units in Stockport town centre.",
        "Delivered as Stockport's regeneration gathered pace, it brought a significant number of new homes to a town The Sunday Times has since named the best place to live in the North West.",
      ],
      image: "/images/legacy/petersgate-house.jpg",
      imageAlt: "Petersgate House, Stockport",
    },
    stats: [
      { value: "58", label: "Apartments" },
      { value: "2", label: "Commercial units" },
      { value: "Stockport", label: "Location" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
  {
    slug: "springfield-house",
    name: "Springfield House",
    eyebrow: "North West",
    tagline: "Five apartments",
    type: "Residential",
    status: "Completed",
    heroImage: "/images/legacy/springfield-house.jpg",
    intro: {
      heading: "A boutique conversion of five homes",
      body: [
        "Springfield House is a boutique residential conversion of five apartments delivered by Satis Group.",
        "Smaller schemes like this one let us take particular care over detail, giving each home its own character within a single building.",
      ],
      image: "/images/legacy/springfield-house.jpg",
      imageAlt: "Springfield House apartments",
    },
    stats: [
      { value: "5", label: "Apartments" },
      { value: "Completed", label: "Status" },
      { value: "North West", label: "Region" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
  {
    slug: "woodfield-road",
    name: "Woodfield Road",
    eyebrow: "North West",
    tagline: "A mixed-use development",
    type: "Commercial",
    status: "Completed",
    heroImage: "/images/legacy/woodfield-road.jpg",
    intro: {
      heading: "Living and working under one roof",
      body: [
        "Woodfield Road is a mixed-use development delivered by Satis Group, combining residential and commercial space in a single scheme.",
        "Mixed-use projects like this keep buildings active through the whole day, and reflect how town centres are changing across the North West.",
      ],
      image: "/images/legacy/woodfield-road.jpg",
      imageAlt: "Woodfield Road mixed-use development",
    },
    stats: [
      { value: "Mixed", label: "Use" },
      { value: "Completed", label: "Status" },
      { value: "North West", label: "Region" },
    ],
    micrositeUrl: "https://www.satisgroup.co.uk/#portfolio",
    micrositeLabel: "satisgroup.co.uk",
  },
];

export function getPropertyPage(slug: string): PropertyPageData | undefined {
  return PROPERTY_PAGES.find((property) => property.slug === slug);
}
