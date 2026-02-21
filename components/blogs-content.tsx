"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { getCategoriesWithAll } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { RecentlyViewed } from "@/components/recently-viewed";
import { BlogCard } from "@/components/blog-card";

export function BlogsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categories = getCategoriesWithAll();

  const { data: posts = [], isLoading, isError } = usePostsQuery();

  useEffect(() => {
    const tagFromUrl = searchParams.get("tag");
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    }
  }, [searchParams]);

  const allTags = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(posts.flatMap((post) => post.tags || []))),
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.publishedDate || b.createdAt || 0).getTime() -
            new Date(a.publishedDate || a.createdAt || 0).getTime()
          );
        case "date-asc":
          return (
            new Date(a.publishedDate || a.createdAt || 0).getTime() -
            new Date(b.publishedDate || b.createdAt || 0).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const effectiveCurrentPage = useMemo(() => {
    return 1;
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

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

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const displayPage =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedTag !== "all" ||
    sortBy !== "date-desc"
      ? effectiveCurrentPage
      : currentPage;
  const indexOfLastPost = displayPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl">
            All Blog Posts
          </h1>
          <p className="font-serif text-lg text-gray-700 dark:text-gray-300">
            Deep dives into projects, technical tutorials, and reflections on
            the journey of building from scratch.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <BlogCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Failed to load posts"
          description="There was an error loading blog posts. Please try again later."
          type="default"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 ">
      <div className="mb-12">
        <h1 className="mb-4 font-sans text-4xl font-bold md:text-5xl">
          All Blog Posts
        </h1>
        <p className="font-serif text-lg text-gray-700 dark:text-gray-300">
          Deep dives into projects, technical tutorials, and reflections on the
          journey of building from scratch.
        </p>
      </div>

      <RecentlyViewed />

      <div className="mb-8 rounded-none border-4 border-black bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-bold">Filter & Search</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-4 border-black dark:border-gray-700 pl-10 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white"
            />
          </div>

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
            <SelectTrigger className="rounded-none border-4 border-black dark:border-gray-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-900">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            <SelectTrigger className="rounded-none border-4 border-black dark:border-gray-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-900">
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag === "all" ? "All Tags" : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              trackEvent("blog_sort_change", {
                sortBy: value,
              });
            }}
          >
            <SelectTrigger className="rounded-none border-4 border-black dark:border-gray-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-900">
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-bold dark:text-gray-300">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-none border-4 border-black dark:border-gray-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-[#AFDDFF] dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-white"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try adjusting your filters or search query to find what you're looking for."
          type="search"
          actionLabel="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <>
          {filteredPosts.length > 0 && (
            <div className="mb-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstPost + 1}-
              {Math.min(indexOfLastPost, filteredPosts.length)} of{" "}
              {filteredPosts.length} posts
            </div>
          )}

          <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                onTagClick={setSelectedTag}
                enableTagFiltering={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
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
                        className={`rounded-none border-4 border-black dark:border-gray-700 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] ${
                          currentPage === pageNum
                            ? "bg-[#60B5FF] dark:bg-gray-600 dark:text-white"
                            : "bg-white dark:bg-gray-800 dark:text-white hover:bg-[#AFDDFF] dark:hover:bg-gray-700"
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
                  className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#AFDDFF] dark:hover:bg-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
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
