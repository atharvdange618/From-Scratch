import { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { LandingBento } from "@/components/landing-bento";
import { env } from "@/lib/env";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "From Scratch - Building Tools, Apps & Ideas | Atharv Dange",
  description:
    "Welcome to From Scratch - Follow Atharv Dange's journey of building frameworks, full-stack web applications, and innovative tools from the ground up. Explore projects built with React, Next.js, TypeScript, Node.js, MongoDB and more. Developer blog, tutorials, and build-in-public journey.",
  keywords: [
    "Atharv Dange",
    "from scratch",
    "build in public",
    "Full Stack Engineer",
    "web development",
    "react developer",
    "next.js developer",
    "typescript",
    "node.js",
    "mongodb",
    "MERN stack",
    "PERN stack",
    "software engineer",
    "developer portfolio",
    "tech blog",
    "coding tutorials",
    "open source",
    "indie hacker",
    "side projects",
    "web apps",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "From Scratch - Building Tools, Apps & Ideas | Atharv Dange",
    description:
      "Follow the journey of building frameworks, apps, and ideas from the ground up. Full-stack projects, technical blogs, and developer insights.",
    url: "/",
    siteName: "From Scratch",
    type: "website",
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=From%20Scratch&description=Building%20tools%20and%20apps,%20one%20commit%20at%20a%20time&type=page`,
        width: 1200,
        height: 630,
        alt: "From Scratch - Building in Public by Atharv Dange",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "From Scratch - Building Tools, Apps & Ideas",
    description:
      "Follow the journey of building frameworks, apps, and ideas from the ground up.",
    creator: "@atharvdangedev",
    images: [
      `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=From%20Scratch&description=Building%20tools%20and%20apps,%20one%20commit%20at%20a%20time&type=page`,
    ],
  },
  authors: [{ name: "Atharv Dange", url: "https://atharvdangedev.in" }],
  creator: "Atharv Dange",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "From Scratch",
  description:
    "Building frameworks, apps, and ideas from the ground up. Full-stack development, technical blogs, and build-in-public journey.",
  url: env.NEXT_PUBLIC_BASE_URL,
  author: {
    "@type": "Person",
    name: "Atharv Dange",
    url: "https://atharvdangedev.in",
    jobTitle: "Full Stack Engineer",
    sameAs: [
      "https://github.com/atharvdange618",
      "https://twitter.com/atharvdangedev",
      "https://www.linkedin.com/in/atharvdange",
    ],
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${env.NEXT_PUBLIC_BASE_URL}/blogs?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        id="home-jsonld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-[100dvh] bg-background dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <HeroSection />
          <LandingBento />
        </div>
      </div>
    </>
  );
}
