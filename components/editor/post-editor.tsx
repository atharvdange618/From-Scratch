"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { POST_CATEGORIES } from "@/lib/categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Link as LinkIcon,
  Copy,
  Trash2,
} from "lucide-react";
import { formatExpiryDate } from "@/lib/dateandnumbers";
import { MarkdownRenderer } from "../markdown-renderer";
import { MarkdownEditor } from "./editor-ui/markdown-editor";
import { useToast } from "../ui/use-toast";
import { useSlugGenerator } from "@/lib/hooks/use-slug-generator";
import { useImageUpload } from "@/lib/hooks/use-image-upload";
import { calculateReadingTime } from "@/lib/reading-time";
import { calculateWordCount } from "@/lib/word-count";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  linkedProject: z.string().optional(),
  bannerImage: z.string().optional(),
  isPublished: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  resources: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        url: z.string().url("Must be a valid URL"),
      }),
    )
    .max(10, "Cannot exceed 10 resources")
    .optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function PostEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [selectedPostSlug, setSelectedPostSlug] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<any[]>([]);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "",
      tags: "",
      linkedProject: "",
      bannerImage: "",
      isPublished: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      resources: [],
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const content = watch("content");

  useSlugGenerator(title, isEditMode, setValue);

  const { uploading, handleImageUpload } = useImageUpload(
    setValue,
    "bannerImage",
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, postsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/posts/list"),
        ]);

        if (projectsRes.ok) {
          const projectData = await projectsRes.json();
          setProjects(projectData.projects || []);
        }

        if (postsRes.ok) {
          const postData = await postsRes.json();
          setPosts(postData.posts || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const loadPost = async (postId: string) => {
    try {
      const selectedPost = posts.find((p) => p._id === postId);
      if (!selectedPost || !selectedPost.slug) {
        throw new Error("Post not found in list");
      }

      const response = await fetch(`/api/posts/${selectedPost.slug}`);
      if (!response.ok) {
        throw new Error("Failed to load post");
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error("Invalid response from server");
      }
      const post = data.data;

      form.reset({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        category: post.category,
        tags: post.tags.join(", "),
        linkedProject: post.linkedProject?._id || "",
        bannerImage: post.bannerImage || "",
        isPublished: post.isPublished,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        seoKeywords: post.seoKeywords?.join(", ") || "",
        resources: post.resources || [],
      });
      setSelectedPostId(postId);
      setSelectedPostSlug(post.slug);
      setIsEditMode(true);
      setPreviewTokens(post.previewTokens || []);
    } catch (error) {
      console.error("Error loading post:", error);
      toast({
        title: "❌ Error",
        description: "Failed to load post",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    form.reset({
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "",
      tags: "",
      linkedProject: "",
      bannerImage: "",
      isPublished: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      resources: [],
    });
    setSelectedPostId("");
    setSelectedPostSlug("");
    setIsEditMode(false);
    setPreviewTokens([]);
  };

  const onSubmit = async (data: PostFormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        linkedProject: data.linkedProject?.trim() || undefined,
        seoKeywords: data.seoKeywords
          ?.split(",")
          .map((kw) => kw.trim())
          .filter(Boolean),
        publishedDate: new Date().toISOString(),
      };

      const url = isEditMode ? `/api/posts/${selectedPostSlug}` : "/api/posts";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "✅ Success",
          description: isEditMode
            ? "Post updated successfully"
            : `Post ${data.isPublished ? "published" : "saved as draft"}`,
        });

        if (!isEditMode) {
          resetForm();
          router.push("/blogs");
        } else {
          const postsResponse = await fetch("/api/posts");
          if (postsResponse.ok) {
            const data = await postsResponse.json();
            setPosts(data.posts || []);
          }
          router.push("/blogs");
        }
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const generatePreviewLink = async () => {
    if (!selectedPostId || !isEditMode) {
      toast({
        title: "⚠️ Warning",
        description:
          "Please save the post first before generating a preview link",
        variant: "destructive",
      });
      return;
    }

    const currentPost = posts.find((p) => p._id === selectedPostId);
    if (currentPost?.isPublished) {
      toast({
        title: "⚠️ Warning",
        description: "Preview links are only available for unpublished drafts",
        variant: "destructive",
      });
      return;
    }

    setGeneratingPreview(true);
    try {
      const response = await fetch("/api/preview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: selectedPostId }),
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewTokens([...previewTokens, data.data]);
        toast({
          title: "✅ Preview Link Generated",
          description: "Preview link has been created successfully",
        });
      } else {
        throw new Error(data.message || "Failed to generate preview link");
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to generate preview link",
        variant: "destructive",
      });
    } finally {
      setGeneratingPreview(false);
    }
  };

  const copyPreviewLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "📋 Copied",
      description: "Preview link copied to clipboard",
    });
  };

  const revokePreviewToken = async (token: string) => {
    try {
      const response = await fetch(`/api/preview/revoke/${token}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPreviewTokens(previewTokens.filter((t) => t.token !== token));
        toast({
          title: "✅ Token Revoked",
          description: "Preview link has been revoked",
        });
      } else {
        throw new Error("Failed to revoke token");
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to revoke preview link",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-neutral-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)]">
          <h2 className="mb-4 text-xl font-bold dark:text-white">
            {isEditMode ? "Editing Post" : "Load Existing Post"}
          </h2>
          <div className="flex gap-3">
            <Select value={selectedPostId} onValueChange={loadPost}>
              <SelectTrigger className="rounded-none border-4 border-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]">
                <SelectValue placeholder="Select a post to edit..." />
              </SelectTrigger>
              <SelectContent>
                {posts.map((post) => (
                  <SelectItem key={post._id} value={post._id}>
                    {post.title} ({post.isPublished ? "Published" : "Draft"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={resetForm}
              variant="outline"
              className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Create New
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Post Details</h2>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="Enter post title..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Slug *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="post-url-slug"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Summary *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="Brief description of the post..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Category *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POST_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Tags (comma-separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="TypeScript, React, Next.js"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedProject"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Linked Project
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]">
                          <SelectValue placeholder="Select project (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Resources (Optional, max 10)
                    </FormLabel>
                    <div className="space-y-3">
                      {field.value && field.value.length > 0 ? (
                        field.value.map((resource, index) => (
                          <div
                            key={index}
                            className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-bold dark:text-white">
                                Resource {index + 1}
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  const newResources = field.value!.filter(
                                    (_, i) => i !== index,
                                  );
                                  field.onChange(newResources);
                                }}
                                className="h-7 rounded-none border-2 border-black dark:border-gray-700 px-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <Input
                              value={resource.title}
                              onChange={(e) => {
                                const newResources = [...field.value!];
                                newResources[index].title = e.target.value;
                                field.onChange(newResources);
                              }}
                              placeholder="Resource title..."
                              className="mb-2 rounded-none border-2 border-black dark:border-gray-700 dark:bg-gray-700 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
                            />
                            <Input
                              value={resource.url}
                              onChange={(e) => {
                                const newResources = [...field.value!];
                                newResources[index].url = e.target.value;
                                field.onChange(newResources);
                              }}
                              placeholder="https://..."
                              className="rounded-none border-2 border-black dark:border-gray-700 dark:bg-gray-700 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No resources added yet
                        </p>
                      )}
                      <Button
                        type="button"
                        onClick={() => {
                          const currentResources = field.value || [];
                          if (currentResources.length < 10) {
                            field.onChange([
                              ...currentResources,
                              { title: "", url: "" },
                            ]);
                          }
                        }}
                        disabled={field.value && field.value.length >= 10}
                        className="w-full rounded-none border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-[#4A90CC] dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] disabled:opacity-50"
                      >
                        + Add Resource
                        {field.value && field.value.length > 0 && (
                          <span className="ml-2">
                            ({field.value.length}/10)
                          </span>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      Banner Image
                    </FormLabel>
                    <div className="space-y-3">
                      {field.value && (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Cover preview"
                            className="h-48 w-full rounded-none border-4 border-black dark:border-gray-700 object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                          />
                          <div className="mt-2 flex items-center gap-2 rounded-none border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-[#2D5F4D] p-2">
                            <span className="text-sm font-bold dark:text-white">
                              ✓ Image uploaded
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="cover-upload"
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("cover-upload")?.click()
                          }
                          disabled={uploading}
                          className="rounded-none border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-[#4A90CC] dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {field.value ? "Change Image" : "Upload Image"}
                            </>
                          )}
                        </Button>
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange("")}
                            className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-[#FFECDB] dark:bg-neutral-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)]">
              <h2 className="mb-4 text-2xl font-bold dark:text-white">
                SEO Settings
              </h2>

              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      SEO Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="Custom title for search engines"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold dark:text-gray-200">
                      SEO Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="Meta description..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold dark:text-gray-200">
                      SEO Keywords
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-none border-4 border-black dark:border-gray-700 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">
                  Content *
                </h2>

                <div className="flex gap-4">
                  <span>{calculateReadingTime(content)}</span>
                  <span>{calculateWordCount(content)} words</span>
                </div>

                <Button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                  className="rounded-none border-4 border-black dark:border-gray-700 dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                >
                  {showPreview ? (
                    <EyeOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your post content in Markdown..."
                        minHeight={500}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showPreview && content && (
                <div className="mt-4 rounded-none border-4 border-black dark:border-gray-700 p-6">
                  <h3 className="mb-4 text-xl font-bold dark:text-white">
                    Preview
                  </h3>
                  <div className="prose dark:prose-invert max-w-none max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer
                      content={content}
                      className="mb-4 font-serif text-sm md:text-base text-gray-700 dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-0"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {isEditMode && !form.watch("isPublished") && (
          <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-[#AFDDFF] dark:bg-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  Preview Links
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Share draft previews without publishing
                </p>
              </div>
              <Button
                type="button"
                onClick={generatePreviewLink}
                disabled={generatingPreview}
                className="rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] dark:hover:bg-[#4A90CC] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
              >
                {generatingPreview ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="mr-2 h-4 w-4" />
                )}
                Generate Link
              </Button>
            </div>

            {previewTokens.length > 0 ? (
              <div className="space-y-3">
                {previewTokens.map((tokenData) => (
                  <Card
                    key={tokenData.token}
                    className="rounded-none border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-mono text-sm dark:text-white">
                          {tokenData.previewUrl}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {formatExpiryDate(tokenData.expiresAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => copyPreviewLink(tokenData.previewUrl)}
                          className="rounded-none border-2 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-[#2D5F4D] dark:text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(96,181,255,0.3)]"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => revokePreviewToken(tokenData.token)}
                          variant="destructive"
                          className="rounded-none border-2 border-black dark:border-gray-700 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(96,181,255,0.3)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                No preview links generated yet
              </p>
            )}
          </Card>
        )}

        <Card className="rounded-none border-4 border-black dark:border-gray-700 bg-[#E0FFF1] dark:bg-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(96,181,255,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
                    />
                  </FormControl>
                  <FormLabel className="font-bold dark:text-white">
                    Publish immediately
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="rounded-none border-4 border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(96,181,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(96,181,255,0.3)]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-none border-4 border-black dark:border-gray-700 bg-black dark:bg-white font-bold text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isEditMode
                  ? "Update Post"
                  : form.watch("isPublished")
                    ? "Publish Post"
                    : "Save Draft"}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
}
