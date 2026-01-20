import { HeroSection } from "@/components/hero-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { BlogEntries } from "@/components/blog-entries";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeaturedProjects />
        <BlogEntries />
      </div>
    </div>
  );
}
