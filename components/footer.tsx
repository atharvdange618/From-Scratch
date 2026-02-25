import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Separator } from "@/components/ui/separator";
import { SocialLinks } from "@/components/analytics/social-links";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";

interface FooterProject {
  name: string;
  slug: string;
  githubUrl?: string;
}

const getRecentProjectsFromDB = async (): Promise<FooterProject[]> => {
  await connectDB();
  const projects = await Project.find({ status: { $ne: "Archived" } })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("name slug githubUrl")
    .lean();
  return projects.map((p: any) => ({
    name: p.name,
    slug: p.slug,
    githubUrl: p.githubUrl,
  }));
};

const getRecentProjects = unstable_cache(
  getRecentProjectsFromDB,
  ["footer-projects"],
  {
    revalidate: 86400,
    tags: ["projects"],
  },
);

export async function Footer() {
  const projects = await getRecentProjects();

  return (
    <footer className="border-t-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-neutral-900 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:gap-12">
          <div>
            <h3
              className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold dark:text-white"
              style={{ fontFamily: "'Hitchcut', sans-serif" }}
            >
              From Scratch
            </h3>
            <p className="mb-5 md:mb-6 font-serif text-sm md:text-base leading-relaxed dark:text-gray-300">
              Building frameworks, apps, and ideas from the ground up. Sharing
              the journey of creating tools and shipping projects-one line of
              code at a time.
            </p>
            <div className="mb-5 md:mb-6">
              <h4 className="mb-2 md:mb-3 font-sans text-xs md:text-sm font-bold uppercase tracking-wide dark:text-gray-200">
                Connect With Me
              </h4>
              <SocialLinks location="footer" />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="mb-4 font-sans text-lg font-bold dark:text-white">
                Explore
              </h4>
              <ul className="space-y-3 font-serif dark:text-gray-300">
                <li>
                  <Link
                    href="/"
                    className="inline-block hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="inline-block hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-block hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-sans text-lg font-bold dark:text-white">
                Projects
              </h4>
              <ul className="space-y-3 font-serif dark:text-gray-300">
                {projects.map((project) => (
                  <li key={project.slug}>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4"
                      >
                        {project.name}
                      </a>
                    ) : (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-block hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-4 hover:underline-offset-4"
                      >
                        {project.name}
                      </Link>
                    )}
                  </li>
                ))}
                {projects.length === 0 && (
                  <li className="text-gray-500 dark:text-gray-400 text-sm">
                    No projects yet
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 border-2 border-black dark:border-gray-700" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center font-serif text-sm md:text-left dark:text-gray-300">
            © {new Date().getFullYear()} From Scratch. Built with Next.js & ❤️
          </p>
          <p className="text-center font-serif text-sm md:text-right dark:text-gray-300">
            <a
              href="https://atharvdangedev.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9149] dark:hover:text-secondary hover:underline hover:decoration-2 hover:underline-offset-2"
            >
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
