import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SocialLinks } from "@/components/analytics/social-links";

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#AFDDFF] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="mb-3 md:mb-4 font-sans text-xl md:text-2xl font-bold">
              From Scratch
            </h3>
            <p className="mb-5 md:mb-6 font-serif text-sm md:text-base leading-relaxed">
              Building frameworks, apps, and ideas from the ground up. Sharing
              the journey of creating tools and shipping projects-one line of
              code at a time.
            </p>
            <div className="mb-5 md:mb-6">
              <h4 className="mb-2 md:mb-3 font-sans text-xs md:text-sm font-bold uppercase tracking-wide">
                Connect With Me
              </h4>
              <SocialLinks location="footer" />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="mb-4 font-sans text-lg font-bold">Explore</h4>
              <ul className="space-y-3 font-serif">
                <li>
                  <Link
                    href="/"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-sans text-lg font-bold">Projects</h4>
              <ul className="space-y-3 font-serif">
                <li>
                  <a
                    href="https://github.com/atharvdange618/Reiatsu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Reiatsu
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/atharvdange618/Telemetry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Telemetry
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/atharvdange618/ArcHive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:text-[#FF9149] hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    ArcHive
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 border-2 border-black" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center font-serif text-sm md:text-left">
            © {new Date().getFullYear()} From Scratch. Built with Next.js & ❤️
          </p>
          <p className="text-center font-serif text-sm md:text-right">
            <a
              href="https://atharvdange.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9149] hover:underline hover:decoration-2 hover:underline-offset-2"
            >
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
