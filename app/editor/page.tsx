"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAdminCheckQuery } from "@/lib/hooks/use-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import PostEditor from "@/components/editor/post-editor";
import ProjectEditor from "@/components/editor/project-editor";

export default function EditorPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");

  const { data: isAdmin, isLoading: checkingAdmin } = useAdminCheckQuery();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !checkingAdmin && isAdmin === false) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, checkingAdmin, isAdmin, router]);

  if (!isLoaded || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-4 font-bold">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-4 max-w-md rounded-none border-4 border-black bg-[#FFECDB] p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-600" />
          <h1 className="mb-2 font-sans text-2xl font-bold">Access Denied</h1>
          <p className="mb-4 font-serif">
            You do not have permission to access the editor. This area is
            restricted to administrators only.
          </p>
          <p className="text-sm font-bold text-gray-600">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
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
