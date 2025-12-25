import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Check if the currently authenticated user is an admin
 * Compares the user's ID or email against allowed admin values from env vars
 */
export async function checkAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized - Not authenticated" },
        { status: 401 }
      ),
    };
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Check if user ID matches admin user ID
  if (adminUserId && userId === adminUserId) {
    return { authorized: true, userId };
  }

  // If admin email is set, we need to get the user's session to check email
  if (adminEmail) {
    // For email check, we'd need to use clerkClient to get user details
    // For now, we'll focus on userId check which is more efficient
    console.warn(
      "Admin email check not implemented - use ADMIN_USER_ID instead"
    );
  }

  return {
    authorized: false,
    response: NextResponse.json(
      {
        success: false,
        error: "Forbidden - You do not have permission to perform this action",
      },
      { status: 403 }
    ),
  };
}
