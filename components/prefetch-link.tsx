"use client";

import { useRouter } from "next/navigation";

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  onMouseEnter?: () => void;
}

export function PrefetchLink({
  href,
  children,
  onMouseEnter,
}: PrefetchLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href);
    onMouseEnter?.();
  };

  return <div onMouseEnter={handleMouseEnter}>{children}</div>;
}
