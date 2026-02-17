import { Code, Database, Server } from "@deemlol/next-icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function AboutContent() {
  const skills = [
    {
      category: "Frontend",
      items: [
        "React",
        "React Native",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "TanStack Query",
        "Zustand",
        "Expo",
      ],
      icon: <Code className="h-full w-full" />,
      iconBg: "#AFDDFF",
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "RESTful APIs", "Git", "Postman"],
      icon: <Server className="h-full w-full" />,
      iconBg: "#FFECDB",
    },
    {
      category: "Database",
      items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Mongoose"],
      icon: <Database className="h-full w-full" />,
      iconBg: "#E0FFF1",
    },
  ];

  const projects = [
    {
      name: "Reiatsu",
      description:
        "A minimal, type-safe HTTP server framework for Node.js, built from first principles using only Node.js core modules. Reiatsu is designed for simplicity, performance, and modern web development no dependencies, fully typed, and production-ready.",
      url: "https://github.com/atharvdange618/Reiatsu",
      tags: ["TypeScript", "Framework", "Backend", "Node.js"],
      color: "#AFDDFF",
    },
    {
      name: "Telemetry",
      description:
        "Privacy-first, self-hosted web analytics. No cookies, no tracking, just meaningful insights. Built with Fastify, React & TypeScript.",
      url: "https://github.com/atharvdange618/Telemetry",
      tags: ["Analytics", "Privacy", "React", "Fastify", "TypeScript"],
      color: "#FFECDB",
    },
    {
      name: "ArcHive",
      description:
        "A multi-platform digital capture tool designed to be your personal 'second brain.'",
      url: "https://github.com/atharvdange618/ArcHive",
      tags: ["React Native", "Mobile", "Bun", "Hono"],
      color: "#E0FFF1",
    },
    {
      name: "Recon",
      description:
        "Recon is a mobile app designed to empower software testers by providing a personal, undeniable log for every bug. It tracks defects, conversations, and decisions to eliminate the 'he said, she said' and ensure accountability.",
      url: "https://github.com/atharvdange618/Recon",
      tags: ["React Native", "Mobile", "TypeScript", "SQLite"],
      color: "#AFDDFF",
    },
  ];

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="mb-3 md:mb-4 font-sans text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
          About Me
        </h1>
      </div>

      <div className="mb-12 md:mb-16 gap-6 md:gap-8 flex flex-col md:flex-row">
        <div className="order-2 md:order-1 flex-1">
          <h2 className="mb-4 md:mb-6 font-sans text-2xl md:text-3xl font-bold">
            Hello, I'm Atharv
          </h2>
          <div className="space-y-4 md:space-y-5 font-serif text-sm md:text-base lg:text-lg leading-relaxed">
            <p className="text-gray-800 dark:text-gray-300">
              I'm a{" "}
              <strong className="font-bold text-black dark:text-white">
                Full Stack Engineer
              </strong>{" "}
              from Pune, India, specializing in building high-performance,
              scalable applications with the{" "}
              <strong className="font-bold text-black dark:text-white">
                MERN/PERN
              </strong>{" "}
              stack and{" "}
              <strong className="font-bold text-black dark:text-white">
                React Native
              </strong>
              . I'm passionate about backend development and understanding how
              technology works from the ground up, which led me to architect and
              build{" "}
              <strong className="font-bold text-black dark:text-white">
                Reiatsu
              </strong>{" "}
              - a zero-dependency TypeScript web framework.
            </p>
            <p className="text-gray-800 dark:text-gray-300">
              Currently working at{" "}
              <strong className="font-bold text-black dark:text-white">
                SmartScripts Pvt. Ltd.
              </strong>
              , I build production applications and mobile apps. I started my
              coding journey in{" "}
              <strong className="font-bold text-black dark:text-white">
                January 2021
              </strong>{" "}
              and turned professional in{" "}
              <strong className="font-bold text-black dark:text-white">
                March 2024
              </strong>{" "}
              - 4+ years of hands-on experience building real-world
              applications.
            </p>
            <p className="text-gray-800 dark:text-gray-300">
              I believe in{" "}
              <strong className="font-bold text-black dark:text-white">
                building in public
              </strong>{" "}
              and sharing my learnings. My projects span from frameworks to
              mobile apps, all built with the philosophy of understanding
              fundamentals and creating from scratch.
            </p>
            <p className="text-gray-800 dark:text-gray-300">
              When I'm not coding, you can find me watching movies, diving into
              a new anime series, or exploring the world around me with my
              girlfriend. I believe that diverse interests fuel creativity in
              problem-solving.
            </p>
          </div>

          <div className="mt-6 md:mt-8 flex flex-wrap gap-3 md:gap-4">
            <Button className="rounded-none border-4 border-black dark:border-gray-700 bg-[#60B5FF] px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              <Link href={"/contact"}>Get in Touch</Link>
            </Button>
            <Button
              asChild
              className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
            >
              <a
                href="https://atharvdangedev.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Portfolio
              </a>
            </Button>
          </div>
        </div>

        <div className="order-1 md:order-2 md:w-80 lg:w-96 mx-auto md:mx-0">
          <div className="relative w-full">
            <div className="absolute -left-3 -top-3 md:-left-4 md:-top-4 h-full w-full rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149]"></div>
            <div className="relative aspect-square overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
              <img
                src="/about-pic.jpg?height=400&width=400"
                alt="Atharv Dange - Full Stack Engineer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 md:mb-16">
        <h2 className="mb-6 md:mb-8 font-sans text-2xl md:text-3xl font-bold">
          Featured Projects
        </h2>
        <div className="grid gap-5 md:gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.url}
              className="flex flex-col rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] md:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
            >
              <CardHeader>
                <CardTitle className="font-sans text-xl md:text-2xl font-bold">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#60B5FF] transition-colors"
                  >
                    {project.name}
                  </a>
                </CardTitle>
                <CardDescription className="font-serif text-base dark:text-gray-300">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="rounded-none border-2 border-black dark:border-gray-700 px-3 py-1 font-serif text-black dark:text-gray-900"
                      style={{ backgroundColor: project.color }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12 md:my-16 border-2 border-black dark:border-gray-700" />

      <div className="mb-12 md:mb-16">
        <h2 className="mb-6 md:mb-8 text-center font-sans text-2xl md:text-3xl font-bold">
          My Skills & Expertise
        </h2>

        <div className="grid gap-5 md:gap-6 md:grid-cols-3">
          {skills.map((skill) => (
            <Card
              key={skill.category}
              className="overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
            >
              <div className="border-b-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full border-2 border-black dark:border-gray-700 p-2 dark:text-black"
                    style={{ backgroundColor: skill.iconBg }}
                  >
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold">{skill.category}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <ul className="grid grid-cols-2 gap-2">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#FF9149]"></span>
                      <span className="font-serif">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12 md:my-16 border-2 border-black dark:border-gray-700" />

      <div className="mb-12 md:mb-16">
        <h2 className="mb-6 md:mb-8 text-center font-sans text-2xl md:text-3xl font-bold">
          My Journey
        </h2>

        <div className="relative ml-4 md:ml-6 border-l-4 border-black dark:border-gray-700 pl-6 md:pl-8 space-y-8 md:space-y-12">
          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black dark:border-gray-700 dark:text-black bg-[#60B5FF]"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Built Minty Expense Tracker
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Nov 2025
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Smart SMS-based expense tracking for Android
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Built Telemetry Analytics Platform
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Jul 2025
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Privacy-first, cookieless analytics with real-time dashboards
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Launched ArcHive Mobile App
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Jun 2025
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Cross-platform digital sanctuary for Android
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black bg-[#AFDDFF] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Released Reiatsu Framework v1.0
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              May 2025
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Zero-dependency TypeScript web framework built from Node.js
              internals
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black bg-[#FFECDB] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Software Engineer
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              SmartScripts Pvt. Ltd. • March 2024 - Present
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Full-stack development with MERN/PERN stack, React Native/Expo
              mobile apps, production deployment, and client interactions
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black bg-[#E0FFF1] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Campus Placement
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              SmartScripts Pvt. Ltd. • Mar 2024
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Secured first job through campus recruitment
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black bg-[#AFDDFF] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Electronics & Telecommunication Engineering
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Savitribai Phule Pune University (SPPU) • 2020 - 2024
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Bachelor's Degree in Engineering
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-9 md:-left-12 top-0 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-black bg-[#FFECDB] dark:text-black"></div>
            <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold">
              Started Coding Journey
            </h3>
            <p className="mb-1 md:mb-2 font-serif text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Jan 2021
            </p>
            <p className="font-serif text-sm md:text-base dark:text-gray-300">
              Hello, World! Learned from YouTube, documentation, and programming
              books
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-none border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-800 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <h2 className="mb-3 md:mb-4 text-center font-sans text-2xl md:text-3xl font-bold">
          Let's Connect!
        </h2>
        <p className="mb-5 md:mb-6 text-center font-serif text-sm md:text-base dark:text-gray-300">
          I'm always open to interesting conversations, collaboration
          opportunities, or just saying hello.
        </p>
        <div className="flex justify-center">
          <Button className="rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
            <Link href={"/contact"}>Contact Me</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
