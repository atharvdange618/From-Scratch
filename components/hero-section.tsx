"use client";

import { useEffect, useState } from "react";
import { Code2, BookOpen, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStatsQuery } from "@/lib/hooks/use-stats";
import { MagneticButton } from "./magnetic-button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 22,
    },
  },
};

const statuses = [
  '"building things"',
  '"experimenting"',
  '"shipping code"',
  '"breaking stuff"',
  '"sharing ideas"',
];

function TypewriterStatus() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = statuses[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 40 + Math.random() * 30);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 20);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % statuses.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index]);

  return (
    <span className="text-[#00875A] dark:text-[#6B9FBF]">
      {displayed}
      <span className="w-[2px] h-[1em] bg-secondary inline-block ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

export function HeroSection() {
  const { data, isLoading, isError } = useStatsQuery();

  const postCount = isError ? "12+" : isLoading ? "..." : (data?.posts ?? "0");

  return (
    <section className="mb-12 mt-4 md:mb-16 md:mt-8">
      <div className="grid gap-6 md:gap-8 md:grid-cols-12">
        <motion.div
          className="md:col-span-7 flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6 md:space-y-8">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 w-fit">
                <div className="rounded-none border-2 border-black dark:border-gray-700 bg-secondary px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]">
                  <span className="text-sm md:text-base font-bold dark:text-black">
                    TECH BLOG & JOURNEY
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-sans text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] dark:text-white"
            >
              Writing code.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Sharing ideas.</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-primary -rotate-1 -z-0"></span>
              </span>
            </motion.h1>

            <motion.div variants={itemVariants}>
              <div className="border-l-8 border-[#E0FFF1] dark:border-secondary pl-4 md:pl-6">
                <p className="font-serif text-lg md:text-xl lg:text-2xl dark:text-gray-300 leading-relaxed">
                  Turning ideas into products -{" "}
                  <span className="font-bold text-secondary">
                    {postCount}
                  </span>{" "}
                  posts and counting. Building with modern tools, sharing
                  everything along the way.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 md:gap-4 pt-2"
            >
              <MagneticButton>
                <Button
                  asChild
                  className="rounded-none border-2 border-black dark:border-gray-700 bg-secondary px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-black dark:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] md:dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]"
                >
                  <Link href="/blogs" prefetch>
                    <BookOpen className="w-5 h-5 mr-2 inline" />
                    READ THE BLOG
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  asChild
                  className="rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-800 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-black dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] md:dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#E0FFF1] dark:hover:bg-neutral-700 active:scale-[0.97] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]"
                >
                  <a
                    href="https://www.atharvdangedev.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ABOUT ME
                  </a>
                </Button>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-5 flex items-center justify-center mt-12 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.3,
          }}
        >
          <div className="relative w-[85%] sm:w-[90%] md:w-full max-w-md mx-auto">
            <div className="relative p-1.5 rounded-none border-2 border-black dark:border-gray-700 bg-primary/10 dark:bg-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-secondary/10 dark:from-primary/20 dark:via-transparent dark:to-secondary/20 pointer-events-none"></div>

              <div className="relative w-full h-72 md:h-80 bg-background dark:bg-neutral-900 p-6 md:p-8 border-2 border-black dark:border-gray-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(107,114,128,0.3)]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 rounded-full bg-secondary border-2 border-black dark:border-gray-700"></div>
                  <div className="w-4 h-4 rounded-full bg-[#FFECDB] border-2 border-black dark:border-gray-700"></div>
                  <div className="w-4 h-4 rounded-full bg-[#E0FFF1] border-2 border-black dark:border-gray-700"></div>
                </div>

                <div className="space-y-4 font-mono text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-bold">const</span>
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
                      <span className="text-[#0066CC] dark:text-[#4A90CC] font-bold">
                        name:
                      </span>
                      <span className="text-[#00875A] dark:text-[#6B9FBF]">
                        "Atharv"
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ,
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#0066CC] dark:text-[#4A90CC] font-bold">
                        focus:
                      </span>
                      <span className="text-[#00875A] dark:text-[#6B9FBF]">
                        "Full Stack"
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ,
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#0066CC] dark:text-[#4A90CC] font-bold">
                        status:
                      </span>
                      <TypewriterStatus />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {"}"}
                    </span>
                    <span className="w-2 h-5 bg-secondary animate-pulse"></span>
                  </div>
                </div>

                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 border-2 border-black dark:border-gray-700 bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] flex items-center justify-center rotate-12"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Code2 className="w-6 h-6 md:w-8 md:h-8 dark:text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 md:w-16 md:h-16 border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-secondary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] flex items-center justify-center -rotate-12"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Terminal className="w-6 h-6 md:w-8 md:h-8 dark:text-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
