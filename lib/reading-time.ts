import { calculateWordCount } from "./word-count";

/**
 * Calculate reading time for markdown content
 * @param content - Markdown content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): string {
  const words = calculateWordCount(content);

  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) {
    return "< 1 min read";
  } else if (minutes === 1) {
    return "1 min read";
  } else {
    return `${minutes} min read`;
  }
}
