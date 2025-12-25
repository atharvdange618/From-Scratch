import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

type Params = Promise<{ id: string }>;

// GET /api/posts/id/[id] - Get a single post by ID
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
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

// PUT /api/posts/id/[id] - Update a post by ID (protected)
export async function PUT(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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

// DELETE /api/posts/id/[id] - Delete a post (protected)
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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
