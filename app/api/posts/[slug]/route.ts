import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

type Params = Promise<{ slug: string }>;

// GET /api/posts/[slug] - Get a single post by slug
export async function GET(segmentData: { params: Params }) {
  try {
    await connectDB();

    const { slug } = await segmentData.params;
    const post = await Post.findOne({ slug }).populate("linkedProject").lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const { userId } = await auth();
    if (!post.isPublished && !userId) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update a post (protected)
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

    const { slug } = await segmentData.params;
    const body = await request.json();

    const post = await Post.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

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

// DELETE /api/posts/[slug] - Delete a post (protected)
export async function DELETE(segmentData: { params: Params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
