import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { updateProjectSchema } from "@/lib/validations/api-schemas";
import { logger } from "@/lib/logger";
import { checkAdminAccess } from "@/lib/auth";

type Params = Promise<{ slug: string }>;

// GET /api/projects/[slug] - Get a single project by slug
export async function GET(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    await connectDB();

    const { slug } = await segmentData.params;
    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    logger.error("Error fetching project", error, {
      context: "API /projects/[slug] GET",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/projects/[slug] - Update a project (protected)
export async function PUT(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const body = await request.json();

    const validatedData = updateProjectSchema.parse(body);

    const project = await Project.findOneAndUpdate({ slug }, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: project });
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

    logger.error("Error updating project", error, {
      context: "API /projects/[slug] PUT",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[slug] - Delete a project (protected)
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params },
) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    logger.error("Error deleting project", error, {
      context: "API /projects/[slug] DELETE",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
