import { Metadata } from "next";
import { ProjectsContent } from "@/components/projects-content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore a collection of full-stack projects and applications built from scratch using modern web technologies. Browse through active developments, completed projects, and open-source software built with React, Next.js, TypeScript, Node.js, MongoDB, and more.",
  keywords: [
    "software projects",
    "full stack projects",
    "web development portfolio",
    "react projects",
    "next.js applications",
    "typescript projects",
    "node.js projects",
    "mongodb applications",
    "open source projects",
    "developer portfolio",
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
      "A collection of full-stack projects and applications built from scratch, exploring different technologies and solving real-world problems.",
    url: "/projects",
    siteName: "From Scratch",
    type: "website",
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Projects&description=Built%20from%20scratch%20with%20modern%20tech&type=page`,
        width: 1200,
        height: 630,
        alt: "From Scratch Projects - Full Stack Development Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - From Scratch",
    description:
      "A collection of full-stack projects built from scratch with modern technologies.",
    creator: "@atharvdangedev",
    images: [
      `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Projects&description=Built%20from%20scratch%20with%20modern%20tech&type=page`,
    ],
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
