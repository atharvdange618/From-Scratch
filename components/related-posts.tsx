import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";
import { getCategoryColor } from "@/lib/categories";
import connectDB from "@/lib/mongodb";
import { Post, ensureModelsLoaded } from "@/lib/model-registry";

interface PostData {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedDate: string;
  linkedProject?: {
    _id: string;
    name: string;
  };
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory: string;
  currentTags: string[];
  linkedProjectId?: string;
}

interface ScoredPost extends PostData {
  score: number;
}

const getRelatedPostsFromDB = async (
  currentPostId: string,
  currentCategory: string,
  currentTags: string[],
  linkedProjectId?: string,
): Promise<PostData[]> => {
  await connectDB();

  // Ensure all models are registered before populate
  ensureModelsLoaded();

  const allPosts = await Post.find({
    isPublished: true,
    _id: { $ne: currentPostId },
  })
    .select(
      "title slug summary content category tags publishedDate linkedProject",
    )
    .populate("linkedProject", "_id name")
    .lean();

  const scoredPosts: ScoredPost[] = allPosts.map((post: any) => {
    let score = 0;

    if (post.category === currentCategory) {
      score += 3;
    }

    const sharedTags = post.tags.filter((tag: string) =>
      currentTags.includes(tag),
    );
    score += sharedTags.length * 2;

    if (
      linkedProjectId &&
      post.linkedProject?._id?.toString() === linkedProjectId
    ) {
      score += 2;
    }

    const daysDiff =
      (new Date().getTime() - new Date(post.publishedDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysDiff <= 60) {
      score += 1;
    }

    return {
      ...post,
      _id: post._id.toString(),
      linkedProject: post.linkedProject
        ? {
            _id: post.linkedProject._id.toString(),
            name: post.linkedProject.name,
          }
        : undefined,
      score,
    };
  });

  const topPosts = scoredPosts
    .sort((a, b) => b.score - a.score)
    .filter((p) => p.score >= 2)
    .slice(0, 4);

  if (topPosts.length === 0) {
    const recentPosts = scoredPosts
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      )
      .slice(0, 3);
    return recentPosts;
  }

  return topPosts;
};

export async function RelatedPosts({
  currentPostId,
  currentCategory,
  currentTags,
  linkedProjectId,
}: RelatedPostsProps) {
  const relatedPosts = await getRelatedPostsFromDB(
    currentPostId,
    currentCategory,
    currentTags,
    linkedProjectId,
  );

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-16">
      <div className="mb-8 rounded-none border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-gray-800 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)]">
        <h2 className="font-sans text-2xl font-bold md:text-3xl dark:text-white">
          You Might Also Like
        </h2>
        <p className="mt-2 font-serif text-gray-700 dark:text-gray-300">
          Related posts based on tags, category, and projects
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <Card className="group h-full overflow-hidden rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(96,181,255,0.3)]">
              <CardHeader
                className="border-b-4 border-black dark:border-gray-700 p-4"
                style={{ backgroundColor: getCategoryColor(post.category) }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge className="rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-bold text-black dark:text-white hover:bg-white dark:hover:bg-gray-800">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold leading-tight dark:text-black">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4">
                <p className="mb-4 line-clamp-2 font-serif text-sm text-gray-700 dark:text-gray-300">
                  {post.summary}
                </p>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2 py-1 text-xs font-bold">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedDate)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2 py-1 text-xs font-bold">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTime(post.content)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-700 px-2 py-0.5 text-xs font-bold dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="inline-block rounded-lg border-2 border-black dark:border-gray-700 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 text-xs font-bold dark:text-white">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <Button className="w-full rounded-none border-4 border-black dark:border-gray-700 bg-black dark:bg-primary px-4 py-2 font-bold text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,145,73,0.5)] transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)] dark:group-hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,0.5)]">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
