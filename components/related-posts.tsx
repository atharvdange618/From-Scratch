import Link from "next/link";
import mongoose from "mongoose";
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
import { getCategoryColor } from "@/lib/categories";
import connectDB from "@/lib/mongodb";
import { Post, ensureModelsLoaded } from "@/lib/model-registry";

interface PostData {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  readingTime?: string;
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

const getRelatedPostsFromDB = async (
  currentPostId: string,
  currentCategory: string,
  currentTags: string[],
  linkedProjectId?: string,
): Promise<PostData[]> => {
  await connectDB();
  ensureModelsLoaded();

  const relatedPosts = await Post.aggregate([
    {
      $match: {
        isPublished: true,
        _id: { $ne: new mongoose.Types.ObjectId(currentPostId) },
        $or: [
          { category: currentCategory },
          { tags: { $in: currentTags } },
          ...(linkedProjectId
            ? [{ linkedProject: new mongoose.Types.ObjectId(linkedProjectId) }]
            : []),
        ],
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $cond: [{ $eq: ["$category", currentCategory] }, 3, 0] },
            {
              $multiply: [
                { $size: { $setIntersection: ["$tags", currentTags] } },
                2,
              ],
            },
            {
              $cond: [
                {
                  $eq: [
                    "$linkedProject",
                    linkedProjectId
                      ? new mongoose.Types.ObjectId(linkedProjectId)
                      : null,
                  ],
                },
                2,
                0,
              ],
            },
            {
              $cond: [
                {
                  $gte: [
                    "$publishedDate",
                    new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $match: {
        score: { $gte: 2 },
      },
    },
    {
      $sort: {
        score: -1,
        publishedDate: -1,
      },
    },
    {
      $limit: 4,
    },
    {
      $project: {
        title: 1,
        slug: 1,
        summary: 1,
        readingTime: 1,
        category: 1,
        tags: 1,
        publishedDate: 1,
        linkedProject: 1,
        score: 1,
      },
    },
  ]);

  await Post.populate(relatedPosts, {
    path: "linkedProject",
    select: "_id name",
  });

  if (relatedPosts.length === 0) {
    const recentPosts = await Post.find({
      isPublished: true,
      _id: { $ne: new mongoose.Types.ObjectId(currentPostId) },
    })
      .sort({ publishedDate: -1 })
      .limit(3)
      .select(
        "title slug summary content category tags publishedDate linkedProject",
      )
      .populate("linkedProject", "_id name")
      .lean();

    return recentPosts.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
      publishedDate: post.publishedDate.toISOString(),
      linkedProject: post.linkedProject
        ? {
            _id: post.linkedProject._id.toString(),
            name: post.linkedProject.name,
          }
        : undefined,
    }));
  }

  return relatedPosts.map((post: any) => ({
    ...post,
    _id: post._id.toString(),
    publishedDate: post.publishedDate.toISOString(),
    linkedProject: post.linkedProject
      ? {
          _id: post.linkedProject._id.toString(),
          name: post.linkedProject.name,
        }
      : undefined,
  }));
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
      <div className="mb-8 rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(74,144,204,0.3)]">
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
            <Card className="group h-full overflow-hidden rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(74,144,204,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(74,144,204,0.3)]">
              <CardHeader
                className="border-b-2 border-black dark:border-gray-700 p-4"
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
                    {post.readingTime || "Quick read"}
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

              <CardFooter className="border-t-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <Button className="w-full rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-primary px-4 py-2 font-bold text-white dark:text-black transition-all group-hover:translate-x-1 group-hover:translate-y-1">
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
