import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { checkAdminAccess } from "@/lib/auth";

type Params = Promise<{ id: string }>;

// GET /api/posts/id/[id] - Get a single post by ID
export async function GET(segmentData: { params: Params }) {
  try {
    await connectDB();

    const { id } = await segmentData.params;
    const post = await Post.findById(id).populate("linkedProject").lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/posts/id/[id] - Update a post by ID (admin only)
export async function PUT(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { id } = await segmentData.params;
    const body = await request.json();

    const post = await Post.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("linkedProject");

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/id/[id] - Delete a post (admin only)
export async function DELETE(segmentData: { params: Params }) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { id } = await segmentData.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
