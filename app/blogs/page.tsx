import { Metadata } from "next";
import { Suspense } from "react";
import { BlogsContent } from "@/components/blogs-content";
import { env } from "@/lib/env";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep dives into web development, full-stack projects, technical tutorials, and reflections on building tools and applications from scratch. Explore articles on TypeScript, React, Next.js, Node.js, MongoDB, and software engineering best practices.",
  keywords: [
    "web development blog",
    "full stack development",
    "typescript tutorials",
    "react tutorials",
    "next.js",
    "mongodb",
    "node.js",
    "software engineering",
    "technical blog",
    "programming tutorials",
    "build in public",
    "developer blog",
    "coding tutorials",
    "Atharv Dange blog",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Blog - From Scratch",
    description:
      "Deep dives into web development, full-stack projects, technical tutorials, and reflections on building from scratch.",
    url: "/blogs",
    siteName: "From Scratch",
    type: "website",
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Blog&description=Deep%20dives%20into%20projects%20and%20tutorials&type=page`,
        width: 1200,
        height: 630,
        alt: "From Scratch Blog - Technical Tutorials and Developer Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - From Scratch",
    description:
      "Deep dives into web development, full-stack projects, and technical tutorials.",
    creator: "@atharvdangedev",
    images: [
      `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=Blog&description=Deep%20dives%20into%20projects%20and%20tutorials&type=page`,
    ],
  },
};

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-black dark:border-white border-t-transparent"></div>
            <p className="font-bold">Loading blogs...</p>
          </div>
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}
