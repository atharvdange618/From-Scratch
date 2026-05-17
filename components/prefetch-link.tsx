"use client";

import { useRouter } from "next/navigation";

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}

export function PrefetchLink({
  href,
  children,
  className,
  onMouseEnter,
}: PrefetchLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href as any);
    onMouseEnter?.();
  };

  return (
    <div className={className} onMouseEnter={handleMouseEnter}>
      {children}
    </div>
  );
}
