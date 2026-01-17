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
import { useToast } from "../ui/use-toast";

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
});

type PostFormValues = z.infer<typeof postSchema>;

export default function PostEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<any[]>([]);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [lastAutosaved, setLastAutosaved] = useState<Date | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
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
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const content = watch("content");

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
      });
      setSelectedPostId(postId);
      setIsEditMode(true);
      setPreviewTokens(post.previewTokens || []);

      try {
        localStorage.removeItem("post-autosave-new");
        localStorage.removeItem(`post-autosave-${postId}`);
      } catch (error) {
        console.error("Failed to clear autosave:", error);
      }
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
    form.reset();
    setSelectedPostId("");
    setIsEditMode(false);
    setPreviewTokens([]);
  };

  useEffect(() => {
    if (title && !isEditMode) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  }, [title, setValue, isEditMode]);

  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData.title && !formData.content) {
        return;
      }

      setAutosaveStatus("saving");

      const timeoutId = setTimeout(() => {
        try {
          const autosaveKey = isEditMode
            ? `post-autosave-${selectedPostId}`
            : "post-autosave-new";

          localStorage.setItem(
            autosaveKey,
            JSON.stringify({
              ...formData,
              lastSaved: new Date().toISOString(),
            }),
          );

          setLastAutosaved(new Date());
          setAutosaveStatus("saved");

          setTimeout(() => setAutosaveStatus("idle"), 2000);
        } catch (error) {
          console.error("Autosave failed:", error);
          setAutosaveStatus("idle");
        }
      }, 3000);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [form, isEditMode, selectedPostId]);

  useEffect(() => {
    const restoreAutosave = () => {
      try {
        const autosaveKey = "post-autosave-new";
        const saved = localStorage.getItem(autosaveKey);

        if (saved) {
          const data = JSON.parse(saved);
          if (data.title || data.content) {
            toast({
              title: "📝 Autosave Found",
              description: `Draft from ${new Date(data.lastSaved).toLocaleString()} restored`,
            });
            form.reset(data);
            setLastAutosaved(new Date(data.lastSaved));
          }
        }
      } catch (error) {
        console.error("Failed to restore autosave:", error);
      }
    };

    restoreAutosave();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl =
          result.data?.secure_url || result.data?.url || result.url;
        if (!imageUrl) {
          throw new Error("No URL in upload response");
        }
        setValue("bannerImage", imageUrl, { shouldValidate: true });
        toast({
          title: "✅ Success",
          description: "Cover image uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "❌ Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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

      const url = isEditMode ? `/api/posts/id/${selectedPostId}` : "/api/posts";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        try {
          const autosaveKey = isEditMode
            ? `post-autosave-${selectedPostId}`
            : "post-autosave-new";
          localStorage.removeItem(autosaveKey);
        } catch (error) {
          console.error("Failed to clear autosave:", error);
        }

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
        <Card className="rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-bold">
            {isEditMode ? "Editing Post" : "Load Existing Post"}
          </h2>
          <div className="flex gap-3">
            <Select value={selectedPostId} onValueChange={loadPost}>
              <SelectTrigger className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
            {isEditMode && (
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Create New
              </Button>
            )}
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
                    <FormLabel className="font-bold">Title *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">Slug *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">Summary *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                    <FormLabel className="font-bold">
                      Tags (comma-separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">Linked Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                name="bannerImage"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">Banner Image</FormLabel>
                    <div className="space-y-3">
                      {field.value && (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Cover preview"
                            className="h-48 w-full rounded-none border-4 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          />
                          <div className="mt-2 flex items-center gap-2 rounded-none border-2 border-black bg-[#E0FFF1] p-2">
                            <span className="text-sm font-bold">
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
                          className="rounded-none border-4 border-black bg-[#AFDDFF] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                            className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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

            <Card className="rounded-none border-4 border-black bg-[#FFECDB] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">SEO Settings</h2>

              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">SEO Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">SEO Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                    <FormLabel className="font-bold">SEO Keywords</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Content *</h2>
                <Button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                  className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
                      <Textarea
                        {...field}
                        rows={20}
                        className="font-mono rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="Write your post content in Markdown..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showPreview && content && (
                <div className="mt-4 rounded-none border-4 border-black bg-white p-6">
                  <h3 className="mb-4 text-xl font-bold">Preview</h3>
                  <div className="prose max-w-none max-h-[600px] overflow-y-auto">
                    <MarkdownRenderer
                      content={content}
                      className="mb-4 font-serif text-sm md:text-base text-gray-700 prose-p:leading-relaxed prose-p:mb-0"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {isEditMode && !form.watch("isPublished") && (
          <Card className="rounded-none border-4 border-black bg-[#AFDDFF] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Preview Links</h2>
                <p className="text-sm text-gray-700">
                  Share draft previews without publishing
                </p>
              </div>
              <Button
                type="button"
                onClick={generatePreviewLink}
                disabled={generatingPreview}
                className="rounded-none border-4 border-black bg-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:bg-[#60B5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                    className="rounded-none border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-mono text-sm">
                          {tokenData.previewUrl}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          {formatExpiryDate(tokenData.expiresAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => copyPreviewLink(tokenData.previewUrl)}
                          className="rounded-none border-2 border-black bg-[#E0FFF1] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => revokePreviewToken(tokenData.token)}
                          variant="destructive"
                          className="rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                No preview links generated yet
              </p>
            )}
          </Card>
        )}

        <Card className="rounded-none border-4 border-black bg-[#E0FFF1] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
                      className="data-[state=checked]:bg-black"
                    />
                  </FormControl>
                  <FormLabel className="font-bold">
                    Publish immediately
                  </FormLabel>
                </FormItem>
              )}
            />

            {autosaveStatus !== "idle" && (
              <div className="flex items-center gap-2 text-sm">
                {autosaveStatus === "saving" ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-muted-foreground">Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="text-green-600">✓ Autosaved</span>
                    {lastAutosaved && (
                      <span className="text-muted-foreground">
                        {lastAutosaved.toLocaleTimeString()}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="rounded-none border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-none border-4 border-black bg-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]"
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
