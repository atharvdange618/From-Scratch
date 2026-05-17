"use client";

import { useState } from "react";
import { ExternalLink, Mail } from "@deemlol/next-icons";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

interface AuthorBioProps {
  authorName?: string;
  authorImage?: string;
}

export function AuthorBio({
  authorName = "Atharv Dange",
  authorImage = "/atharv-avatar.jpeg",
}: AuthorBioProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-5 items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-800">
          {!imageError ? (
            <Image
              src={authorImage}
              alt={authorName}
              width={64}
              height={64}
              className="object-cover h-full w-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-zinc-600 dark:text-zinc-400">
                {authorName[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Written by
          </p>
          <h3 className="font-sans text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {authorName}
          </h3>
          <p className="font-serif text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Full Stack Engineer specializing in Node.js, TypeScript, and React.
            Building production-grade applications and writing about web
            fundamentals and engineering deep-dives.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="https://atharvdangedev.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Portfolio</span>
          </Link>
          <Link
            href="https://x.com/atharvdangedev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-[#1DA1F2] dark:text-zinc-400 dark:hover:text-[#1DA1F2] transition-colors"
          >
            <FaXTwitter className="h-4 w-4" />
            <span>Twitter</span>
          </Link>
          <Link
            href="/contact"
            className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
