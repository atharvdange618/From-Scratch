/**
 * Centralized type definitions for the application
 */

import { POST_CATEGORIES } from "./categories";

/**
 * Post category type derived from POST_CATEGORIES constant
 */
export type PostCategory = (typeof POST_CATEGORIES)[number];

/**
 * Resource link for blog posts
 */
export interface Resource {
  title: string;
  url: string;
}

/**
 * Linked project reference
 */
interface LinkedProject {
  _id: string;
  name: string;
  slug: string;
  githubUrl?: string;
}

/**
 * Complete Post type
 */
export interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: PostCategory;
  tags: string[];
  readingTime?: string;
  linkedProject?: LinkedProject;
  bannerImage?: string;
  isFeatured?: boolean;
  publishedDate: string;
  isPublished: boolean;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  resources?: Resource[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Post list item
 */
export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: PostCategory;
  tags: string[];
  bannerImage?: string;
  publishedDate: string;
  isPublished: boolean;
  isFeatured?: boolean;
}

/**
 * Project status type
 */
type ProjectStatus = "Active" | "Completed" | "Archived";

/**
 * Complete Project type
 */
export interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  bannerImage?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
