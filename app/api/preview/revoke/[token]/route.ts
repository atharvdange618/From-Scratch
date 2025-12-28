import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { checkAdminAccess } from "@/lib/auth";

// Delete/revoke a preview token
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const { token } = await params;

    await connectDB();

    // Find post with this token
    const post = await Post.findOne({
      "previewTokens.token": token,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Preview token not found" },
        { status: 404 }
      );
    }

    // Remove the token
    post.previewTokens = post.previewTokens.filter((t) => t.token !== token);
    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: "Preview token revoked successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revoking preview token:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
