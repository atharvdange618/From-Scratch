"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 font-medium text-gray-600 transition-colors hover:text-[#60B5FF] hover:underline"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium text-gray-600 transition-colors hover:text-[#60B5FF] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-bold text-black"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
