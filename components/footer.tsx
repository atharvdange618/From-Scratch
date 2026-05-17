import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ExternalLink } from "@deemlol/next-icons";
import { Separator } from "@/components/ui/separator";
import { SocialLinks } from "@/components/analytics/social-links";
import { ScrollToTop } from "./scroll-to-top";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Post from "@/lib/models/Post";

interface FooterProject {
  name: string;
  slug: string;
  githubUrl?: string;
}

interface FooterData {
  projects: FooterProject[];
  projectCount: number;
  postCount: number;
}

const getFooterData = unstable_cache(
  async (): Promise<FooterData> => {
    await connectDB();

    const [projects, projectCount, postCount] = await Promise.all([
      Project.find({ status: { $ne: "Archived" } })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("name slug githubUrl")
        .lean(),
      Project.countDocuments({}),
      Post.countDocuments({ isPublished: true }),
    ]);

    return {
      projects: projects.map((p: any) => ({
        name: p.name,
        slug: p.slug,
        githubUrl: p.githubUrl,
      })),
      projectCount,
      postCount,
    };
  },
  ["footer-data"],
  { revalidate: 86400, tags: ["projects", "posts"] },
);

export async function Footer() {
  const { projects, projectCount, postCount } = await getFooterData();

  return (
    <footer className="border-t-4 border-black dark:border-gray-700 bg-background dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-16">
          <div className="md:col-span-2 space-y-10">
            <div>
              <h3 className="font-sans text-4xl md:text-5xl font-black tracking-tighter leading-none dark:text-white mb-5">
                From Scratch
              </h3>
              <p className="font-serif text-base md:text-lg leading-relaxed dark:text-gray-300 max-w-[60ch]">
                Building frameworks, apps, and ideas from the ground up. Sharing
                the journey of creating tools and shipping projects one line of
                code at a time.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] dark:text-gray-400 flex items-center gap-3 before:block before:h-px before:w-6 before:bg-black dark:before:bg-gray-600">
                Projects
              </h4>
              <ul className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li key={project.slug}>
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 font-serif dark:text-gray-300 hover:text-secondary transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          {project.name}
                        </a>
                      ) : (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group inline-flex items-center gap-2 font-serif dark:text-gray-300 hover:text-secondary transition-colors"
                        >
                          <span className="h-1 w-1 rounded-none bg-secondary" />
                          {project.name}
                        </Link>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="font-serif text-sm text-gray-500 dark:text-gray-400">
                    No projects yet
                  </li>
                )}
              </ul>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 font-serif text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                View all projects &rarr;
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 rounded-none border-2 border-black dark:border-gray-700 bg-secondary px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.3)]">
              <span className="text-sm font-black dark:text-black whitespace-nowrap">
                {projectCount} PROJECTS &middot; {postCount} POSTS
              </span>
            </div>
          </div>

          <div className="md:col-span-1 space-y-10">
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] dark:text-gray-400 flex items-center gap-3 before:block before:h-px before:w-6 before:bg-black dark:before:bg-gray-600">
                Explore
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/" as const, label: "Home" },
                  { href: "/blogs" as const, label: "Blog" },
                  { href: "/contact" as const, label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 font-serif dark:text-gray-300 hover:text-secondary transition-colors"
                    >
                      <span className="h-1 w-1 rounded-none bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] dark:text-gray-400 flex items-center gap-3 before:block before:h-px before:w-6 before:bg-black dark:before:bg-gray-600">
                Connect
              </h4>
              <SocialLinks location="footer" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="border-2 border-black dark:border-gray-700" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-serif text-sm dark:text-gray-400">
            <span>&copy; {new Date().getFullYear()} From Scratch.</span>
            <span>Built with Next.js &amp; &hearts;.</span>
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.atharvdangedev.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-sm dark:text-gray-400 hover:text-secondary transition-colors"
            >
              Portfolio
            </a>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
