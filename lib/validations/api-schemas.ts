import { z } from "zod";

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  summary: z.string().min(1, "Summary is required").max(500),
  content: z.string().min(1, "Content is required"),
  category: z.enum([
    "JavaScript & Web APIs",
    "Git & Version Control",
    "Web Development",
    "Frameworks & Tools",
    "Software Engineering",
    "Project Logs",
  ]),
  tags: z.array(z.string()).max(10).default([]),
  linkedProject: z.string().optional(),
  bannerImage: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().default(false),
  publishedDate: z.coerce.date().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.array(z.string()).max(10).optional(),
  resources: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .max(10)
    .optional(),
});

export const updatePostSchema = createPostSchema.partial();

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Active", "Completed", "Archived"]).default("Active"),
  techStack: z.array(z.string()).max(20).default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  bannerImage: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

export const updateProjectSchema = createProjectSchema.partial();

// Preview token schema
export const generatePreviewTokenSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

// Analytics schema
export const trackEventSchema = z.object({
  eventType: z.string().min(1).max(50),
  sessionId: z.string().uuid("Invalid session ID"),
  eventData: z.record(z.any()).optional(),
});
