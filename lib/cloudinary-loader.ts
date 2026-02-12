import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for Cloudinary
 * Uses Cloudinary's own transformation API instead of Next.js image optimization
 * This avoids timeout issues when fetching images from Cloudinary
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.includes("cloudinary.com")) {
    return src;
  }

  const parts = src.split("/upload/");
  if (parts.length !== 2) {
    return src;
  }

  const [baseUrl, imagePath] = parts;

  const transformations = [
    `w_${width}`,
    `q_${quality || 75}`,
    "f_auto",
    "c_limit",
  ];

  return `${baseUrl}/upload/${transformations.join(",")}/${imagePath}`;
}
