import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

// Get post by preview token (with auto-cleanup of expired tokens)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    await connectDB();

    // Find post with this token
    const post = await Post.findOne({
      "previewTokens.token": token,
    }).populate("linkedProject");

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Invalid preview token" },
        { status: 404 }
      );
    }

    // Find the specific token
    const previewToken = post.previewTokens.find((t) => t.token === token);

    if (!previewToken) {
      return NextResponse.json(
        { success: false, message: "Invalid preview token" },
        { status: 404 }
      );
    }

    // Check if token has expired
    const now = new Date();
    if (now > previewToken.expiresAt) {
      // Auto-delete expired token
      post.previewTokens = post.previewTokens.filter((t) => t.token !== token);
      await post.save();

      return NextResponse.json(
        { success: false, message: "This preview link has expired" },
        { status: 410 }
      );
    }

    // Clean up any other expired tokens
    const activeTokens = post.previewTokens.filter((t) => now <= t.expiresAt);
    if (activeTokens.length !== post.previewTokens.length) {
      post.previewTokens = activeTokens;
      await post.save();
    }

    // Check if post is published
    if (post.isPublished) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This post is now published and no longer needs a preview link",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          post,
          expiresAt: previewToken.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching preview:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
