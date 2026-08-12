export type PropertyType = "Residential" | "Commercial";

export type Property = {
  slug: string;
  name: string;
  location: string;
  type: PropertyType;
  status: string;
  image: string;
  // CSS object-position for the 4:3 card crop, for portrait photography that
  // would otherwise centre on a blank stretch of facade. Omit to centre.
  imagePosition?: string;
  // Secondary image revealed on hover (crossfade); omit for a plain zoom.
  hoverImage?: string;
  // Project logo presented over the hero on hover, on its brand background.
  // Takes precedence over hoverImage.
  logo?: { src: string; bg: string };
  blurb: string;
};

// The four live Satis Group developments. Each links through to a detail
// page at /portfolio/[slug], built from lib/property-pages.ts.
export const PORTFOLIO: Property[] = [
  {
    slug: "the-courthouse",
    name: "The Courthouse",
    location: "Macclesfield",
    type: "Residential",
    status: "For Sale",
    image: "/images/courthouse/hero.jpg",
    hoverImage: "/images/courthouse/kitchen.jpg",
    logo: { src: "/images/logos/the-courthouse.png", bg: "#eae5da" },
    blurb:
      "An elegant conversion of the former Macclesfield courthouse: 13 one and two-bedroom apartments in the heart of the market town.",
  },
  {
    slug: "hazelgate",
    name: "Hazelgate",
    location: "Hazel Grove, Stockport",
    type: "Residential",
    status: "Selling Fast",
    image: "/images/hazelgate/exterior.jpg",
    hoverImage: "/images/hazelgate/living-kitchen.jpg",
    logo: { src: "/images/logos/hazelgate.jpg", bg: "#2f3237" },
    blurb:
      "A new collection of nineteen contemporary one and two-bedroom apartments in the vibrant centre of Hazel Grove.",
  },
  {
    slug: "barrington-house",
    name: "Barrington House",
    location: "Altrincham",
    type: "Residential",
    status: "To Let",
    image: "/images/barrington/hero.jpg",
    hoverImage: "/images/barrington/exterior-dusk.jpg",
    logo: { src: "/images/logos/barrington-house.jpg", bg: "#0c0b09" },
    blurb:
      "Thoughtfully designed residences pairing architectural restraint with the warmth of an award-winning market town.",
  },
  {
    slug: "22-st-john",
    name: "22 St John",
    location: "Manchester",
    type: "Commercial",
    status: "Workspace",
    image: "/images/22stjohn/building.jpg",
    imagePosition: "center 70%",
    hoverImage: "/images/22stjohn/gallery-1.jpg",
    logo: { src: "/images/logos/22-st-john.png", bg: "#000000" },
    blurb:
      "A Grade II listed Georgian building between Deansgate and Spinningfields, remodelled into 13 private office suites.",
  },
  {
    slug: "qube",
    name: "QUBE",
    location: "Stockport",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/petersgate-house.jpg",
    logo: { src: "/images/logos/qube.jpg", bg: "#f4efe7" },
    blurb:
      "Our largest scheme to date: fifty-eight apartments and two commercial units in Stockport town centre.",
  },
  {
    slug: "lancaster-house",
    name: "Lancaster House",
    location: "London Road, Manchester",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/lancaster-house.jpg",
    blurb:
      "A residential conversion of twenty-six apartments, delivered with individual attention to every home.",
  },
  {
    slug: "st-johns-corner",
    name: "St John's Corner",
    location: "3-5 St John Street, Manchester",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/st-johns-corner.jpg",
    logo: { src: "/images/logos/st-johns-corner.jpg", bg: "#414747" },
    blurb:
      "Eleven apartments on a well-connected corner, finished to the standard our buyers expect.",
  },
  {
    slug: "tabula",
    name: "Tabula",
    location: "Barnett House, 53 Fountain Street, Manchester",
    type: "Commercial",
    status: "Completed",
    image: "/images/tabula/hero.jpg",
    imagePosition: "center 30%",
    logo: { src: "/images/logos/tabula.jpg", bg: "#0a0a0a" },
    blurb:
      "The repositioning of Barnett House on Fountain Street: character retained, fabric upgraded, workspace businesses want.",
  },
  {
    slug: "springfield-house",
    name: "Springfield House",
    location: "North West",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/springfield-house.jpg",
    blurb:
      "A boutique conversion of five apartments, each with its own character within a single building.",
  },
  {
    slug: "woodfield-road",
    name: "Woodfield Road",
    location: "North West",
    type: "Commercial",
    status: "Completed",
    image: "/images/legacy/woodfield-road.jpg",
    blurb:
      "A mixed-use development combining residential and commercial space in a single scheme.",
  },
  {
    slug: "the-press",
    name: "The Press",
    location: "15 Alldis Street, Great Moor, Stockport",
    type: "Residential",
    status: "Coming Soon",
    image: "/images/alldis/hero.jpg",
    logo: { src: "/images/logos/the-press.jpg", bg: "#f2ebe1" },
    blurb:
      "Creative heritage, contemporary living: a forthcoming residential development at 15 Alldis Street, Great Moor.",
  },
  {
    slug: "davenport-park",
    name: "Davenport Park",
    location: "Davenport, Stockport",
    type: "Residential",
    status: "Completed",
    image: "/images/pipeline/davenport-park.jpg",
    blurb:
      "A completed residential development beside Davenport station, with direct rail links into Manchester Piccadilly.",
  },
  {
    slug: "southbank",
    name: "Southbank",
    location: "North West",
    type: "Residential",
    status: "Completed",
    image: "/images/pipeline/southbank.jpg",
    blurb:
      "A completed Satis residential development. Photography and scheme detail to follow.",
  },
  {
    slug: "mayor-street",
    name: "Mayor Street",
    location: "North West",
    type: "Residential",
    status: "Coming Soon",
    image: "/images/pipeline/mayor-street.jpg",
    blurb:
      "A new Satis development currently in preparation. Imagery and details to follow.",
  },
];
