import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { Calendar, ExternalLink, Clock } from "@deemlol/next-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GiscusComments } from "@/components/giscus-comments";
import { RelatedPosts } from "@/components/related-posts";
import { ResourcesList } from "@/components/resources-list";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";
import TrackableLink from "@/components/analytics/trackable-link";
import ScrollTracker from "@/components/analytics/scroll-tracker";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ReadProgress } from "@/components/read-progress";
import { ClickableTags } from "@/components/clickable-tags";
import { SocialShare } from "@/components/social-share";
import { getCategoryColor } from "@/lib/categories";
import { PostTracker } from "@/components/post-tracker";
import { TableOfContents } from "@/components/table-of-contents";
import { extractHeadings } from "@/lib/toc-generator";
import { PostViewCount } from "@/components/post-view-count";
import { AuthorBio } from "@/components/author-bio";
import connectDB from "@/lib/mongodb";
import { Post as PostModel } from "@/lib/model-registry";
import type { Post } from "@/lib/types";
import { env } from "@/lib/env";

// @ts-ignore - CSS import for syntax highlighting
import "highlight.js/styles/atom-one-dark.css";

export const revalidate = 86400;
export const dynamicParams = true;

async function getPost(slug: string): Promise<Post | null> {
  try {
    await connectDB();
    const post = await PostModel.findOne({ slug, isPublished: true })
      .populate("linkedProject", "_id name slug githubUrl")
      .lean();

    if (!post) {
      return null;
    }

    const formattedPost: any = {
      ...post,
      _id: post._id.toString(),
      publishedDate:
        post.publishedDate?.toISOString() ||
        post.createdAt?.toISOString() ||
        "",
      createdAt: post.createdAt?.toISOString() || "",
      updatedAt: post.updatedAt?.toISOString() || "",
      resources:
        post.resources?.map(({ title, url }: any) => ({
          title,
          url,
        })) || [],
    };

    if (post.linkedProject && typeof post.linkedProject === "object") {
      formattedPost.linkedProject = {
        _id: (post.linkedProject as any)._id.toString(),
        name: (post.linkedProject as any).name,
        slug: (post.linkedProject as any).slug,
        githubUrl: (post.linkedProject as any).githubUrl,
      };
    }

    return formattedPost as Post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await PostModel.find({ isPublished: true })
      .select("slug")
      .lean();

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
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

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    post.title,
  )}&description=${encodeURIComponent(post.summary)}&type=blog`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author || "Atharv Dange" }],
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      url: `/posts/${slug}`,
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

  const headings = extractHeadings(post.content);

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

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
      <ReadProgress />
      <PostTracker
        post={{
          _id: post._id,
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          category: post.category,
          publishedDate: post.publishedDate,
        }}
      />
      <script
        id={`post-jsonld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[{ label: "Blog", href: "/blogs" }, { label: post.title }]}
        />

        {post.bannerImage && (
          <div className="mb-8 overflow-hidden rounded-none border-2 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(74,144,204,0.3)]">
            <Image
              src={post.bannerImage}
              alt={post.title}
              width={1200}
              height={630}
              className="h-auto w-full object-cover"
              quality={75}
              priority
            />
          </div>
        )}

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge
              className="rounded-none border-2 border-black px-3 py-1 font-serif text-sm"
              style={{
                backgroundColor: getCategoryColor(post.category),
              }}
            >
              {post.category}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-3 py-1 font-serif text-sm"
            >
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedDate)}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-3 py-1 font-serif text-sm"
            >
              <Clock className="h-4 w-4" />
              {calculateReadingTime(post.content)}
            </Badge>
            <PostViewCount slug={slug} />
          </div>

          <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <MarkdownRenderer
            content={post.summary}
            className="prose-lg max-w-none font-serif"
          />

          <ClickableTags tags={post.tags} postTitle={post.title} />

          {post.linkedProject && (
            <Card className="mt-8 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(74,144,204,0.3)]">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="mb-1 font-serif text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Related Project
                  </p>
                  <h3 className="font-sans text-2xl font-bold dark:text-white">
                    {post.linkedProject.name}
                  </h3>
                </div>
                {post.linkedProject.githubUrl && (
                  <Button
                    asChild
                    className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(74,144,204,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] dark:hover:bg-primary hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(74,144,204,0.3)]"
                  >
                    <TrackableLink
                      href={post.linkedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      trackingData={{
                        eventType: "external_link_click",
                        eventData: {
                          linkType: "github",
                          projectName: post.linkedProject.name,
                          projectSlug: post.linkedProject.slug,
                          source: "post",
                          postTitle: post.title,
                        },
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </TrackableLink>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </header>

        <div className="flex flex-col xl:flex-row xl:gap-12 items-start justify-center">
          <div className="flex-1 min-w-0 w-full max-w-9xl relative mx-auto">
            <ScrollTracker
              postTitle={post.title}
              category={post.category}
              readingTime={calculateReadingTime(post.content)}
            >
              <div className="mb-8 rounded-none bg-white dark:bg-gray-900">
                <MarkdownRenderer
                  content={post.content}
                  className="prose-lg max-w-none font-serif"
                />
              </div>
            </ScrollTracker>

            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-between items-start">
                <div className="flex-1 w-full">
                  <AuthorBio
                    authorName={post.author || "Atharv Dange"}
                    authorImage="/atharv-avatar.jpeg"
                  />
                </div>
                <div className="flex-shrink-0">
                  <SocialShare
                    title={post.title}
                    url={`${baseUrl}/posts/${post.slug}`}
                    description={post.summary}
                  />
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 font-sans text-3xl font-bold dark:text-white">
                Comments
              </h2>
              <div className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="p-6">
                  <GiscusComments />
                </div>
              </div>
            </div>

            <ResourcesList
              resources={post.resources || []}
              postTitle={post.title}
              category={post.category}
            />

            <RelatedPosts
              currentPostId={post._id}
              currentCategory={post.category}
              currentTags={post.tags}
              linkedProjectId={post.linkedProject?._id}
            />
          </div>

          {headings.length > 0 && (
            <aside className="hidden xl:block w-[280px] shrink-0 sticky top-8">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
