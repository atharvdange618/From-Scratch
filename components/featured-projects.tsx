import Link from "next/link";
import { ExternalLink, Github, Star, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Project from "@/lib/models/Project";
import connectDB from "@/lib/mongodb";

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

async function getFeaturedProjects() {
  await connectDB();
  const projects = await Project.find({ featured: true }).limit(3).lean();
  return projects.map((project) => ({
    ...project,
    _id: project._id.toString(),
  }));
}

async function getGithubStats(
  githubUrl: string | undefined,
): Promise<GitHubStats | null> {
  if (!githubUrl) return null;

  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) return null;

    const repoData = await res.json();
    return {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      language: repoData.language || "Unknown",
    };
  } catch (err) {
    console.error(`Failed to fetch GitHub stats for ${githubUrl}:`, err);
    return null;
  }
}

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();
  const githubStats = await Promise.all(
    projects.map((p) => getGithubStats(p.githubUrl)),
  );

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-sans text-2xl md:text-3xl font-bold dark:text-white">
          Featured Projects
        </h2>
        <Link href="/projects">
          <Button className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-800 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]">
            View All Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const stats = githubStats[index];

          return (
            <Card
              key={project._id}
              className="group flex flex-col overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)] md:dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(96,181,255,0.3)] md:dark:hover:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
            >
              <CardHeader
                className="border-b-4 border-black dark:border-gray-700 p-4 md:p-6"
                style={{ backgroundColor: statusColors[project.status] }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <CardTitle className="text-xl md:text-2xl font-bold leading-tight dark:text-black">
                    {project.name}
                  </CardTitle>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="inline-block rounded-lg border-2 border-black dark:border-gray-900 bg-white dark:bg-gray-100 px-2 py-1 text-xs font-bold dark:text-black">
                    {project.status}
                  </span>
                  <Star className="h-4 w-4 fill-black dark:fill-gray-900" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 md:p-6">
                <MarkdownRenderer
                  content={project.description}
                  className="mb-4 font-serif text-sm md:text-base text-gray-700 dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-0"
                  truncate={150}
                />

                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Code2 className="h-4 w-4 dark:text-white" />
                    <h4 className="text-xs md:text-sm font-bold uppercase dark:text-white">
                      Tech Stack
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 px-2 py-1 text-xs font-bold dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-700 px-2 py-1 text-xs font-bold dark:text-white">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {stats && (
                  <div className="rounded-none border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 p-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-lg md:text-xl font-bold dark:text-white">
                          {stats.stars}
                        </div>
                        <div className="text-xs font-serif dark:text-gray-300">
                          Stars
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg md:text-xl font-bold dark:text-white">
                          {stats.forks}
                        </div>
                        <div className="text-xs font-serif dark:text-gray-300">
                          Forks
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs md:text-sm font-bold truncate max-w-full dark:text-white">
                          {stats.language}
                        </div>
                        <div className="text-xs font-serif dark:text-gray-300">
                          Language
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-4 md:p-6">
                <Link href={`/projects/${project.slug}`} className="w-full">
                  <Button className="w-full rounded-none border-4 border-black dark:border-gray-700 bg-black dark:bg-primary px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,145,73,0.5)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,0.5)]">
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
