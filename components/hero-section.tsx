"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="mb-16 mt-8">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div className="flex flex-col justify-center items-start">
          <div className="mb-4 inline-block rounded-lg border-4 border-black bg-[#FFECDB] px-3 py-1 text-sm font-bold">
            BUILD IN PUBLIC
          </div>
          <h1 className="mb-4 font-sans text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Building tools and apps,{" "}
            <span className="text-[#FF9149]">one commit at a time</span>
          </h1>
          <p className="mb-6 font-serif text-lg">
            Creating frameworks, apps, and ideas from the ground up. Follow my
            journey as I ship projects, share learnings, and build everything
            from scratch.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="rounded-none border-4 border-black bg-[#60B5FF] px-6 py-3 text-lg font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => {
                document
                  .getElementById("recent-posts")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Read the Blog
            </Button>
            <Button
              onClick={() => router.push("/about")}
              className="rounded-none border-4 border-black bg-white px-6 py-3 text-lg font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              About Me
            </Button>
          </div>
        </div>

        {/* SVG Illustration */}
        <div className="relative order-first md:order-last">
          <svg
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Background circle */}
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="#AFDDFF"
              stroke="#000"
              strokeWidth="6"
            />

            {/* Code editor window */}
            <rect
              x="120"
              y="140"
              width="260"
              height="220"
              fill="#fff"
              stroke="#000"
              strokeWidth="6"
            />

            {/* Window header */}
            <rect
              x="120"
              y="140"
              width="260"
              height="40"
              fill="#60B5FF"
              stroke="#000"
              strokeWidth="6"
            />
            <circle
              cx="145"
              cy="160"
              r="6"
              fill="#FF9149"
              stroke="#000"
              strokeWidth="2"
            />
            <circle
              cx="170"
              cy="160"
              r="6"
              fill="#FFECDB"
              stroke="#000"
              strokeWidth="2"
            />
            <circle
              cx="195"
              cy="160"
              r="6"
              fill="#E0FFF1"
              stroke="#000"
              strokeWidth="2"
            />

            {/* Code lines */}
            <rect x="140" y="200" width="120" height="8" fill="#000" />
            <rect x="140" y="220" width="180" height="8" fill="#000" />
            <rect x="160" y="240" width="140" height="8" fill="#FF9149" />
            <rect x="160" y="260" width="100" height="8" fill="#60B5FF" />
            <rect x="140" y="280" width="160" height="8" fill="#000" />
            <rect x="160" y="300" width="120" height="8" fill="#E0FFF1" />
            <rect x="140" y="320" width="80" height="8" fill="#000" />

            {/* Cursor */}
            <rect x="240" y="318" width="3" height="12" fill="#FF9149">
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Floating elements */}
            <g>
              {/* Brackets */}
              <text
                x="80"
                y="120"
                fontSize="60"
                fontWeight="bold"
                fill="#FF9149"
                stroke="#000"
                strokeWidth="2"
              >
                {"</>"}
              </text>

              {/* Git icon */}
              <circle
                cx="400"
                cy="180"
                r="30"
                fill="#FFECDB"
                stroke="#000"
                strokeWidth="4"
              />
              <path
                d="M 385 180 L 395 190 L 415 170"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Terminal symbol */}
              <rect
                x="70"
                y="320"
                width="60"
                height="60"
                fill="#E0FFF1"
                stroke="#000"
                strokeWidth="4"
              />
              <path
                d="M 85 340 L 95 350 L 85 360"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <rect x="105" y="355" width="15" height="4" fill="#000" />

              {/* Rocket */}
              <g>
                <rect
                  x="390"
                  y="300"
                  width="40"
                  height="60"
                  fill="#60B5FF"
                  stroke="#000"
                  strokeWidth="4"
                />
                <polygon
                  points="390,300 410,270 430,300"
                  fill="#FF9149"
                  stroke="#000"
                  strokeWidth="4"
                />
                <circle
                  cx="410"
                  cy="320"
                  r="8"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="2"
                />
                <rect
                  x="385"
                  y="360"
                  width="15"
                  height="25"
                  fill="#FFECDB"
                  stroke="#000"
                  strokeWidth="3"
                />
                <rect
                  x="420"
                  y="360"
                  width="15"
                  height="25"
                  fill="#FFECDB"
                  stroke="#000"
                  strokeWidth="3"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
