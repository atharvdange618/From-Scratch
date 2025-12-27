import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

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
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  category: string;
  publishedDate: string;
}

async function getProject(slug: string): Promise<Project | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getRelatedPosts(projectId: string): Promise<BlogPost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?linkedProject=${projectId}&isPublished=true`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

const statusColors = {
  Active: "#60B5FF",
  Completed: "#E0FFF1",
  Archived: "#FFECDB",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - From Scratch`,
    description: project.description,
    keywords: project.techStack.join(", "),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(project._id);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/projects">
          <Button className="mb-8 rounded-none border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <div
          className="mb-8 rounded-none border-4 border-black p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: statusColors[project.status] }}
        >
          <div className="mb-4 flex flex-col gap-4">
            <div>
              <h1 className="mb-2 font-sans text-3xl md:text-4xl lg:text-5xl font-bold">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold">
                  {project.status}
                </span>
                {project.featured && (
                  <span className="inline-block rounded-lg border-2 border-black bg-[#FF9149] px-3 py-1 text-sm font-bold">
                    ⭐ Featured
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold">
                  <Clock className="h-4 w-4" />
                  {calculateReadingTime(project.description)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full rounded-none border-4 border-black bg-black px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                    <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    View on GitHub
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full rounded-none border-4 border-black bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#E0FFF1] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-block rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-8 rounded-none border-4 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <MarkdownRenderer
            content={project.description}
            className="prose-lg max-w-none font-serif"
          />
        </div>

        {/* Banner Image */}
        {project.bannerImage && (
          <div className="mb-8 overflow-hidden rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img
              src={project.bannerImage}
              alt={project.name}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-6 font-sans text-3xl font-bold">
              Related Blog Posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link key={post._id} href={`/posts/${post.slug}`}>
                  <Card className="group h-full overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-4 border-black bg-[#AFDDFF] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-bold">
                          {formatDate(post.publishedDate)}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold leading-tight">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-3 font-serif text-sm leading-relaxed">
                        {post.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded-lg border-2 border-black bg-[#FFECDB] px-2 py-1 text-xs font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t-4 border-black bg-[#AFDDFF] p-4">
                      <Button className="w-full rounded-none border-4 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
                        Read Post
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Project Timeline */}
        <div className="rounded-none border-4 border-black bg-[#FFECDB] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 font-sans text-2xl font-bold">
            Project Timeline
          </h2>
          <div className="flex flex-col gap-4 font-serif">
            <div className="flex items-center gap-4">
              <span className="font-bold">Created:</span>
              <span>{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">Last Updated:</span>
              <span>{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
