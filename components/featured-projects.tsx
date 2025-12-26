"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Github, Star, Code2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: "Active" | "Completed" | "Archived";
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  bannerImage?: string;
  featured: boolean;
}

interface GitHubStats {
  stars: number;
  forks: number;
  language: string;
}

const statusColors = {
  Active: "#60B5FF",
  Completed: "#E0FFF1",
  Archived: "#FFECDB",
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubStats, setGithubStats] = useState<Record<string, GitHubStats>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?featured=true");
        if (!response.ok) {
          throw new Error("Failed to fetch featured projects");
        }
        const data = await response.json();
        const featuredProjects = (data.projects || []).slice(0, 3);
        setProjects(featuredProjects);

        // Fetch GitHub stats for projects with GitHub URLs
        const statsPromises = featuredProjects
          .filter((p: Project) => p.githubUrl)
          .map(async (p: Project) => {
            if (!p.githubUrl) return null;

            const match = p.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) return null;

            const [, owner, repo] = match;
            try {
              const res = await fetch(
                `https://api.github.com/repos/${owner}/${repo}`,
                {
                  headers: {
                    Accept: "application/vnd.github.v3+json",
                  },
                }
              );

              if (!res.ok) return null;

              const repoData = await res.json();
              return {
                projectId: p._id,
                stats: {
                  stars: repoData.stargazers_count || 0,
                  forks: repoData.forks_count || 0,
                  language: repoData.language || "Unknown",
                },
              };
            } catch (err) {
              console.error(`Failed to fetch GitHub stats for ${p.name}:`, err);
              return null;
            }
          });

        const statsResults = await Promise.all(statsPromises);
        const statsMap: Record<string, GitHubStats> = {};
        statsResults.forEach((result) => {
          if (result) {
            statsMap[result.projectId] = result.stats;
          }
        });
        setGithubStats(statsMap);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="mb-12 md:mb-16">
        <h2 className="mb-6 md:mb-8 font-sans text-2xl md:text-3xl font-bold">
          Featured Projects
        </h2>
        <div className="flex items-center justify-center rounded-none border-4 border-black bg-[#AFDDFF] p-12 md:p-16">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12 md:mb-16">
        <h2 className="mb-6 md:mb-8 font-sans text-2xl md:text-3xl font-bold">
          Featured Projects
        </h2>
        <div className="flex flex-col items-center justify-center rounded-none border-4 border-black bg-[#FFECDB] p-12 md:p-16">
          <p className="text-lg md:text-xl font-bold">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-sans text-2xl md:text-3xl font-bold">
          Featured Projects
        </h2>
        <Link href="/projects">
          <Button className="rounded-none border-4 border-black bg-white px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            View All Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const stats = githubStats[project._id];

          return (
            <Card
              key={project._id}
              className="group flex flex-col overflow-hidden rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <CardHeader
                className="border-b-4 border-black p-4 md:p-6"
                style={{ backgroundColor: statusColors[project.status] }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <CardTitle className="text-xl md:text-2xl font-bold leading-tight">
                    {project.name}
                  </CardTitle>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="inline-block rounded-lg border-2 border-black bg-white px-2 py-1 text-xs font-bold">
                    {project.status}
                  </span>
                  <Star className="h-4 w-4 fill-black" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 md:p-6">
                <p className="mb-4 font-serif text-sm md:text-base leading-relaxed text-gray-700">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    <h4 className="text-xs md:text-sm font-bold uppercase">
                      Tech Stack
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-1 text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="inline-block rounded-lg border-2 border-black bg-[#FFECDB] px-2 py-1 text-xs font-bold">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* GitHub Stats */}
                {stats && (
                  <div className="rounded-none border-2 border-black bg-[#E0FFF1] p-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-lg md:text-xl font-bold">
                          {stats.stars}
                        </div>
                        <div className="text-xs font-serif">Stars</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg md:text-xl font-bold">
                          {stats.forks}
                        </div>
                        <div className="text-xs font-serif">Forks</div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs md:text-sm font-bold truncate max-w-full">
                          {stats.language}
                        </div>
                        <div className="text-xs font-serif">Language</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t-4 border-black bg-[#FFECDB] p-4 md:p-6">
                <Link href={`/projects/${project.slug}`} className="w-full">
                  <Button className="w-full rounded-none border-4 border-black bg-black px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                    View Details
                  </Button>
                </Link>

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full rounded-none border-4 border-black bg-white px-3 md:px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Github className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        GitHub
                      </Button>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full rounded-none border-4 border-black bg-white px-3 md:px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#E0FFF1] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <ExternalLink className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        Live
                      </Button>
                    </a>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
