import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { revalidatePost, revalidatePosts } from "@/lib/cache";
import { updatePostSchema } from "@/lib/validations/api-schemas";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

// GET /api/posts/[slug] - Get a single post by slug
export async function GET(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    await connectDB();

    const { slug } = await segmentData.params;
    const post = await Post.findOne({ slug }).populate("linkedProject").lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    const { userId } = await auth();
    if (!post.isPublished && !userId) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: post },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/posts/[slug] - Update a post (protected)
export async function PUT(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const body = await request.json();

    const validatedData = updatePostSchema.parse(body);

    const post = await Post.findOneAndUpdate({ slug }, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    await revalidatePost(slug);

    return NextResponse.json({ success: true, data: post });
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

    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[slug] - Delete a post (protected)
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    await revalidatePosts();

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
