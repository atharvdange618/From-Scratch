/**
 * Calculate reading time for markdown content
 * @param content - Markdown content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  // Strip markdown syntax
  const plainText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]*`/g, "")
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove headings markers
    .replace(/#{1,6}\s/g, "")
    // Remove bold/italic markers
    .replace(/[*_]{1,2}/g, "")
    // Remove blockquotes
    .replace(/>\s/g, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "");

  // Count words (split by whitespace and filter empty strings)
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate reading time
  const minutes = Math.ceil(words / wordsPerMinute);

  // Format output
  if (minutes < 1) {
    return "< 1 min read";
  } else if (minutes === 1) {
    return "1 min read";
  } else {
    return `${minutes} min read`;
  }
}
