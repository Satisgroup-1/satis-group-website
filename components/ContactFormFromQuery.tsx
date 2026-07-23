"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CONTACT_TOPICS,
  ContactForm,
  type ContactTopic,
} from "./ContactForm";

function InnerForm() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("topic");
  const initialTopic = CONTACT_TOPICS.includes(requested as ContactTopic)
    ? (requested as ContactTopic)
    : "General enquiry";
  return <ContactForm initialTopic={initialTopic} />;
}

export function ContactFormFromQuery() {
  return (
    <Suspense fallback={<ContactForm />}>
      <InnerForm />
    </Suspense>
  );
}
