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
    <div className="flex flex-col items-center justify-center rounded-none border-4 border-black bg-[#AFDDFF] p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <Icon className="mb-4 h-16 w-16 text-gray-600" />
      <h3 className="mb-2 text-2xl font-bold">{title}</h3>
      <p className="mb-6 max-w-md text-gray-700">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-none border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
