/** The contact form's topics, shared by the form, its query-string default
    and the server action that validates a submission. */
export const CONTACT_TOPICS = [
  "General enquiry",
  "Property enquiry",
  "Investment",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];
