import { Metadata } from "next";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Atharv Dange, a Full Stack Engineer from Pune, India, specializing in MERN/PERN stack and React Native. Discover his journey, projects, and skills.",
  openGraph: {
    title: "About Atharv Dange",
    description:
      "Full Stack Engineer specializing in MERN/PERN stack and React Native. Building frameworks, apps, and ideas from scratch.",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <AboutContent />
      </div>
    </div>
  );
}
