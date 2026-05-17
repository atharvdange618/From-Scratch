"use client";

import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useBlogFilters } from "@/lib/hooks/use-blog-filters";
import { BlogCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { RecentlyViewed } from "@/components/recently-viewed";
import { BlogCard } from "@/components/blog-card";
import { BlogFilters } from "@/components/blog-filters";
import { Pagination } from "@/components/pagination";

export function BlogsContent() {
  const { data: posts = [], isLoading, isError } = usePostsQuery();

  const {
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
  } = useBlogFilters(posts);

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

        <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <BlogCardSkeleton key={`blog-skeleton-${i}`} />
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

      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedTag={selectedTag}
        onTagChange={handleTagChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        categories={categories}
        allTags={allTags}
        filteredCount={filteredPosts.length}
        totalCount={posts.length}
        onReset={handleReset}
      />

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

          <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {currentPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                onTagClick={setSelectedTag}
                enableTagFiltering={true}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
