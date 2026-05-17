import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Project from "@/lib/models/Project";
import { checkAdminAccess } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/reading-time";
import { revalidatePosts } from "@/lib/cache";
import { createPostSchema } from "@/lib/validations/api-schemas";
import { logger } from "@/lib/logger";

export const revalidate = 86400;

// GET /api/posts - Get all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const category = searchParams.get("category");
    const linkedProject = searchParams.get("linkedProject");
    const isPublished = searchParams.get("isPublished");
    const listView = searchParams.get("listView") === "true";

    const query: any = {};

    if (isPublished === "true") {
      query.isPublished = true;
    } else if (isPublished === "false") {
      query.isPublished = false;
    }

    if (category && category !== "All Posts") {
      query.category = category;
    }

    if (linkedProject) {
      query.linkedProject = linkedProject;
    }

    let posts;

    if (listView) {
      const rawPosts = await Post.find(query)
        .select(
          "_id title slug summary category tags publishedDate isPublished isFeatured createdAt updatedAt linkedProject readingTime",
        )
        .populate({
          path: "linkedProject",
          model: Project,
          select: "_id name slug",
        })
        .sort({ publishedDate: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      posts = rawPosts;
    } else {
      posts = await Post.find(query)
        .populate({
          path: "linkedProject",
          model: Project,
          select: "_id name slug",
        })
        .sort({ publishedDate: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return NextResponse.json(
      { success: true, posts },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error: any) {
    logger.error("Error fetching posts", error, { context: "API /posts GET" });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const body = await request.json();

    const validatedData = createPostSchema.parse(body);

    const readingTime = calculateReadingTime(validatedData.content || "");

    const postData: Record<string, any> = {
      ...validatedData,
      readingTime,
    };

    if (validatedData.isPublished && !validatedData.publishedDate) {
      postData.publishedDate = new Date();
    }

    const post = await Post.create(postData);

    revalidatePosts();

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    logger.error("Error creating post", error, { context: "API /posts POST" });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
