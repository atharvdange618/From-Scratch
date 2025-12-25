"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import PostEditor from "@/components/editor/post-editor";
import ProjectEditor from "@/components/editor/project-editor";

export default function EditorPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 font-sans text-4xl font-bold">Content Editor</h1>
          <p className="font-serif text-lg text-gray-700">
            Create and manage your blog posts and projects
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 rounded-none border-4 border-black bg-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger
              value="posts"
              className="rounded-none border-2 border-transparent px-6 py-2 font-bold data-[state=active]:border-black data-[state=active]:bg-[#60B5FF] data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Blog Posts
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-2 border-transparent px-6 py-2 font-bold data-[state=active]:border-black data-[state=active]:bg-[#FF9149] data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <PostEditor />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
