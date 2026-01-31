"use client";

import { BookOpen, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStatsQuery } from "@/lib/hooks/use-stats";

export function HeroSection() {
  const router = useRouter();
  const { data, isLoading, isError } = useStatsQuery();

  const projectCount = isError ? "5+" : isLoading ? "..." : data?.projects ?? "0";
  const postCount = isError ? "12+" : isLoading ? "..." : data?.posts ?? "0";

  return (
    <section className="mb-12 mt-4 md:mb-16 md:mt-8">
      <div className="grid gap-6 md:gap-8 md:grid-cols-12">
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-primary px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,145,73,0.3)]">
                <span className="text-sm md:text-base font-bold dark:text-black">
                  FULL STACK ENGINEER
                </span>
              </div>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] dark:text-white">
              Ship fast.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Build better.</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-[#60B5FF] dark:bg-primary -rotate-1 -z-0"></span>
              </span>
            </h1>

            <div className="border-l-8 border-[#E0FFF1] dark:border-secondary pl-4 md:pl-6">
              <p className="font-serif text-lg md:text-xl lg:text-2xl dark:text-gray-300 leading-relaxed">
                I turn ideas into products. From concept to deployment, building
                with modern tools and sharing everything I learn along the way.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
              <div className="border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,236,219,0.2)]">
                <div className="text-2xl md:text-3xl font-black dark:text-white">
                  {projectCount}
                </div>
                <div className="text-xs md:text-sm font-bold mt-1 dark:text-gray-300">
                  PROJECTS
                </div>
              </div>
              <div className="border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(224,255,241,0.2)]">
                <div className="text-2xl md:text-3xl font-black dark:text-white">
                  {postCount}
                </div>
                <div className="text-xs md:text-sm font-bold mt-1 dark:text-gray-300">
                  ARTICLES
                </div>
              </div>
              <div className="border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-800 p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(175,221,255,0.2)]">
                <div className="text-2xl md:text-3xl font-black dark:text-white">
                  24/7
                </div>
                <div className="text-xs md:text-sm font-bold mt-1 dark:text-gray-300">
                  BUILDING
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
              <Button
                className="rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-primary px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-black dark:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,145,73,0.3)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,145,73,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,145,73,0.3)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(255,145,73,0.3)]"
                onClick={() => {
                  document
                    .getElementById("recent-posts")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                READ THE BLOG
              </Button>
              <Button
                onClick={() => router.push("/about")}
                className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-black dark:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)] md:dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#E0FFF1] dark:hover:bg-gray-700 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(96,181,255,0.3)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
              >
                ABOUT ME
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="relative">
              <div className="absolute -rotate-6 top-4 left-4 w-full h-72 md:h-80 border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(175,221,255,0.2)]"></div>

              <div className="absolute rotate-3 top-2 left-2 w-full h-72 md:h-80 border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,236,219,0.2)]"></div>

              <div className="relative w-full h-72 md:h-80 border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(96,181,255,0.3)] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 rounded-full bg-[#FF9149] border-2 border-black dark:border-gray-700"></div>
                  <div className="w-4 h-4 rounded-full bg-[#FFECDB] border-2 border-black dark:border-gray-700"></div>
                  <div className="w-4 h-4 rounded-full bg-[#E0FFF1] border-2 border-black dark:border-gray-700"></div>
                </div>

                <div className="space-y-4 font-mono text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF9149] font-bold">const</span>
                    <span className="text-black dark:text-white">
                      developer
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">=</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {"{"}
                    </span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="flex gap-2">
                      <span className="text-[#0066CC] dark:text-[#60B5FF] font-bold">
                        name:
                      </span>
                      <span className="text-[#00875A] dark:text-[#E0FFF1]">
                        "Atharv"
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ,
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#0066CC] dark:text-[#60B5FF] font-bold">
                        stack:
                      </span>
                      <span className="text-[#00875A] dark:text-[#E0FFF1]">
                        "MERN"
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ,
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#0066CC] dark:text-[#60B5FF] font-bold">
                        status:
                      </span>
                      <span className="text-[#00875A] dark:text-[#E0FFF1]">
                        "shipping"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {"}"}
                    </span>
                    <span className="w-2 h-5 bg-[#FF9149] animate-pulse"></span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 border-4 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] flex items-center justify-center rotate-12">
                  <Code2 className="w-6 h-6 md:w-8 md:h-8 dark:text-black" />
                </div>

                <div className="absolute -bottom-4 -left-4 w-12 h-12 md:w-16 md:h-16 border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-secondary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(224,255,241,0.3)] flex items-center justify-center -rotate-12">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 dark:text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
