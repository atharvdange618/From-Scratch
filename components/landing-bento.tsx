import Link from "next/link";
import { unstable_cache } from "next/cache";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Github,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoCard } from "./bento-grid";
import { LiveStatusDot } from "./live-status-dot";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import ProjectModel from "@/lib/models/Project";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import { BlogCard } from "./blog-card";
import { PopularPosts } from "./popular-posts";
import { PrefetchLink } from "./prefetch-link";
import { formatDate } from "@/lib/dateandnumbers";
import { getCategoryColorVar } from "@/lib/categories";

interface PostData {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedDate: string;
  createdAt: string;
  readingTime?: string;
  tags?: string[];
}

interface ProjectData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const getBentoData = unstable_cache(
  async () => {
    await connectDB();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const [featuredResult, activeProject, recentResult, pageViewsAgg] =
      await Promise.all([
        Post.findOne({ isFeatured: true, isPublished: true })
          .select("-bannerImage -content")
          .sort({ publishedDate: -1 })
          .lean(),
        ProjectModel.findOne({ status: "Active" })
          .sort({ createdAt: -1 })
          .lean(),
        Post.find({ isPublished: true })
          .select("-bannerImage -content")
          .sort({ publishedDate: -1, createdAt: -1 })
          .limit(4)
          .lean(),
        AnalyticsEvent.aggregate([
          {
            $match: {
              "eventData.path": { $regex: "^/posts/", $exists: true },
              timestamp: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: { path: "$eventData.path", session: "$sessionId" },
            },
          },
          {
            $group: {
              _id: "$_id.path",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    let featuredPost: PostData | null = null;
    if (featuredResult) {
      featuredPost = {
        _id: featuredResult._id.toString(),
        title: featuredResult.title,
        slug: featuredResult.slug,
        summary: featuredResult.summary,
        category: featuredResult.category,
        tags: (featuredResult as any).tags || [],
        publishedDate: featuredResult.publishedDate?.toISOString() || "",
        createdAt: featuredResult.createdAt?.toISOString() || "",
        readingTime: (featuredResult as any).readingTime || "",
      };
    }

    let projectPost: ProjectData | null = null;
    if (activeProject) {
      projectPost = {
        _id: activeProject._id.toString(),
        name: activeProject.name,
        slug: activeProject.slug,
        description: activeProject.description,
        status: activeProject.status,
        techStack: (activeProject as any).techStack || [],
        githubUrl: (activeProject as any).githubUrl || "",
        liveUrl: (activeProject as any).liveUrl || "",
      };
    }

    const featuredSlug = featuredPost?.slug;

    let allRecentPosts = recentResult
      .filter((p: any) => p.slug !== featuredSlug)
      .slice(0, 3)
      .map((post: any) => ({
        _id: post._id.toString(),
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        category: post.category,
        tags: post.tags || [],
        publishedDate: post.publishedDate?.toISOString() || "",
        createdAt: post.createdAt?.toISOString() || "",
        readingTime: post.readingTime || "",
      }));

    if (!featuredPost && allRecentPosts.length > 0) {
      featuredPost = allRecentPosts.shift()!;
    }

    const postPaths = pageViewsAgg
      .filter((p: any) => p._id?.startsWith("/posts/"))
      .map((p: any) => p._id.replace("/posts/", ""));

    const popularPostDocs = await Post.find({
      slug: { $in: postPaths },
      isPublished: true,
    })
      .select("slug title summary publishedDate views")
      .lean();

    const popularPosts = postPaths
      .map((slug: string) => {
        const post = popularPostDocs.find((p: any) => p.slug === slug);
        const pageView = pageViewsAgg.find(
          (p: any) => p._id === `/posts/${slug}`,
        );
        return post
          ? {
              slug: post.slug,
              title: post.title,
              summary: post.summary,
              publishedDate: post.publishedDate?.toISOString() || "",
              views: pageView?.count || 0,
              totalViews: (post as any).views || 0,
            }
          : null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      featuredPost,
      projectPost,
      recentPosts: allRecentPosts,
      popularPosts,
    };
  },
  ["bento-data"],
  { revalidate: 3600, tags: ["posts", "projects"] },
);

function FeaturedPostTile({ post }: { post: PostData }) {
  return (
    <div className="rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] h-full flex flex-col">
      <div className="border-b-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-neutral-800 px-6 py-4 flex items-center justify-between">
        <Badge
          className="rounded-none border-2 border-black px-3 py-1 font-serif text-sm font-bold"
          style={{ backgroundColor: getCategoryColorVar(post.category) }}
        >
          {post.category}
        </Badge>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
          FEATURED POST
        </span>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedDate)}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          )}
        </div>
        <h3 className="font-sans text-2xl md:text-3xl font-bold mb-3 dark:text-white">
          {post.title}
        </h3>
        <p className="font-serif text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-4">
          {post.summary}
        </p>
        <div className="mt-auto">
          <Link href={`/posts/${post.slug}`}>
            <Button className="rounded-none border-2 border-black dark:border-gray-700 bg-primary px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(107,114,128,0.3)]">
              Read Post <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProjectTile({ project }: { project: ProjectData }) {
  return (
    <div className="rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] h-full flex flex-col">
      <div className="border-b-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-neutral-800 px-5 py-3 flex items-center justify-between">
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <LiveStatusDot />
          Currently Building
        </span>
        <Badge
          variant="outline"
          className="rounded-none border-2 border-black dark:border-gray-700 bg-primary text-white text-xs font-bold px-2 py-0.5"
        >
          {project.status}
        </Badge>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-sans text-xl font-bold leading-tight dark:text-white">
            {project.name}
          </h3>
        </div>

        <p className="font-serif text-base text-gray-700 dark:text-gray-400 leading-relaxed mb-4 line-clamp-5">
          {project.description}
        </p>

        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.map((tech) => (
              <code
                key={tech}
                className="rounded-none border border-black/25 dark:border-gray-600 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </code>
            ))}
          </div>
        )}

        {/* CTA buttons — 2-col grid */}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center justify-center gap-2 rounded-none border-2 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-neutral-800 px-4 py-2.5 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)]"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Read the Story
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-neutral-800 px-4 py-2.5 text-xs font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)]"
            >
              <Github className="h-3.5 w-3.5" />
              View Source on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-800 px-4 py-2.5 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export async function LandingBento() {
  const { featuredPost, projectPost, recentPosts, popularPosts } =
    await getBentoData();

  return (
    <section className="mb-12 md:mb-16" id="bento-content">
      <div className="mb-6 md:mb-8">
        <h2 className="font-sans text-2xl md:text-3xl font-bold dark:text-white">
          Latest from the blog
        </h2>
      </div>

      <BentoGrid>
        {featuredPost && (
          <BentoCard className="md:col-span-2 flex flex-col">
            <PrefetchLink
              href={`/posts/${featuredPost.slug}`}
              className="flex-1 flex flex-col"
            >
              <FeaturedPostTile post={featuredPost} />
            </PrefetchLink>
          </BentoCard>
        )}

        <BentoCard
          className={`flex flex-col ${featuredPost ? "" : "md:col-span-1"}`}
        >
          <PopularPosts posts={popularPosts} />
        </BentoCard>

        {projectPost && (
          <BentoCard className="flex flex-col">
            <ProjectTile project={projectPost} />
          </BentoCard>
        )}

        {recentPosts.slice(0, 2).map((post) => (
          <BentoCard key={post._id} className="flex flex-col">
            <PrefetchLink
              href={`/posts/${post.slug}`}
              className="flex-1 flex flex-col"
            >
              <BlogCard post={post} />
            </PrefetchLink>
          </BentoCard>
        ))}
      </BentoGrid>
    </section>
  );
}
