import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GiscusComments } from "@/components/giscus-comments";

// Import highlight.js theme
import "highlight.js/styles/atom-one-dark.css";

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
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
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

  const publishedDate = new Date(post.publishedDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Back button */}
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

      {/* Post Header */}
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
          <div className="flex items-center gap-2 font-serif text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {publishedDate}
          </div>
        </div>

        <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        <p className="mb-6 font-serif text-xl text-gray-700">{post.summary}</p>

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

        {/* Linked Project Card */}
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

      {/* Banner Image */}
      {post.bannerImage && (
        <div className="mb-12 overflow-hidden rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <img
            src={post.bannerImage}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <Separator className="my-12 border-2 border-black" />

      {/* Post Content */}
      <div className="prose prose-lg mx-auto max-w-4xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-6 mt-8 font-sans text-4xl font-bold">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-4 mt-8 font-sans text-3xl font-bold">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-3 mt-6 font-sans text-2xl font-bold">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 font-serif text-lg leading-relaxed text-gray-800">
                {children}
              </p>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="font-bold text-[#60B5FF] underline decoration-4 underline-offset-4 transition-colors hover:text-[#FF9149]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 ml-6 list-disc font-serif text-lg">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 ml-6 list-decimal font-serif text-lg">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-2 text-gray-800">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 border-l-4 border-[#FF9149] bg-[#FFECDB] p-6 font-serif italic">
                {children}
              </blockquote>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="rounded-none border-2 border-black bg-[#E0FFF1] px-2 py-1 font-mono text-sm">
                    {children}
                  </code>
                );
              }
              return <code className={className}>{children}</code>;
            },
            pre: ({ children }) => (
              <pre className="my-6 overflow-x-auto rounded-none border-4 border-black bg-[#282c34] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {children}
              </pre>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <Separator className="my-12 border-2 border-black" />

      {/* Giscus Comments */}
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 font-sans text-3xl font-bold">Comments</h2>
        <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <GiscusComments />
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
