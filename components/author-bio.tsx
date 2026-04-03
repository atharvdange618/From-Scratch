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
    <div className="my-8 border-t-2 border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          <div className="relative h-16 w-16 rounded-none border-2 border-black dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-700">
            {!imageError ? (
              <Image
                src={authorImage}
                alt={authorName}
                width={64}
                height={64}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {authorName[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-3">
            <p className="font-serif text-sm text-gray-600 dark:text-gray-400 mb-1">
              Written by
            </p>
            <h3 className="font-sans text-lg font-bold dark:text-white mb-2">
              {authorName}
            </h3>
            <p className="font-serif text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Full Stack Engineer specializing in Node.js, TypeScript, and
              React. Building production-grade applications and writing about
              web fundamentals and engineering deep-dives.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="https://atharvdangedev.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline underline-offset-4"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Portfolio
            </Link>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <Link
              href="https://x.com/atharvdangedev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline underline-offset-4"
            >
              <FaXTwitter className="h-3.5 w-3.5" />
              Twitter
            </Link>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline underline-offset-4"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
