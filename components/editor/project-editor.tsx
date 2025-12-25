"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Active", "Completed", "Archived"]),
  techStack: z.string(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  bannerImage: z.string().optional(),
  featured: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectEditor() {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techTags, setTechTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "Active",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      bannerImage: "",
      featured: false,
    },
  });

  const { watch, setValue } = form;

  // Auto-generate slug from name
  const name = watch("name");
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  }, [name, setValue]);

  const handleTechStackAdd = () => {
    const techStack = form.watch("techStack");
    if (techStack.trim()) {
      setTechTags([...techTags, techStack.trim()]);
      setValue("techStack", "");
    }
  };

  const handleTechStackRemove = (tech: string) => {
    setTechTags(techTags.filter((t) => t !== tech));
  };

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

      if (response.status === 200) {
        const result = await response.json();
        const imageUrl =
          result.data?.secure_url || result.data?.url || result.url;
        if (!imageUrl) {
          throw new Error("No URL in upload response");
        }
        setValue("bannerImage", imageUrl, { shouldValidate: true });
        toast({
          title: "✅ Success",
          description: "Project image uploaded successfully",
        });
        // Reset file input
        e.target.value = "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "❌ Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        techStack: techTags,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Project saved successfully",
        });
        form.reset();
        setTechTags([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Project Details</h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="Project name..."
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
                        placeholder="project-url-slug"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="Describe your project..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="mb-4">
                <FormLabel className="font-bold">Tech Stack</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="techStack"
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="Add technology..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleTechStackAdd();
                          }
                        }}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleTechStackAdd}
                    className="rounded-none border-4 border-black bg-[#60B5FF] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {techTags.map((tech) => (
                    <Badge
                      key={tech}
                      className="rounded-lg border-2 border-black bg-[#AFDDFF] px-3 py-1 font-bold text-black hover:bg-[#AFDDFF]"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleTechStackRemove(tech)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="rounded-none border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Links & Media</h2>

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">GitHub URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="https://github.com/username/repo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="font-bold">Live Demo URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="https://demo.example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Banner Image</FormLabel>
                    <div className="space-y-3">
                      {field.value && (
                        <div className="space-y-2">
                          <img
                            src={field.value}
                            alt="Project"
                            className="h-48 w-full rounded-none border-4 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          />
                          <div className="rounded-none border-4 border-black bg-[#E0FFF1] p-2 text-center font-bold">
                            ✓ Image uploaded
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="project-upload"
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("project-upload")?.click()
                          }
                          disabled={uploading}
                          className="rounded-none border-4 border-black bg-[#AFDDFF] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {uploading
                            ? "Uploading..."
                            : field.value
                            ? "Change Image"
                            : "Upload Image"}
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

            <Card className="rounded-none border-4 border-black bg-[#E0FFF1] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-lg font-bold">
                        Featured Project
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Display on homepage
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-black"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
          </div>
        </div>

        {/* Actions */}
        <Card className="rounded-none border-4 border-black bg-[#FFECDB] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setTechTags([]);
              }}
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
              Save Project
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
