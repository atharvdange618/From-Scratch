import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Github, ExternalLink, Calendar, Star } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import TrackableLink from "@/components/analytics/trackable-link";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import {
  Project as ProjectModel,
  Post as PostModel,
} from "@/lib/model-registry";
import type { Project, PostListItem } from "@/lib/types";
import { env } from "@/lib/env";

async function getProject(slug: string): Promise<Project | null> {
  try {
    await connectDB();
    const project = await ProjectModel.findOne({ slug }).lean();

    if (!project) {
      return null;
    }

    return {
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt?.toISOString() || "",
      updatedAt: project.updatedAt?.toISOString() || "",
    } as any;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getRelatedPosts(projectId: string): Promise<PostListItem[]> {
  try {
    await connectDB();
    const posts = await PostModel.find({
      linkedProject: projectId,
      isPublished: true,
    })
      .select("title slug summary tags category publishedDate")
      .sort({ publishedDate: -1 })
      .lean();

    return posts.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
      publishedDate:
        post.publishedDate?.toISOString() ||
        post.createdAt?.toISOString() ||
        "",
    }));
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const truncatedDescription =
    project.description.length > 160
      ? project.description.substring(0, 157) + "..."
      : project.description;

  const ogImageUrl =
    project.bannerImage ||
    `${baseUrl}/api/og?title=${encodeURIComponent(project.name)}&description=${encodeURIComponent(truncatedDescription)}&type=project`;

  return {
    title: `${project.name}`,
    description: truncatedDescription,
    keywords: [
      ...project.techStack,
      project.name,
      project.status.toLowerCase(),
      "project",
      "case study",
      "development",
    ],
    authors: [{ name: "Atharv Dange", url: "https://atharvdangedev.in" }],
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${project.name} - From Scratch`,
      description: truncatedDescription,
      url: `/projects/${slug}`,
      siteName: "From Scratch",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} - Project Screenshot`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} - From Scratch`,
      description: truncatedDescription,
      images: [ogImageUrl],
      creator: "@atharvdangedev",
    },
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

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": project.githubUrl ? "SoftwareApplication" : "CreativeWork",
    name: project.name,
    description: project.description,
    url: `${baseUrl}/projects/${slug}`,
    author: {
      "@type": "Person",
      name: "Atharv Dange",
      url: "https://atharvdangedev.in",
    },
    ...(project.githubUrl && {
      codeRepository: project.githubUrl,
    }),
    ...(project.liveUrl && {
      applicationCategory: "WebApplication",
      url: project.liveUrl,
    }),
    ...(project.bannerImage && {
      image: project.bannerImage,
    }),
    ...(project.techStack && {
      programmingLanguage: project.techStack,
    }),
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
  };

  return (
    <>
      <script
        id={`project-jsonld-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background py-16 dark:bg-neutral-900 md:py-10">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Link
              href="/projects"
              className="mb-4 inline-flex items-center gap-1 font-sans text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to projects
            </Link>

            <BreadcrumbNav
              items={[
                { label: "Projects", href: "/projects" },
                { label: project.name },
              ]}
            />
          </div>

          <header className="mt-10 mb-12 pl-5 border-l-2 border-gray-200 dark:border-gray-500">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 border-2 border-gray-200 px-2 py-0.5 text-xs font-semibold dark:border-gray-500">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    project.status === "Active"
                    ? "bg-primary"
                    : project.status === "Completed"
                        ? "bg-[#4ADE80]"
                        : "bg-[#FB923C]"
                  }`}
                />
                {project.status}
              </span>
              {project.featured && (
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              )}
              <span className="text-xs text-gray-300 dark:text-neutral-600">
                ·
              </span>
              <span className="font-sans text-xs text-gray-500 dark:text-neutral-500">
                {calculateReadingTime(project.description)} read
              </span>
            </div>

            <h1 className="font-sans text-4xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
              {project.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-sm text-gray-500 dark:text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Started {formatDate(project.createdAt)}
              </span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="hidden sm:inline">
                Updated {formatDate(project.updatedAt)}
              </span>
            </div>

            <div className="mt-3 font-sans text-sm text-gray-500 dark:text-neutral-500">
              <span className="font-medium text-gray-500 dark:text-neutral-400">
                Stack:{" "}
              </span>
              {project.techStack.join(", ")}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <TrackableLink
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  trackingData={{
                    eventType: "external_link_click",
                    eventData: {
                      linkType: "github",
                      projectName: project.name,
                      projectSlug: project.slug,
                      source: "project",
                      status: project.status,
                    },
                  }}
                  className="inline-flex items-center gap-1.5 border-2 border-black px-4 py-2 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.15)]"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </TrackableLink>
              )}
              {project.liveUrl && (
                <TrackableLink
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  trackingData={{
                    eventType: "external_link_click",
                    eventData: {
                      linkType: "live",
                      projectName: project.name,
                      projectSlug: project.slug,
                      source: "project",
                      status: project.status,
                    },
                  }}
                  className="inline-flex items-center gap-1.5 border-2 border-black px-4 py-2 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.15)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live demo
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </TrackableLink>
              )}
            </div>
          </header>

          {project.bannerImage && (
            <div className="mb-12 overflow-hidden border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)] dark:border-gray-500 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.04)]">
              <Image
                src={project.bannerImage}
                alt={project.name}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                quality={85}
                priority
              />
            </div>
          )}

          <section className="mb-16">
            <MarkdownRenderer
              content={project.description}
              className="prose-lg max-w-none dark:prose-invert"
            />
          </section>

          {relatedPosts.length > 0 && (
            <section className="border-t-2 border-gray-200 pt-12 dark:border-neutral-800">
              <h2 className="mb-8 font-sans text-2xl font-bold tracking-tight text-black dark:text-white">
                Related posts
              </h2>
              <div>
                {relatedPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className={`${index > 0 ? "border-t-2 border-gray-200 dark:border-neutral-800" : ""} py-4`}
                  >
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group flex items-center justify-between pl-4 border-l-2 border-gray-200 transition-colors hover:border-primary dark:border-gray-500 dark:hover:border-primary"
                    >
                      <div>
                        <h3 className="font-sans font-semibold text-black transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-0.5 font-serif text-sm text-gray-500 dark:text-neutral-400">
                          {formatDate(post.publishedDate)}
                        </p>
                      </div>
                      <ArrowLeft className="h-4 w-4 -rotate-180 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-500 dark:text-neutral-600 dark:group-hover:text-neutral-400" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
