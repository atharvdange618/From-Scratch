import { Metadata } from "next";
import { ProjectsContent } from "@/components/projects-content";
import { env } from "@/lib/env";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "In-depth explorations of the projects I've built - from architecture decisions and trade-offs to lessons learned along the way.",
  keywords: [
    "software projects",
    "case studies",
    "web development",
    "react projects",
    "next.js applications",
    "typescript projects",
    "node.js projects",
    "full stack development",
    "open source",
    "coding projects",
    "tech stack",
    "Atharv Dange projects",
  ],
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects - From Scratch",
    description:
      "In-depth explorations of the projects I've built - architecture decisions, trade-offs, and lessons learned.",
    url: "/projects",
    siteName: "From Scratch",
    type: "website",
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Projects&description=Built%20from%20scratch%20with%20modern%20tech&type=page`,
        width: 1200,
        height: 630,
        alt: "From Scratch Projects - Build Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - From Scratch",
    description:
      "In-depth explorations of the projects I've built - architecture decisions, trade-offs, and lessons learned.",
    creator: "@atharvdangedev",
    images: [
      `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Projects&description=Built%20from%20scratch%20with%20modern%20tech&type=page`,
    ],
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
