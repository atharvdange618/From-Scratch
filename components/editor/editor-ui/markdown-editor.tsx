"use client";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  className,
  minHeight = 400,
}: MarkdownEditorProps) {
  const { theme } = useTheme();

  return (
    <div className={cn("relative rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[600px] overflow-y-auto", className)}>
      <CodeEditor
        value={value}
        language="markdown"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        padding={16}
        minHeight={minHeight}
        data-color-mode={theme === "dark" ? "dark" : "light"}
        style={{
          fontSize: 14,
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
        className="w-full rounded-none"
      />
    </div>
  );
}
