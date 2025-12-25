import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/auth";

// GET /api/auth/check-admin - Check if current user is an admin
export async function GET() {
  const adminCheck = await checkAdminAccess();

  return NextResponse.json({
    isAdmin: adminCheck.authorized,
  });
}
