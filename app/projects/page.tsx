"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Github, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: "Active" | "Completed" | "Archived";
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
}

const statusColors = {
  Active: "#60B5FF",
  Completed: "#E0FFF1",
  Archived: "#FFECDB",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects || []);
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

  const filteredProjects =
    selectedStatus === "All"
      ? projects
      : projects.filter((p) => p.status === selectedStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center rounded-none border-4 border-black bg-[#AFDDFF] p-16">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center rounded-none border-4 border-black bg-[#FFECDB] p-16">
            <p className="text-xl font-bold">Error loading projects: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-sans text-5xl font-bold">My Projects</h1>
          <p className="mx-auto max-w-2xl font-serif text-xl text-gray-700">
            A collection of projects I&apos;ve built from scratch, exploring
            different technologies and solving real-world problems.
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {["All", "Active", "Completed", "Archived"].map((status) => (
            <Button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-none border-4 border-black px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                selectedStatus === status
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#AFDDFF]"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="group flex flex-col overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <CardHeader
                className="border-b-4 border-black p-6"
                style={{ backgroundColor: statusColors[project.status] }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold leading-tight">
                    {project.name}
                  </CardTitle>
                  {project.featured && <Star className="h-6 w-6 fill-black" />}
                </div>
                <Badge className="w-fit rounded-lg border-2 border-black bg-white px-3 py-1 font-bold text-black hover:bg-white">
                  {project.status}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 p-6">
                <p className="mb-4 font-serif leading-relaxed text-gray-700">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-bold uppercase">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-1 text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t-4 border-black bg-[#FFECDB] p-6">
                <Link href={`/projects/${project.slug}`} className="w-full">
                  <Button className="w-full rounded-none border-4 border-black bg-black px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]">
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
                      <Button className="w-full rounded-none border-4 border-black bg-white px-4 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Github className="mr-2 h-4 w-4" />
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
                      <Button className="w-full rounded-none border-4 border-black bg-white px-4 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#E0FFF1] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live
                      </Button>
                    </a>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-none border-4 border-dashed border-black bg-[#AFDDFF] p-16">
            <h3 className="mb-2 text-2xl font-bold">
              No {selectedStatus !== "All" ? selectedStatus : ""} Projects
            </h3>
            <p className="font-serif text-lg">
              {selectedStatus !== "All"
                ? "Try selecting a different status filter."
                : "Projects will appear here soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
