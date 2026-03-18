import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getCategoriesWithAll } from "@/lib/categories";
import type { Post } from "@/lib/types";

const POSTS_PER_PAGE = 6;

export function useBlogFilters(posts: Post[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = getCategoriesWithAll();

  const selectedTag = searchParams.get("tag") ?? "all";

  const setSelectedTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag === "all") {
        params.delete("tag");
      } else {
        params.set("tag", tag);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

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

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  }, [setSelectedTag]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      setCurrentPage(1);
      trackEvent("blog_category_filter", {
        category: value,
        resultsCount: filteredPosts.length,
      });
    },
    [filteredPosts.length],
  );

  const handleTagChange = useCallback(
    (value: string) => {
      setSelectedTag(value);
      setCurrentPage(1);
      trackEvent("blog_tag_filter", {
        tag: value,
        resultsCount: filteredPosts.length,
      });
    },
    [setSelectedTag, filteredPosts.length],
  );

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    trackEvent("blog_sort_change", { sortBy: value });
  }, []);

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectedTag,
    setSelectedTag,
    sortBy,
    categories,
    allTags,

    handleCategoryChange,
    handleTagChange,
    handleSortChange,
    handleReset,

    filteredPosts,

    currentPage,
    setCurrentPage,
    currentPosts,
    totalPages,
    indexOfFirstPost,
    indexOfLastPost,
  };
}
