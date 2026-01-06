/**
 * Centralized category configuration
 * Single source of truth for blog post categories and their styling
 */

export const POST_CATEGORIES = [
  "JavaScript & Web APIs",
  "Git & Version Control",
  "Web Development",
  "Frameworks & Tools",
  "Software Engineering",
  "Project Logs",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

/**
 * Category color mapping for UI elements
 * Colors follow the neobrutalism design system
 */
export const CATEGORY_COLORS: Record<PostCategory, string> = {
  "JavaScript & Web APIs": "#60B5FF",
  "Git & Version Control": "#FF9149",
  "Web Development": "#AFDDFF",
  "Frameworks & Tools": "#E0FFF1",
  "Software Engineering": "#FFECDB",
  "Project Logs": "#60B5FF",
};

/**
 * Get the color for a given category
 * @param category - The post category
 * @returns The hex color code for the category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as PostCategory] || "#AFDDFF";
}

/**
 * Get all categories including "all" option for filters
 * @returns Array of categories with "all" prepended
 */
export function getCategoriesWithAll(): string[] {
  return ["all", ...POST_CATEGORIES];
}
