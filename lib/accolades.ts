// Awards, press features and judging appointments, from the Satis Group
// marketing folder. "kind" separates competition wins from press features and
// appointments. Summarised on the About page and listed in full on News.

export type Accolade = {
  kind: "Award" | "Recognition";
  title: string;
  detail: string;
  subject: string;
  /**
   * Award logo or judging graphic. `dark` marks artwork whose lettering is
   * white, so it needs the ink panel behind it rather than the page.
   */
  image?: { src: string; alt: string; dark?: boolean };
};

export const ACCOLADES: Accolade[] = [
  {
    kind: "Award",
    title: "Property Week RESI Awards",
    detail: "Rising Star of the Year, 2026",
    subject: "Shaunak Rauniar, The Developers Club",
    image: {
      src: "/images/awards/property-week-resi-awards.png",
      alt: "Property Week RESI Awards",
    },
  },
  {
    kind: "Award",
    title: "UK Property Awards",
    detail: "Best Commercial Renovation & Redevelopment, five star",
    subject: "22 St John, Greater Manchester & United Kingdom",
  },
  {
    kind: "Award",
    title: "North West Homebuilder Awards",
    detail: "Rising Star of the Year",
    subject: "Shiro Rauniar",
    image: {
      src: "/images/awards/north-west-homebuilder-awards.png",
      alt: "North West Homebuilder Awards 2026",
      dark: true,
    },
  },
  {
    kind: "Recognition",
    title: "Your Property Network",
    detail: "Cover feature, Issue 196",
    subject: "22 St John, award-winning refurbishment",
  },
  {
    kind: "Recognition",
    title: "Insider Property Disruptors",
    detail: "Featured: Building the Future",
    subject: "Satis Group",
  },
  {
    kind: "Recognition",
    title: "Property Investors Awards",
    detail: "Official Judge, 2025 and 2026",
    subject: "Shaunak Rauniar",
    image: {
      src: "/images/awards/property-investors-awards-judge-2026.jpg",
      alt: "Property Investors Awards 2026: Shaunak Rauniar, official judge",
    },
  },
];

export const AWARD_COUNT = ACCOLADES.filter(
  (item) => item.kind === "Award"
).length;
