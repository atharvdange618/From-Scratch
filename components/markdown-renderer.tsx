"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  truncate?: number;
}

/**
 * Reusable markdown renderer component with optional truncation
 * @param content - The markdown content to render
 * @param className - Additional CSS classes
 * @param truncate - Number of characters to truncate to (adds "...")
 */
export function MarkdownRenderer({
  content,
  className = "",
  truncate,
}: MarkdownRendererProps) {
  let displayContent = content;

  if (truncate && content.length > truncate) {
    displayContent = `${content.substring(0, truncate)}...`;
  }

  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}
