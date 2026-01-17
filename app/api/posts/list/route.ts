import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export async function GET() {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await dbConnect();

    const posts = await Post.find({})
      .select("_id title slug isPublished createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const postsWithStringId = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return NextResponse.json({ posts: postsWithStringId });
  } catch (error) {
    console.error("Error fetching posts list:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
