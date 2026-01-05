"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Search, Menu, X } from "@deemlol/next-icons";
import { GlobalSearch } from "./global-search";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAdmin() {
      if (isLoaded && isSignedIn) {
        try {
          const response = await fetch("/api/auth/check-admin");
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [isLoaded, isSignedIn]);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/blogs", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  const adminLinks = [
    { href: "/editor", label: "Editor" },
    { href: "/drafts", label: "Drafts" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
              {isAdmin &&
                adminLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`font-bold hover:text-[#60B5FF] hover:underline hover:decoration-4 hover:underline-offset-4 transition-colors ${
                        isActiveLink(link.href)
                          ? "text-[#60B5FF] underline decoration-4 underline-offset-4"
                          : "text-gray-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              onClick={() => {
                setIsSearchOpen(true);
                trackEvent("search_opened", {});
              }}
              className="group relative h-10 w-10 rounded-none border-4 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Search (Cmd+K)"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search (Ctrl+K)</span>
              <span className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-opacity group-hover:opacity-100">
                Search{" "}
                <kbd className="ml-1 rounded border border-white/20 bg-white/10 px-1">
                  Ctrl + K
                </kbd>
              </span>
            </Button>

            {/* {isSignedIn ? (
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
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="icon"
            onClick={() => {
              setIsSearchOpen(true);
              trackEvent("search_opened", {});
            }}
            className="h-10 w-10 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
                aria-label="Open menu"
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
                <div className="flex items-center justify-between border-b-4 border-black p-6">
                  <span className="text-xl font-bold" aria-hidden="true">
                    Menu
                  </span>
                  <Button
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-10 w-10 rounded-none border-4 border-black bg-[#FF9149] p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149]/80 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                </div>

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
                    {isAdmin &&
                      adminLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block rounded-none border-4 border-black px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                              isActiveLink(link.href)
                                ? "bg-[#60B5FF] text-white"
                                : "bg-gray-100 hover:bg-[#60B5FF] hover:text-white"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
