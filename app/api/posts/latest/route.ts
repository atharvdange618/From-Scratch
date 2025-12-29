import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { calculateReadingTime } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

// Public API endpoint for latest blog posts
export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find({ isPublished: true })
      .sort({ publishedDate: -1 })
      .limit(5)
      .select("title slug summary publishedDate category tags content")
      .lean();

    const postsWithReadingTime = posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      publishedDate: post.publishedDate,
      category: post.category,
      tags: post.tags,
      readingTime: calculateReadingTime(post.content),
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://built-from-scratch.vercel.app"
      }/posts/${post.slug}`,
    }));

    return NextResponse.json(
      {
        success: true,
        count: postsWithReadingTime.length,
        data: postsWithReadingTime,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch latest posts" },
      { status: 500 }
    );
  }
}
