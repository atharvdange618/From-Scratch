import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";

export async function GET() {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await dbConnect();

    const projects = await Project.find({})
      .select("_id name slug status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const projectsWithStringId = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
    }));

    return NextResponse.json({ projects: projectsWithStringId });
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
