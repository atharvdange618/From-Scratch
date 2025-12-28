import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Clock,
} from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GiscusComments } from "@/components/giscus-comments";
import { RelatedPosts } from "@/components/related-posts";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

import "highlight.js/styles/atom-one-dark.css";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Post {
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
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    post.title
  )}&description=${encodeURIComponent(post.summary)}&type=blog`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author || "Atharv Dange" }],
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      url: `${baseUrl}/posts/${slug}`,
      siteName: "From Scratch",
      images: [
        {
          url: post.bannerImage || ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedAt,
      authors: [post.author || "Atharv Dange"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      images: [post.bannerImage || ogImageUrl],
      creator: "@atharvdangedev",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image:
      post.bannerImage ||
      `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
    datePublished: post.publishedDate,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || "Atharv Dange",
      url: `${baseUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "From Scratch",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    url: `${baseUrl}/posts/${slug}`,
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto px-4 py-8">
        <Button
          asChild
          variant="outline"
          className="mb-8 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge
              className="rounded-none border-2 border-black px-3 py-1 font-serif text-sm"
              style={{
                backgroundColor:
                  post.category === "Active Projects"
                    ? "#60B5FF"
                    : post.category === "Completed Projects"
                    ? "#FF9149"
                    : post.category === "Learning Notes"
                    ? "#AFDDFF"
                    : "#E0FFF1",
              }}
            >
              {post.category}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3 py-1 font-serif text-sm"
            >
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedDate)}
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
            <Tag className="h-4 w-4 text-gray-600" />
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
                  <Button
                    asChild
                    className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <a
                      href={post.linkedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </header>

        {post.bannerImage && (
          <div className="mb-12 overflow-hidden rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img
              src={post.bannerImage}
              alt={post.title}
              className="h-auto w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        <Separator className="my-4 border-2 border-black" />

        <div className="mb-8 rounded-none bg-white p-6 sm:p-8">
          <MarkdownRenderer
            content={post.content}
            className="prose-lg max-w-none font-serif"
          />
        </div>

        {/* Related Posts */}
        <RelatedPosts
          currentPostId={post._id}
          currentCategory={post.category}
          currentTags={post.tags}
          linkedProjectId={post.linkedProject?._id}
        />

        <Separator className="my-12 border-2 border-black" />

        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-sans text-3xl font-bold">Comments</h2>
          <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-6">
              <GiscusComments />
            </CardContent>
          </Card>
        </div>
      </article>
    </>
  );
}
