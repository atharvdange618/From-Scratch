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
 * Category color mapping for UI elements (light mode)
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
 * Category color mapping for dark mode
 */
export const CATEGORY_COLORS_DARK: Record<PostCategory, string> = {
  "JavaScript & Web APIs": "#4A90CC",
  "Git & Version Control": "#D47438",
  "Web Development": "#3B82C4",
  "Frameworks & Tools": "#2D8B6E",
  "Software Engineering": "#C4824A",
  "Project Logs": "#4A90CC",
};

/**
 * CSS variable names for each category (used for automatic dark mode switching)
 */
export const CATEGORY_CSS_VARS: Record<PostCategory, string> = {
  "JavaScript & Web APIs": "--cat-js",
  "Git & Version Control": "--cat-git",
  "Web Development": "--cat-web",
  "Frameworks & Tools": "--cat-fw",
  "Software Engineering": "--cat-se",
  "Project Logs": "--cat-logs",
};

/**
 * Get the color for a given category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as PostCategory] || "#AFDDFF";
}

/**
 * Get the CSS variable reference for a category (auto-adapts to dark mode)
 */
export function getCategoryColorVar(category: string): string {
  const varName = CATEGORY_CSS_VARS[category as PostCategory] || "--cat-web";
  return `var(${varName})`;
}

/**
 * Get all categories including "all" option for filters
 */
export function getCategoriesWithAll(): string[] {
  return ["all", ...POST_CATEGORIES];
}
