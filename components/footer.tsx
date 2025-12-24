import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "@deemlol/next-icons";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#AFDDFF] py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold">From Scratch</h3>
            <p className="mb-4 font-serif">
              Building frameworks, apps, and ideas from the ground up. Sharing
              the journey of creating tools and shipping projects.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/atharvdange._"
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white transition-all hover:translate-y-1 hover:bg-[#FF9149]"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://github.com/atharvdange618"
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white transition-all hover:translate-y-1 hover:bg-[#FF9149]"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/atharvdange"
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white transition-all hover:translate-y-1 hover:bg-[#FF9149]"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:atharvdange.dev@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white transition-all hover:translate-y-1 hover:bg-[#FF9149]"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2 font-serif">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="#"
                className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                React
              </Link>
              <Link
                href="#"
                className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                JavaScript
              </Link>
              <Link
                href="#"
                className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                TypeScript
              </Link>
              <Link
                href="#"
                className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Performance
              </Link>
              <Link
                href="#"
                className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FF9149] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Debugging
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8 border-2 border-black" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center font-serif text-sm md:text-left">
            © {new Date().getFullYear()} From Scratch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
