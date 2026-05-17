"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProjectsQuery } from "@/lib/hooks/use-projects";
import { Github, ExternalLink, Star } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectCardSkeleton } from "@/components/skeletons";
import { handleProjectHover } from "@/lib/prefetch";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_LABELS = ["All", "Active", "Completed", "Archived"] as const;

const STATUS_DOT_COLORS: Record<string, string> = {
  Active: "bg-[#60B5FF]",
  Completed: "bg-[#4ADE80]",
  Archived: "bg-[#FB923C]",
};

export function ProjectsContent() {
  const { data: projects = [], isLoading, isError, error } = useProjectsQuery();
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const queryClient = useQueryClient();

  const filteredProjects = useMemo(() => {
    return selectedStatus === "All"
      ? projects
      : projects.filter((p) => p.status === selectedStatus);
  }, [projects, selectedStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 font-sans text-4xl font-bold md:text-5xl">
            Projects
          </h1>
          <p className="mb-12 font-serif text-lg text-gray-600 dark:text-gray-400">
            Loading...
          </p>
          <div className="space-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProjectCardSkeleton key={`project-skeleton-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4">
          <div className="border-2 border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
            <p className="font-serif text-red-600 dark:text-red-400">
              Something went wrong loading projects.{" "}
              {error?.message || "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 dark:bg-neutral-900 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-16">
          <h1 className="mb-3 font-sans text-4xl font-bold tracking-tight md:text-5xl">
            Projects
          </h1>
          <p className="font-serif text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            I write in-depth about the projects I build - the decisions,
            trade-offs, and lessons learned along the way.
          </p>
        </header>

        <div className="mb-12 flex items-center gap-6 border-b-2 border-gray-200 pb-4 dark:border-neutral-700">
          {STATUS_LABELS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`relative font-sans text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? "text-black dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              }`}
            >
              {status}
              {selectedStatus === status && (
                <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
          ))}
        </div>

        <div>
          {filteredProjects.map((project, index) => (
            <article
              key={project._id}
              className={`${index > 0 ? "border-t-2 border-gray-200 dark:border-neutral-800" : ""} py-8`}
            >
              <div className="group pl-5 border-l-2 border-gray-200 transition-colors hover:border-primary dark:border-neutral-700 dark:hover:border-primary">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 border-2 border-gray-200 px-2 py-0.5 text-xs font-semibold dark:border-neutral-700 ${STATUS_DOT_COLORS[project.status] ? "border-current/20" : ""}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[project.status] || "bg-gray-400"}`}
                    />
                    {project.status}
                  </span>
                  {project.featured && (
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  onMouseEnter={() =>
                    handleProjectHover(queryClient, project.slug)
                  }
                >
                  <h2 className="font-sans text-2xl font-bold tracking-tight text-black transition-colors hover:text-primary dark:text-white dark:hover:text-primary md:text-3xl">
                    {project.name}
                  </h2>
                </Link>

                <div className="mt-3 font-serif leading-relaxed text-gray-600 dark:text-gray-400">
                  <MarkdownRenderer
                    content={project.description}
                    className="prose-p:mb-0 prose-p:leading-relaxed"
                    truncate={250}
                  />
                </div>

                <div className="mt-4 font-sans text-sm text-gray-500 dark:text-neutral-500">
                  <span className="font-medium text-gray-500 dark:text-neutral-400">
                    Stack:{" "}
                  </span>
                  {project.techStack.join(", ")}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    onMouseEnter={() =>
                      handleProjectHover(queryClient, project.slug)
                    }
                    className="inline-flex items-center gap-1.5 border-2 border-black px-4 py-2 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.15)]"
                  >
                    Read the story
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border-2 border-gray-300 px-3 py-2 text-sm text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-gray-400 hover:text-gray-700 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.06)] dark:border-neutral-600 dark:text-neutral-400 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.04)] dark:hover:border-neutral-500 dark:hover:text-neutral-200 dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.04)]"
                    >
                      <Github className="h-4 w-4" />
                      Source
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border-2 border-gray-300 px-3 py-2 text-sm text-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-gray-400 hover:text-gray-700 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.06)] dark:border-neutral-600 dark:text-neutral-400 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.04)] dark:hover:border-neutral-500 dark:hover:text-neutral-200 dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.04)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 p-12 text-center dark:border-neutral-700">
            <p className="font-serif text-lg text-gray-400 dark:text-neutral-500">
              {selectedStatus !== "All"
                ? `No ${selectedStatus.toLowerCase()} projects yet.`
                : "Projects will appear here soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
