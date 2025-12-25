"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Search, Sun } from "@deemlol/next-icons";

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 rounded-full border-4 border-black bg-[#60B5FF]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-xl font-bold">
              FS
            </div>
          </div>
          <span className="text-xl font-bold">From Scratch</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/about"
                  className="font-bold hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="font-bold hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-bold hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {isSearchOpen ? (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-40 rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:w-60"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              </div>
            ) : (
              <Button
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 rounded-none border-4 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Button
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-10 w-10 rounded-none border-4 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isSignedIn ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-6 h-6",
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="rounded-none border-4 border-black bg-[#60B5FF] px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button
            size="icon"
            className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="container mx-auto px-4 py-2 md:hidden">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-none border-4 border-black bg-white px-3 py-2 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
