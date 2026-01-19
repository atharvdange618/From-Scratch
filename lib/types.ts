/**
 * Centralized type definitions for the application
 */

import { POST_CATEGORIES } from "./categories";

/**
 * Post category type derived from POST_CATEGORIES constant
 */
export type PostCategory = (typeof POST_CATEGORIES)[number];

/**
 * Preview token for draft posts
 */
export interface PreviewToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

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
export interface LinkedProject {
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
}

/**
 * Recently viewed post
 */
export interface RecentlyViewedPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  publishedDate: string;
}

/**
 * Project status type
 */
export type ProjectStatus = "Active" | "Completed" | "Archived";

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

/**
 * Project list item
 */
export interface ProjectListItem {
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
}

/**
 * Post with string IDs for editor
 */
export interface PostWithStringId extends Omit<Post, "linkedProject"> {
  linkedProject?: string;
  previewTokens: any[];
}

/**
 * Project with string IDs for editor
 */
export interface ProjectWithStringId extends Project {}
