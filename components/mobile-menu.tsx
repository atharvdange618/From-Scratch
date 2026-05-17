import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, X } from "@deemlol/next-icons";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navLinks: { href: string; label: string }[];
  adminLinks: { href: string; label: string }[];
  isAdmin: boolean;
  isActiveLink: (href: string) => boolean;
}

export function MobileMenu({
  isOpen,
  setIsOpen,
  navLinks,
  adminLinks,
  isAdmin,
  isActiveLink,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="h-10 w-10 rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] hover:bg-[#AFDDFF] dark:hover:bg-neutral-700 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <Menu className="h-5 w-5 text-black dark:text-white" />
          <span className="sr-only">{isOpen ? "Close" : "Menu"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] border-l-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 p-0 [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation links to different sections of the website
        </SheetDescription>

        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-gray-700 p-6">
            <span
              className="text-xl font-bold dark:text-white"
              aria-hidden="true"
            >
              Menu
            </span>
            <Button
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 rounded-none border-2 border-black dark:border-gray-700 bg-secondary p-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-secondary/80 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)]"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5 text-black dark:text-black" />
            </Button>
          </div>

          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as any}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-none border-2 border-black dark:border-gray-700 px-6 py-3 text-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)] ${
                      isActiveLink(link.href)
                        ? "bg-secondary text-black dark:text-white"
                        : "bg-background dark:bg-neutral-800 dark:text-white hover:bg-[#AFDDFF] dark:hover:bg-neutral-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <>
                  <li className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-[2px] flex-1 bg-black dark:bg-neutral-700" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Admin
                      </span>
                      <div className="h-[2px] flex-1 bg-black dark:bg-neutral-700" />
                    </div>
                  </li>
                  {adminLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href as any}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-none border-2 border-black dark:border-gray-700 px-6 py-3 text-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1.5px_1.5px_0px_0px_rgba(107,114,128,0.3)] ${
                          isActiveLink(link.href)
                            ? "bg-primary text-white dark:text-white"
                            : "bg-gray-100 dark:bg-neutral-800 dark:text-white hover:bg-primary hover:text-white dark:hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>

            <div className="mt-8 rounded-none border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-neutral-800 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]">
              <h3 className="mb-2 text-sm font-bold dark:text-white">
                ⌨️ Keyboard Shortcuts
              </h3>
              <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                <kbd className="rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 px-2 py-1 font-bold text-xs">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="rounded-none border-2 border-black dark:border-gray-700 bg-background dark:bg-neutral-900 px-2 py-1 font-bold text-xs">
                  K
                </kbd>
                <span className="text-xs">Quick Search</span>
              </div>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
