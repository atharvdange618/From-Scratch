import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Project from "@/lib/models/Project";
import { logger } from "@/lib/logger";

export const revalidate = 86400;

export async function GET() {
  try {
    await connectDB();

    const publishedPostsCount = await Post.countDocuments({
      isPublished: true,
    });
    const projectsCount = await Project.countDocuments({});
    const categories = await Post.distinct("category", {
      isPublished: true,
    });

    return NextResponse.json(
      {
        success: true,
        posts: publishedPostsCount,
        projects: projectsCount,
        categories: categories.length,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error: any) {
    logger.error("Error fetching stats", error, { context: "API /stats GET" });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
