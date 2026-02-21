import { revalidatePath } from "next/cache";

/**
 * Revalidate all posts-related caches
 * Called from API routes after creating/updating/deleting posts
 */
export function revalidatePosts() {
  revalidatePath("/", "layout");
  revalidatePath("/blogs", "page");
  revalidatePath("/posts/[slug]", "page");
}

/**
 * Revalidate a specific post cache
 * Called from API routes after updating a post
 */
export function revalidatePost(slug: string) {
  revalidatePath(`/posts/${slug}`, "page");
  revalidatePath("/", "layout");
  revalidatePath("/blogs", "page");
}

/**
 * Revalidate all caches
 */
export function revalidateAll() {
  revalidatePath("/", "layout");
}
