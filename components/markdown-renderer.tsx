"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  truncate?: number;
}

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "bash";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 font-mono">
      <div className="overflow-hidden rounded-md border-2 border-black bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-black bg-zinc-100 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 border border-black/20"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 border border-black/20"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 border border-black/20"></div>
            </div>

            <div className="flex items-center gap-1.5 rounded-sm border border-black/10 bg-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-zinc-600">
              <Terminal className="h-3 w-3" />
              {language}
            </div>
          </div>

          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-black"
          >
            {copied ? (
              <span className="flex items-center text-green-600">
                <Check className="mr-1 h-3.5 w-3.5" />
                Copied
              </span>
            ) : (
              <span className="flex items-center">
                <Copy className="mr-1 h-3.5 w-3.5" />
                Copy
              </span>
            )}
          </Button>
        </div>

        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={dracula}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: "#18181b",
              padding: "1.5rem",
              fontSize: "0.875rem",
              lineHeight: "1.6",
            }}
            lineNumberStyle={{
              minWidth: "2em",
              paddingRight: "1em",
              color: "#52525b",
              textAlign: "right",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  className = "",
  truncate,
}: MarkdownRendererProps) {
  if (!content) return null;

  let displayContent = content;
  if (truncate && content.length > truncate) {
    displayContent = `${content.substring(0, truncate)}...`;
  }

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-sm font-medium text-pink-600"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            );
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}
