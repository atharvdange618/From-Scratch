import { Metadata } from "next";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Atharv Dange, a Full Stack Engineer from Pune, India, specializing in MERN/PERN stack and React Native. Explore my journey, projects, and skills.",
  openGraph: {
    title: "About Me - Atharv Dange",
    description:
      "I'm a Full Stack Engineer specializing in MERN/PERN stack and React Native. I build frameworks, apps, and ideas from scratch.",
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
