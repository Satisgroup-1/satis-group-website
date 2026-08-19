export const CONTACT_TOPICS = [
  "General enquiry",
  "Property enquiry",
  "Investment",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
