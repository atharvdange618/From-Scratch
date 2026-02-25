import Link from "next/link";
import { unstable_cache } from "next/cache";
import { PrefetchLink } from "./prefetch-link";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/lib/models/Post";
import { BlogCard } from "./blog-card";

const getRecentPostsFromDB = async () => {
  await connectDB();
  const posts = await Post.find({ isPublished: true })
    .select("-bannerImage -content")
    .sort({ publishedDate: -1, createdAt: -1 })
    .limit(3)
    .lean();
  return posts.map((post: IPost) => ({
    ...post,
    _id: post._id.toString(),
  }));
};

const getRecentPosts = unstable_cache(getRecentPostsFromDB, ["recent-posts"], {
  revalidate: 86400,
  tags: ["posts"],
});

export async function BlogEntries() {
  const posts = await getRecentPosts();

  return (
    <section className="mb-12 md:mb-16" id="recent-posts">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-sans text-2xl md:text-3xl font-bold dark:text-white">
          Recent Posts
        </h2>
        <Link href="/blogs">
          <Button className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-800 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]">
            View All Posts
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PrefetchLink key={post._id} href={`/posts/${post.slug}`}>
            <BlogCard post={post} />
          </PrefetchLink>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-none border-4 border-dashed border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-800 p-16">
          <svg
            className="mb-6 h-48 w-48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="60"
              width="120"
              height="100"
              fill="#60B5FF"
              stroke="#000"
              strokeWidth="4"
            />
            <rect x="60" y="80" width="80" height="8" fill="#000" />
            <rect x="60" y="100" width="60" height="8" fill="#000" />
            <rect x="60" y="120" width="70" height="8" fill="#000" />
            <circle
              cx="100"
              cy="40"
              r="20"
              fill="#FF9149"
              stroke="#000"
              strokeWidth="4"
            />
            <path
              d="M90 35 L95 40 L110 25"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mb-2 text-2xl font-bold dark:text-white">
            No Posts Yet
          </h3>
        </div>
      )}
    </section>
  );
}
