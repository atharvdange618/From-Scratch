import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Project from "@/lib/models/Project";
import { logger } from "@/lib/logger";

interface SearchResult {
  type: "post" | "project";
  item: any;
  score: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { message: "Query must be at least 2 characters" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const posts = await Post.find(
      {
        isPublished: true,
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .lean();

    const projects = await Project.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .lean();

    const results: SearchResult[] = [
      ...posts.map((post: any) => ({
        type: "post" as const,
        item: {
          ...post,
          _id: post._id.toString(),
          linkedProject: post.linkedProject?.toString(),
        },
        score: post.score || 0,
      })),
      ...projects.map((project: any) => ({
        type: "project" as const,
        item: {
          ...project,
          _id: project._id.toString(),
        },
        score: project.score || 0,
      })),
    ].sort((a, b) => b.score - a.score);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
