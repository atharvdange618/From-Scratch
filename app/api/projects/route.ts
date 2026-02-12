import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { checkAdminAccess } from "@/lib/auth";
import { createProjectSchema } from "@/lib/validations/api-schemas";
import { logger } from "@/lib/logger";

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
    logger.error("Error fetching projects", error, {
      context: "API /projects GET",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
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

    const validatedData = createProjectSchema.parse(body);

    const project = await Project.create(validatedData);

    return NextResponse.json({ success: true, data: project }, { status: 201 });
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

    logger.error("Error creating project", error, {
      context: "API /projects POST",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
