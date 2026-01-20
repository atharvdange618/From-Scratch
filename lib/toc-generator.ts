import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = markdown.split("\n");
  const slugger = new GithubSlugger();

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let text = match[2];

      text = text
        .replace(/`([^`]+)`/g, "$1") // Remove inline code backticks
        .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markers
        .replace(/\*([^*]+)\*/g, "$1") // Remove italic markers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract link text
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .trim();

      if (text) {
        const id = slugger.slug(text);
        headings.push({ id, text, level });
      }
    }
  }

  return headings;
}
