"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Tag, Search, Filter, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedDate: string;
  isPublished: boolean;
  linkedProject?: {
    _id: string;
    name: string;
    slug: string;
  };
  bannerImage?: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    "all",
    "Technical",
    "Tutorial",
    "Project Update",
    "Reflection",
  ];
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        trackEvent("blog_search", {
          query: searchQuery,
          resultsCount: filteredPosts.length,
        });
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filteredPosts.length]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts?isPublished=true");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);

        const tags = new Set<string>();
        (data.posts || []).forEach((post: Post) => {
          post.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(["all", ...Array.from(tags)]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.publishedDate).getTime() -
            new Date(b.publishedDate).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("date-desc");
  };

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technical: "#AFDDFF",
      Tutorial: "#FFECDB",
      "Project Update": "#E0FFF1",
      Reflection: "#FFECDB",
    };
    return colors[category] || "#AFDDFF";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-xl font-bold">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl">
          All Blog Posts
        </h1>
        <p className="font-serif text-lg text-gray-700">
          Deep dives into projects, technical tutorials, and reflections on the
          journey of building from scratch.
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 rounded-none border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-bold">Filter & Search</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-4 border-black pl-10 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              trackEvent("blog_category_filter", {
                category: value,
                resultsCount: filteredPosts.length,
              });
            }}
          >
            <SelectTrigger className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select
            value={selectedTag}
            onValueChange={(value) => {
              setSelectedTag(value);
              trackEvent("blog_tag_filter", {
                tag: value,
                resultsCount: filteredPosts.length,
              });
            }}
          >
            <SelectTrigger className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black">
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag === "all" ? "All Tags" : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              trackEvent("blog_sort_change", {
                sortBy: value,
              });
            }}
          >
            <SelectTrigger className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black">
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Reset */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-bold">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#AFDDFF]"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      {currentPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-xl font-bold">
            No posts found matching your filters.
          </p>
          <Button
            onClick={handleReset}
            className="mt-4 rounded-none border-4 border-black bg-[#60B5FF] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => (
              <Card
                key={post._id}
                className="group cursor-pointer overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => router.push(`/posts/${post.slug}`)}
              >
                <CardHeader className="border-b-4 border-black bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-full border-2 border-black p-2"
                      style={{
                        backgroundColor: getCategoryColor(post.category),
                      }}
                    >
                      <Calendar className="h-full w-full" />
                    </div>
                    <span className="text-sm font-bold">
                      {formatDate(post.publishedDate)}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="mb-4 line-clamp-3 font-serif">{post.summary}</p>

                  {/* Reading Time */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {calculateReadingTime(post.content)}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <Badge
                      className="rounded-lg border-2 border-black font-bold"
                      style={{
                        backgroundColor: getCategoryColor(post.category),
                      }}
                    >
                      {post.category}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-lg border-2 border-black bg-[#AFDDFF] px-2 py-1 text-xs font-bold"
                      >
                        <Tag className="mr-1 inline h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags && post.tags.length > 3 && (
                      <span className="inline-block rounded-lg border-2 border-black bg-gray-200 px-2 py-1 text-xs font-bold">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Linked Project */}
                  {post.linkedProject && (
                    <div className="mt-3">
                      <span className="text-xs font-bold text-gray-600">
                        Project: {post.linkedProject.name}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t-4 border-black bg-white p-4">
                  <Button className="w-full rounded-none border-4 border-black bg-[#FF9149] px-4 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-none border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-none border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          currentPage === pageNum
                            ? "bg-[#60B5FF]"
                            : "bg-white hover:bg-[#AFDDFF]"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 font-bold">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-none border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
