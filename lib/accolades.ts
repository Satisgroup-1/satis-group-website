// Awards, press features and judging appointments, from the Satis Group
// marketing folder. "kind" separates competition wins from press features and
// appointments. Summarised on the About page and listed in full on News.

export type Accolade = {
  kind: "Award" | "Recognition";
  title: string;
  detail: string;
  subject: string;
};

export const ACCOLADES: Accolade[] = [
  {
    kind: "Award",
    title: "UK Property Awards",
    detail: "Best Commercial Renovation & Redevelopment, five star",
    subject: "22 St John — Greater Manchester & United Kingdom",
  },
  {
    kind: "Award",
    title: "North West Homebuilder Awards",
    detail: "Rising Star of the Year",
    subject: "Shiro Rauniar",
  },
  {
    kind: "Recognition",
    title: "Your Property Network",
    detail: "Cover feature, Issue 196",
    subject: "22 St John — award-winning refurbishment",
  },
  {
    kind: "Recognition",
    title: "Insider Property Disruptors",
    detail: "Featured — Building the Future",
    subject: "Satis Group",
  },
  {
    kind: "Recognition",
    title: "Property Investors Awards",
    detail: "Official Judge",
    subject: "Shaunak Rauniar",
  },
];

export const AWARD_COUNT = ACCOLADES.filter(
  (item) => item.kind === "Award"
).length;
