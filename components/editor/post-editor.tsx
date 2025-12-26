"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
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
import { Upload, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
          fetch("/api/posts"),
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

  const loadPost = (postId: string) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

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
  };

  const resetForm = () => {
    form.reset();
    setSelectedPostId("");
    setIsEditMode(false);
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
                        <SelectItem value="Active Projects">
                          Active Projects
                        </SelectItem>
                        <SelectItem value="Completed Projects">
                          Completed Projects
                        </SelectItem>
                        <SelectItem value="Learning Notes">
                          Learning Notes
                        </SelectItem>
                        <SelectItem value="Updates">Updates</SelectItem>
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
                  <div className="prose max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

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
