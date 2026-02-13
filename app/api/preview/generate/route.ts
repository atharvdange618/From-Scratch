import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { checkAdminAccess } from "@/lib/auth";
import { randomBytes } from "crypto";
import { generatePreviewTokenSchema } from "@/lib/validations/api-schemas";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

// Generate a preview token for unpublished posts
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const body = await request.json();

    const validatedData = generatePreviewTokenSchema.parse(body);
    const { postId } = validatedData;

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    if (post.isPublished) {
      return NextResponse.json(
        {
          success: false,
          message: "Preview tokens are only available for unpublished drafts",
        },
        { status: 400 },
      );
    }

    const token = randomBytes(32).toString("hex");
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    post.previewTokens.push({
      token,
      createdAt,
      expiresAt,
    });

    await post.save();

    const baseUrl = env.NEXT_PUBLIC_BASE_URL;
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
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    logger.error("Error generating preview token", error, {
      context: "API /preview/generate POST",
    });
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
