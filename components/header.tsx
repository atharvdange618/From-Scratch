"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Moon, Search, Sun, Menu, X } from "@deemlol/next-icons";

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/blogs", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-bold hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4 transition-colors ${
                      isActiveLink(link.href)
                        ? "text-[#FF9149] underline decoration-4 underline-offset-4"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
            className="h-10 w-10 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-4 border-black bg-white p-0 [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation links to different sections of the website
              </SheetDescription>

              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b-4 border-black p-6">
                  <span className="text-xl font-bold" aria-hidden="true">
                    Menu
                  </span>
                  <Button
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-8 w-8 rounded-none border-2 border-black bg-white p-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block rounded-none border-4 border-black px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            isActiveLink(link.href)
                              ? "bg-[#FF9149] text-white"
                              : "bg-white hover:bg-[#AFDDFF]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer with Auth */}
                <div className="border-t-4 border-black p-6">
                  <div className="flex items-center justify-between">
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
              </div>
            </SheetContent>
          </Sheet>
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
