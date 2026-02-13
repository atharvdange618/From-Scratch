import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * Check if the currently authenticated user is an admin
 * Compares the user's ID or email against allowed admin values from env vars
 */
export async function checkAdminAccess() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized - Not authenticated" },
        { status: 401 },
      ),
    };
  }

  const adminUserId = env.ADMIN_USER_ID;
  const adminEmail = env.ADMIN_EMAIL;
  const userEmail = sessionClaims?.email as string | undefined;

  const isAdminById = adminUserId && userId === adminUserId;
  const isAdminByEmail =
    adminEmail &&
    userEmail &&
    userEmail.toLowerCase() === adminEmail.toLowerCase();

  if (isAdminById || isAdminByEmail) {
    return { authorized: true, userId };
  }

  return {
    authorized: false,
    response: NextResponse.json(
      {
        success: false,
        error: "Forbidden - You do not have permission to perform this action",
      },
      { status: 403 },
    ),
  };
}
