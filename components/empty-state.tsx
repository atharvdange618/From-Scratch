import { Search, FolderOpen, FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  type?: "search" | "content" | "default";
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  type = "default",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const icons = {
    search: Search,
    content: FolderOpen,
    default: FileText,
  };

  const Icon = icons[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-none border-2 border-black bg-[#AFDDFF] p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]">
      <Icon className="mb-4 h-16 w-16 text-gray-600 dark:text-gray-400" />
      <h3 className="mb-2 text-2xl font-bold dark:text-white">{title}</h3>
      <p className="mb-6 max-w-md text-gray-700 dark:text-gray-300">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-none border-2 border-black bg-background px-6 py-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-700 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-neutral-600 dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.08)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}