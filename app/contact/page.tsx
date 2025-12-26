import { Metadata } from "next";
import { ContactContent } from "@/components/contact-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Atharv Dange. Have a question, suggestion, or collaboration opportunity? Send a message and let's connect!",
  openGraph: {
    title: "Contact Atharv Dange",
    description:
      "Get in touch for questions, suggestions, or collaboration opportunities.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <ContactContent />
      </div>
    </div>
  );
}
