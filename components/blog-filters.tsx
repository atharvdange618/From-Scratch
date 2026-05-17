"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  categories: string[];
  allTags: string[];
  filteredCount: number;
  totalCount: number;
  onReset: () => void;
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  categories,
  allTags,
  filteredCount,
  totalCount,
  onReset,
}: BlogFiltersProps) {
  return (
    <div className="mb-8 rounded-none border-2 border-black bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-none border-2 border-black dark:border-gray-700 pl-10 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white"
          />
        </div>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="rounded-none border-2 border-black dark:border-gray-700 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-2 border-black dark:border-gray-700 dark:bg-gray-900">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTag} onValueChange={onTagChange}>
          <SelectTrigger className="rounded-none border-2 border-black dark:border-gray-700 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-2 border-black dark:border-gray-700 dark:bg-gray-900">
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag === "all" ? "All Tags" : tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="rounded-none border-2 border-black dark:border-gray-700 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] dark:bg-gray-900 dark:text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-2 border-black dark:border-gray-700 dark:bg-gray-900">
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold dark:text-gray-300">
          Showing {filteredCount} of {totalCount} posts
        </p>
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-none border-2 border-black dark:border-gray-700 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:bg-[#AFDDFF] dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-white"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
