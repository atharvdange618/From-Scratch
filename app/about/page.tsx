import { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About",
  description:
    "I'm Atharv Dange, a Full Stack Engineer from Pune, India, specializing in MERN/PERN stack and React Native. Currently open to new opportunities. Explore my journey, projects, and skills.",
  openGraph: {
    title: "About Me - Atharv Dange",
    description:
      "I'm a Full Stack Engineer specializing in MERN/PERN stack and React Native. Currently open to new opportunities. I build frameworks, apps, and ideas from scratch.",
    type: "profile",
  },
};

export default function AboutPage() {
  redirect("https://www.atharvdangedev.in");
}
