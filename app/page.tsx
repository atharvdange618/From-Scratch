import { HeroSection } from "@/components/hero-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { BlogEntries } from "@/components/blog-entries";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeaturedProjects />
        <BlogEntries />
      </div>
    </div>
  );
}
