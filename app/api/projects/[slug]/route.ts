import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";

type Params = Promise<{ slug: string }>;

// GET /api/projects/[slug] - Get a single project by slug
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    await connectDB();

    const { slug } = await segmentData.params;
    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[slug] - Update a project (protected)
export async function PUT(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const body = await request.json();

    const project = await Project.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[slug] - Delete a project (protected)
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Params }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { slug } = await segmentData.params;
    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
