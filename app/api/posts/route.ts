import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Project from "@/lib/models/Project";
import { checkAdminAccess } from "@/lib/auth";

// GET /api/posts - Get all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const linkedProject = searchParams.get("linkedProject");
    const isPublished = searchParams.get("isPublished");

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

    const posts = await Post.find(query)
      .populate({ path: "linkedProject", model: Project })
      .sort({ publishedDate: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
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
    const post = await Post.create(body);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
