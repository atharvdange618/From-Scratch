import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BlogEntries } from "@/components/blog-entries";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <BlogEntries />
      </main>
      <Footer />
    </div>
  );
}
