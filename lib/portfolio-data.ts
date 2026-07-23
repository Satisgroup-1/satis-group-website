export type PropertyType = "Residential" | "Commercial";

export type Property = {
  slug: string;
  name: string;
  location: string;
  type: PropertyType;
  status: string;
  image: string;
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
    blurb:
      "A Grade II listed Georgian building between Deansgate and Spinningfields, remodelled into 13 private office suites.",
  },
  {
    slug: "petersgate-house",
    name: "Petersgate House",
    location: "Stockport",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/petersgate-house.jpg",
    blurb:
      "Our largest scheme to date: fifty-eight apartments and two commercial units in Stockport town centre.",
  },
  {
    slug: "lancaster-house",
    name: "Lancaster House",
    location: "North West",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/lancaster-house.jpg",
    blurb:
      "A residential conversion of twenty-six apartments, delivered with individual attention to every home.",
  },
  {
    slug: "st-johns-corner",
    name: "St John's Corner",
    location: "North West",
    type: "Residential",
    status: "Completed",
    image: "/images/legacy/st-johns-corner.jpg",
    blurb:
      "Eleven apartments on a well-connected corner, finished to the standard our buyers expect.",
  },
  {
    slug: "tabula",
    name: "Tabula",
    location: "North West",
    type: "Commercial",
    status: "Completed",
    image: "/images/legacy/tabula.jpg",
    blurb:
      "A contemporary office development: character retained, fabric upgraded, workspace businesses want.",
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
];
