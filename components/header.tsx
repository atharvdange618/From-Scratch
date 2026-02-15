"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
// import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useAdminCheckQuery } from "@/lib/hooks/use-admin";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Search, Menu, X, Sun, Moon } from "@deemlol/next-icons";
import { GlobalSearch } from "./global-search";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { data: isAdmin } = useAdminCheckQuery();
  const { theme, setTheme } = useTheme();

  const navLinks = useMemo(
    () => [
      { href: "/about", label: "About" },
      { href: "/blogs", label: "Blog" },
      { href: "/projects", label: "Projects" },
      { href: "/contact", label: "Contact" },
    ],
    [],
  );

  const adminLinks = useMemo(
    () => [
      { href: "/editor", label: "Editor" },
      { href: "/drafts", label: "Drafts" },
      { href: "/dashboard", label: "Dashboard" },
    ],
    [],
  );

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    trackEvent("theme_toggled", { newTheme });
  }, [theme, setTheme]);

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
    trackEvent("search_opened", {});
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <header className="sticky top-0 z-50 w-full border-b-4 border-black dark:border-gray-700 bg-white dark:bg-neutral-900 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 rounded-full border-4 border-black dark:border-gray-700 bg-[#60B5FF] dark:bg-primary">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-xl font-bold dark:text-black">
              FS
            </div>
          </div>
          <span className="text-xl font-bold dark:text-white">
            From Scratch
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav>
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-bold hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4 transition-colors dark:text-gray-200 ${
                      isActiveLink(link.href)
                        ? "text-[#FF9149] dark:text-secondary underline decoration-4 underline-offset-4"
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
                      className={`font-bold hover:text-[#60B5FF] dark:hover:text-primary hover:underline hover:decoration-4 hover:underline-offset-4 transition-colors ${
                        isActiveLink(link.href)
                          ? "text-[#60B5FF] dark:text-primary underline decoration-4 underline-offset-4"
                          : "text-gray-700 dark:text-gray-400"
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
              onClick={handleThemeToggle}
              className="group relative h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149] dark:hover:bg-secondary hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-5 w-5 text-black dark:text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-black dark:text-white" />
                ))}
              <span className="sr-only">Toggle theme</span>
              <span className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-opacity group-hover:opacity-100">
                Toggle theme
              </span>
            </Button>

            <Button
              size="icon"
              onClick={handleSearchOpen}
              className="group relative h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
              aria-label="Search (Cmd+K)"
            >
              <Search className="h-5 w-5 text-black dark:text-white" />
              <span className="sr-only">Search (Ctrl+K)</span>
              <span className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-gray-800 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] transition-opacity group-hover:opacity-100">
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
            onClick={handleThemeToggle}
            className="h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:bg-[#FF9149] dark:hover:bg-secondary hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all"
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="h-5 w-5 text-black dark:text-white" />
              ) : (
                <Moon className="h-5 w-5 text-black dark:text-white" />
              ))}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            size="icon"
            onClick={handleSearchOpen}
            className="h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-black dark:text-white" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 transition-all"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-black dark:text-white" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-4 border-black dark:border-gray-700 bg-white dark:bg-gray-900 p-0 [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation links to different sections of the website
              </SheetDescription>

              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b-4 border-black dark:border-gray-700 p-6">
                  <span
                    className="text-xl font-bold dark:text-white"
                    aria-hidden="true"
                  >
                    Menu
                  </span>
                  <Button
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-secondary p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF9149]/80 dark:hover:bg-secondary/80 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
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
                          className={`block rounded-none border-4 border-black dark:border-gray-700 px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] ${
                            isActiveLink(link.href)
                              ? "bg-[#FF9149] dark:bg-secondary text-white dark:text-black"
                              : "bg-white dark:bg-gray-800 dark:text-white hover:bg-[#AFDDFF] dark:hover:bg-gray-700"
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
                            className={`block rounded-none border-4 border-black dark:border-gray-700 px-6 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] ${
                              isActiveLink(link.href)
                                ? "bg-[#60B5FF] dark:bg-primary text-white dark:text-black"
                                : "bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-[#60B5FF] dark:hover:bg-primary hover:text-white dark:hover:text-black"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>

                  <div className="mt-8 rounded-none border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]">
                    <h3 className="mb-2 text-sm font-bold dark:text-white">
                      ⌨️ Keyboard Shortcuts
                    </h3>
                    <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                      <kbd className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 font-bold text-xs">
                        Ctrl
                      </kbd>
                      <span>+</span>
                      <kbd className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 font-bold text-xs">
                        K
                      </kbd>
                      <span className="text-xs">Quick Search</span>
                    </div>
                  </div>
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
