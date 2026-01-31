import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Project from "@/lib/models/Project";

export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();

    const publishedPostsCount = await Post.countDocuments({
      isPublished: true,
    });
    const projectsCount = await Project.countDocuments({});

    return NextResponse.json(
      {
        success: true,
        posts: publishedPostsCount,
        projects: projectsCount,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
