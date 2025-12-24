"use client";

import { Code, Rocket, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Building Reiatsu: A Zero-Dependency TypeScript Framework",
    date: "December 20, 2024",
    preview:
      "Creating a web framework from scratch taught me invaluable lessons about HTTP, routing, and the fundamentals of web development...",
    tags: ["Reiatsu", "TypeScript", "Frameworks"],
    category: "Active Projects",
    icon: <Code className="h-full w-full" />,
    iconBg: "#AFDDFF",
    slug: "building-reiatsu-framework",
  },
  {
    id: 2,
    title: "Telemetry: Privacy-First Analytics Platform",
    date: "December 15, 2024",
    preview:
      "Why I decided to build my own analytics solution and how I'm approaching privacy-first data collection...",
    tags: ["Telemetry", "Analytics", "Privacy"],
    category: "Active Projects",
    icon: <Rocket className="h-full w-full" />,
    iconBg: "#FFECDB",
    slug: "telemetry-privacy-analytics",
  },
  {
    id: 3,
    title: "Minty: Smart Expense Tracking for Modern Life",
    date: "December 10, 2024",
    preview:
      "Building a mobile-first expense tracker with React Native and learning about financial data management...",
    tags: ["Minty", "React Native", "Mobile"],
    category: "Active Projects",
    icon: <Lightbulb className="h-full w-full" />,
    iconBg: "#E0FFF1",
    slug: "minty-expense-tracker",
  },
  {
    id: 4,
    title: "Learning TypeScript Type System Deep Dive",
    date: "December 5, 2024",
    preview:
      "Exploring advanced TypeScript features: conditional types, mapped types, and how they power Reiatsu's type safety...",
    tags: ["TypeScript", "Learning"],
    category: "Learning Notes",
    icon: <BookOpen className="h-full w-full" />,
    iconBg: "#AFDDFF",
    slug: "typescript-deep-dive",
  },
  {
    id: 5,
    title: "Recon Update: QA Intelligence System Progress",
    date: "November 28, 2024",
    preview:
      "Major milestone reached! Recon now tracks bug patterns and provides actionable insights for QA teams...",
    tags: ["Recon", "Updates", "Backend"],
    category: "Updates",
    icon: <Rocket className="h-full w-full" />,
    iconBg: "#FFECDB",
    slug: "recon-qa-progress-update",
  },
  {
    id: 6,
    title: "From Junior to Professional: My Coding Journey",
    date: "November 20, 2024",
    preview:
      "Reflecting on my journey from starting to code in January 2021 to becoming a professional developer in March 2024...",
    tags: ["Career", "Journey"],
    category: "Learning Notes",
    icon: <Lightbulb className="h-full w-full" />,
    iconBg: "#AFDDFF",
    slug: "coding-journey-reflection",
  },
];

export function BlogEntries() {
  return (
    <section className="mb-16" id="recent-posts">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-sans text-3xl font-bold">Recent Posts</h2>
        <Button className="rounded-none border-4 border-black bg-white px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          View All Posts
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <CardHeader className="border-b-4 border-black bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-full border-2 border-black p-2"
                  style={{ backgroundColor: post.iconBg }}
                >
                  {post.icon}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold">{post.date}</span>
                  <div className="mt-1">
                    <span className="inline-block rounded-lg border-2 border-black bg-[#FFECDB] px-2 py-0.5 text-xs font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl font-bold leading-tight">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 px-4 pt-4 pb-0">
              <p className="mb-3 font-serif text-sm leading-relaxed">
                {post.preview}
              </p>
              <div className="flex flex-wrap gap-2 pb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-1 text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="mt-auto border-t-4 border-black bg-[#AFDDFF] p-4">
              <Button className="w-full rounded-none border-4 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty state SVG illustration when no posts */}
      {blogPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-none border-4 border-dashed border-black bg-[#AFDDFF] p-16">
          <svg
            className="mb-6 h-48 w-48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="60"
              width="120"
              height="100"
              fill="#60B5FF"
              stroke="#000"
              strokeWidth="4"
            />
            <rect x="60" y="80" width="80" height="8" fill="#000" />
            <rect x="60" y="100" width="60" height="8" fill="#000" />
            <rect x="60" y="120" width="70" height="8" fill="#000" />
            <circle
              cx="100"
              cy="40"
              r="20"
              fill="#FF9149"
              stroke="#000"
              strokeWidth="4"
            />
            <path
              d="M90 35 L95 40 L110 25"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mb-2 text-2xl font-bold">No Posts Yet</h3>
          <p className="font-serif text-lg">
            Start building in public and share your journey!
          </p>
        </div>
      )}
    </section>
  );
}
