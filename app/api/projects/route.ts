import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { checkAdminAccess } from "@/lib/auth";

// GET /api/projects - Get all projects (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");

    const query: any = {};

    if (featured === "true") {
      query.featured = true;
    }

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const body = await request.json();
    const project = await Project.create(body);

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
