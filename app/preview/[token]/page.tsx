import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "@deemlol/next-icons";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { formatDate, formatTimeIST } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";
import Image from "next/image";

interface PreviewData {
  post: {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    tags: string[];
    linkedProject?: {
      _id: string;
      name: string;
      slug: string;
      githubUrl?: string;
    };
    bannerImage?: string;
    publishedDate: string;
    author: string;
    createdAt: string;
    updatedAt: string;
  };
  expiresAt: string;
}

async function getPreview(
  token: string
): Promise<{ data?: PreviewData; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/preview/${token}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to load preview" };
    }

    return { data: data.data };
  } catch (error) {
    console.error("Error fetching preview:", error);
    return { error: "Failed to load preview" };
  }
}

export const metadata: Metadata = {
  title: "Draft Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { data, error } = await getPreview(token);

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl rounded-none border-4 border-black bg-[#FFECDB] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-[#FF9149]" />
            <h1 className="mb-3 font-sans text-3xl font-bold">
              {error === "This preview link has expired"
                ? "Preview Expired"
                : "Preview Not Found"}
            </h1>
            <p className="font-serif text-lg text-gray-700">
              {error || "This preview link is invalid or has expired."}
            </p>
            {error === "This preview link has expired" && (
              <p className="mt-4 font-serif text-sm text-gray-600">
                Preview links are valid for 7 days. Please request a new preview
                link from the post author.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const { post, expiresAt } = data;
  const expiryDate = new Date(expiresAt);

  return (
    <>
      <div className="sticky top-0 z-50 border-b-4 border-black bg-[#FF9149] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-sans text-sm font-bold">DRAFT PREVIEW</p>
              <p className="text-xs">
                Expires: {formatDate(expiryDate)} at {formatTimeIST(expiryDate)}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="rounded-none border-2 border-black bg-white px-3 py-1 font-serif text-sm font-bold"
          >
            Not Published
          </Badge>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge
              className="rounded-none border-2 border-black px-3 py-1 font-serif text-sm"
              style={{
                backgroundColor:
                  post.category === "JavaScript & Web APIs"
                    ? "#60B5FF"
                    : post.category === "Git & Version Control"
                    ? "#FF9149"
                    : post.category === "Web Development"
                    ? "#AFDDFF"
                    : post.category === "Frameworks & Tools"
                    ? "#E0FFF1"
                    : post.category === "Software Engineering"
                    ? "#FFECDB"
                    : "#60B5FF",
              }}
            >
              {post.category}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3 py-1 font-serif text-sm"
            >
              <Calendar className="h-4 w-4" />
              {formatDate(post.createdAt)}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3 py-1 font-serif text-sm"
            >
              <Clock className="h-4 w-4" />
              {calculateReadingTime(post.content)}
            </Badge>
          </div>

          <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="mb-6 font-serif text-xl text-gray-700">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-none border-2 border-black bg-white px-3 py-1 font-serif"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {post.linkedProject && (
            <Card className="mt-8 rounded-none border-4 border-black bg-[#FFECDB] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="mb-1 font-serif text-sm font-bold uppercase tracking-wide text-gray-600">
                    Related Project
                  </p>
                  <h3 className="font-sans text-2xl font-bold">
                    {post.linkedProject.name}
                  </h3>
                </div>
                {post.linkedProject.githubUrl && (
                  <a
                    href={post.linkedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-none border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <ExternalLink className="mr-2 inline h-4 w-4" />
                    View Project
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </header>

        {post.bannerImage && (
          <div className="mb-12 overflow-hidden rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src={post.bannerImage}
              alt={post.title}
              width={1200}
              height={630}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        )}

        <Separator className="my-12 border-2 border-black" />

        <div className="mb-8 rounded-none bg-white p-6 sm:p-8">
          <MarkdownRenderer
            content={post.content}
            className="prose-lg max-w-none font-serif"
          />
        </div>

        <Card className="rounded-none border-4 border-black bg-[#AFDDFF] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-3 h-12 w-12" />
            <h3 className="mb-2 font-sans text-xl font-bold">
              Draft Preview Mode
            </h3>
            <p className="font-serif text-gray-700">
              Comments are disabled for preview mode. This post will need to be
              published before comments are enabled.
            </p>
          </CardContent>
        </Card>
      </article>
    </>
  );
}
