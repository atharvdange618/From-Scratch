import { revalidatePath } from "next/cache";

/**
 * Revalidate all posts-related caches
 */
export async function revalidatePosts() {
  "use server";
  revalidatePath("/", "layout");
  revalidatePath("/blogs");
}

/**
 * Revalidate a specific post cache
 */
export async function revalidatePost(slug: string) {
  "use server";
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/", "layout");
}

/**
 * Revalidate all caches
 */
export async function revalidateAll() {
  "use server";
  revalidatePath("/", "layout");
}
