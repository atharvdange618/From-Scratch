import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { checkAdminAccess } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess();

    if (!adminCheck.authorized) {
      return adminCheck.response;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 413 },
      );
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "from-scratch",
            resource_type: "auto",
            transformation: [{ quality: "auto:good", fetch_format: "auto" }],
            eager: [
              {
                width: 1200,
                quality: "auto:good",
                fetch_format: "auto",
                crop: "limit",
              },
              {
                width: 800,
                quality: "auto:good",
                fetch_format: "auto",
                crop: "limit",
              },
            ],
            eager_async: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    logger.error("Error uploading image", error, {
      context: "API /upload POST",
    });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
