"use client";

import { useState, lazy, Suspense, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Copy, Check, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then((mod) => ({
    default: mod.Prism,
  })),
);

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
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const isPlainDiagram =
    !language || ["text", "plain", "ascii", "none"].includes(language);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPlainDiagram) {
    return (
      <pre className="my-6 overflow-x-auto rounded-md border border-zinc-200 dark:border-gray-700 bg-zinc-50 dark:bg-neutral-900 p-4 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div className="group relative my-6 font-mono not-prose">
      <div className="overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 bg-[#18181b]">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-neutral-800 dark:bg-zinc-900 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56] border border-black/10 dark:border-white/10"></div>
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-black/10 dark:border-white/10"></div>
              <div className="h-3 w-3 rounded-full bg-[#27c93f] border border-black/10 dark:border-white/10"></div>
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-gray-500 bg-neutral-800 dark:bg-zinc-800 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 dark:text-zinc-300">
              <Terminal className="h-3 w-3" />
              {language}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium text-zinc-200 dark:text-gray-300 hover:bg-zinc-700 dark:hover:bg-neutral-700 hover:text-white dark:hover:text-white"
          >
            {copied ? (
              <span className="flex items-center text-green-600">
                <Check className="mr-1 h-3.5 w-3.5" />
              </span>
            ) : (
              <span className="flex items-center">
                <Copy className="mr-1 h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </div>

        <div className="relative">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-6 text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading syntax highlighter...</span>
              </div>
            }
          >
            <LazyCodeHighlight code={code} language={language} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function LazyCodeHighlight({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [highlightState, setHighlightState] = useState<{
    mounted: boolean;
    style: any;
  }>({
    mounted: false,
    style: null,
  });

  useEffect(() => {
    let ignore = false;
    import("react-syntax-highlighter/dist/esm/styles/prism").then((mod) => {
      if (!ignore) setHighlightState({ mounted: true, style: mod.dracula });
    });
    return () => {
      ignore = true;
    };
  }, []);

  const safeLanguage = language || "javascript";

  if (!highlightState.mounted || !highlightState.style) {
    return (
      <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-zinc-300 bg-zinc-950">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <SyntaxHighlighter
      language={safeLanguage}
      style={highlightState.style}
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
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-anchor"],
              },
            },
          ],
        ]}
        components={{
          pre: ({ children }: any) => <>{children}</>,
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const hasNewline = String(children).includes("\n");

            const isInline = !match && !hasNewline;

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:text-zinc-200"
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
