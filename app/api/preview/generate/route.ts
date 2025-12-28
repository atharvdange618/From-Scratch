import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { checkAdminAccess } from "@/lib/auth";
import { randomBytes } from "crypto";

// Generate a preview token for unpublished posts
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Only allow preview tokens for unpublished posts
    if (post.isPublished) {
      return NextResponse.json(
        {
          success: false,
          message: "Preview tokens are only available for unpublished drafts",
        },
        { status: 400 }
      );
    }

    // Generate a unique token
    const token = randomBytes(32).toString("hex");
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Add the token to the post's previewTokens array
    post.previewTokens.push({
      token,
      createdAt,
      expiresAt,
    });

    await post.save();

    // Generate the preview URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const previewUrl = `${baseUrl}/preview/${token}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          previewUrl,
          expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating preview token:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
