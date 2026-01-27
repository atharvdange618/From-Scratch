export function calculateWordCount(content: string): number {
  if (!content) {
    return 0;
  }

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

  // Count words
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return words;
}
