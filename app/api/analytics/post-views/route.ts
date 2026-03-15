import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (slug) {
      const post = await Post.findOne({ slug });
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const uniqueSessions = await AnalyticsEvent.distinct("sessionId", {
        "eventData.path": `/posts/${slug}`,
        timestamp: { $gte: startDate },
      });

      return NextResponse.json({
        slug,
        views: uniqueSessions.length,
        totalViews: post.views || 0,
      });
    }

    const pageViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          "eventData.path": { $regex: "^/posts/", $exists: true },
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { path: "$eventData.path", session: "$sessionId" },
        },
      },
      {
        $group: {
          _id: "$_id.path",
          count: { $sum: 1 },
        },
      },
    ]);

    const postPaths = pageViews
      .filter((p) => p._id?.startsWith("/posts/"))
      .map((p) => p._id.replace("/posts/", ""));

    const posts = await Post.find({
      slug: { $in: postPaths },
      isPublished: true,
    }).select("slug title summary publishedDate views");

    const popularPosts = postPaths
      .map((slug): {
        slug: string;
        title: string;
        summary: string;
        publishedDate: Date | undefined;
        views: number;
        totalViews: number;
      } | null => {
        const post = posts.find((p) => p.slug === slug);
        const pageView = pageViews.find((p) => p._id === `/posts/${slug}`);
        return post
          ? {
              slug: post.slug,
              title: post.title,
              summary: post.summary,
              publishedDate: post.publishedDate,
              views: pageView?.count || 0,
              totalViews: post.views || 0,
            }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 5) as {
      slug: string;
      title: string;
      summary: string;
      publishedDate: Date | undefined;
      views: number;
      totalViews: number;
    }[];

    return NextResponse.json({ popularPosts, periodDays: days });
  } catch (error) {
    console.error("Error fetching post views:", error);
    return NextResponse.json(
      { error: "Failed to fetch post views" },
      { status: 500 }
    );
  }
}
