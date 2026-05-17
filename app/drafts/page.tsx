"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAdminCheckQuery } from "@/lib/hooks/use-admin";
import {
  useDraftsQuery,
  usePublishPostMutation,
  useDeletePostMutation,
} from "@/lib/hooks/use-posts";
import {
  Calendar,
  Tag,
  Edit,
  Eye,
  Trash2,
  Send,
  Loader2,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/dateandnumbers";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Post } from "@/lib/types";

export default function DraftsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { toast } = useToast();

  const { data: isAdmin, isLoading: checkingAdmin } = useAdminCheckQuery();
  const { data: drafts = [], isLoading: loading, refetch } = useDraftsQuery();
  const publishMutation = usePublishPostMutation();
  const deleteMutation = useDeletePostMutation();

  const [deletedDraft, setDeletedDraft] = useState<Post | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !checkingAdmin && isAdmin === false) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, checkingAdmin, isAdmin, router]);

  const handlePublish = async (postSlug: string) => {
    try {
      await publishMutation.mutateAsync(postSlug);
      toast({
        title: "Published",
        description: "Post has been published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postSlug: string) => {
    const draftToDelete = drafts.find((d) => d.slug === postSlug);
    if (!draftToDelete) return;

    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    setDeletedDraft(draftToDelete);

    const { dismiss } = toast({
      title: "Draft deleted",
      description: "The draft has been removed.",
      action: (
        <Button
          size="sm"
          onClick={() => {
            handleUndo();
            dismiss();
          }}
          className="rounded-none border-2 border-black bg-[#60B5FF] px-3 py-1 text-xs font-bold dark:border-gray-500 dark:bg-primary dark:text-black"
        >
          Undo
        </Button>
      ),
    });

    const timeout = setTimeout(() => {
      performDelete(postSlug);
    }, 5000);

    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    if (deletedDraft && undoTimeout) {
      clearTimeout(undoTimeout);
      setDeletedDraft(null);
      setUndoTimeout(null);
      toast({
        title: "Undo successful",
        description: "Draft has been restored.",
      });
    }
  };

  const performDelete = async (postSlug: string) => {
    try {
      await deleteMutation.mutateAsync(postSlug);
      setDeletedDraft(null);
      setUndoTimeout(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
      setDeletedDraft(null);
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/editor?postId=${postId}`);
  };

  const handlePreview = async (postId: string) => {
    try {
      const response = await fetch("/api/preview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.ok) {
        await navigator.clipboard.writeText(data.data.previewUrl);
        toast({
          title: "Preview Link Generated",
          description: "Link copied to clipboard!",
        });
      } else {
        throw new Error(data.message || "Failed to generate preview");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate preview link",
        variant: "destructive",
      });
    }
  };

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-background">
        <Loader2 className="h-8 w-8 animate-spin dark:text-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-background">
      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-none border-4 border-black bg-[#FFE5B4] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-[#C4824A] dark:text-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)]">
            <FileText className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-black leading-tight dark:text-white">Draft Posts</h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              Manage your unpublished content
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-none border-4 border-black bg-[#AFDDFF] px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-gray-500 dark:bg-neutral-700 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]">
            {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
          </Badge>
          <Button
            onClick={() => refetch()}
            disabled={loading}
            variant="outline"
            className="rounded-none border-4 border-black bg-background px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-background hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-neutral-700 dark:hover:text-white dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/editor")}
            className="rounded-none border-4 border-black bg-black px-6 py-2 font-bold text-white shadow-[4px_4px_0px_0px_rgba(107,114,128,0.6)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-black hover:shadow-[2px_2px_0px_0px_rgba(107,114,128,0.6)] dark:border-gray-500 dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:bg-neutral-200 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]"
          >
            + New Post
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin dark:text-white" />
        </div>
      ) : drafts.length === 0 ? (
        <Card className="rounded-none border-4 border-black bg-[#E0FFF1] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)]">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileText className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h3 className="mb-2 text-xl font-bold dark:text-white">No Drafts Found</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              You don't have any draft posts yet
            </p>
            <Button
              onClick={() => router.push("/editor")}
              className="rounded-none border-4 border-black bg-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(107,114,128,0.6)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(107,114,128,0.6)] dark:border-gray-500 dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:bg-neutral-200 dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]"
            >
              Create Your First Draft
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <Card
              key={draft._id}
              className="flex flex-col rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]"
            >
              <CardHeader>
                {draft.bannerImage && (
                  <div className="mb-4 -mt-6 -mx-6">
                    <Image
                      src={draft.bannerImage}
                      alt={draft.title}
                      width={400}
                      height={192}
                      className="h-48 w-full border-b-4 border-black object-cover dark:border-gray-500"
                    />
                  </div>
                )}
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className="rounded-none border-2 border-black bg-[#FFE5B4] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-[#C4824A] dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                    {draft.category}
                  </Badge>
                  {draft.linkedProject && (
                    <Badge className="rounded-none border-2 border-black bg-[#E0FFF1] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-[#2D8B6E] dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                      {draft.linkedProject.name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-xl font-bold dark:text-white">
                  {draft.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="mb-4 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                  {draft.summary}
                </p>

                <div className="space-y-2 text-xs text-gray-700 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(draft.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{draft.readingTime || "N/A"}</span>
                  </div>
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {draft.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-none border border-black bg-background px-2 py-0.5 text-xs text-black dark:border-gray-500 dark:bg-neutral-700 dark:text-white"
                        >
                          {tag}
                        </span>
                      ))}
                      {draft.tags.length > 3 && (
                        <span className="text-gray-700 dark:text-gray-400">
                          +{draft.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 border-t-4 border-black bg-gray-50 pt-4 dark:border-gray-500 dark:bg-neutral-700">
                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => handleEdit(draft._id)}
                    className="flex-1 rounded-none border-2 border-black bg-[#AFDDFF] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-[#4A90CC] dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-[#3B82C4] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.08)]"
                    size="sm"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handlePreview(draft._id)}
                    variant="outline"
                    className="flex-1 rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-neutral-600 dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.08)]"
                    size="sm"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Preview
                  </Button>
                </div>

                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => handlePublish(draft.slug)}
                    disabled={
                      publishMutation.isPending &&
                      publishMutation.variables === draft.slug
                    }
                    className="flex-1 rounded-none border-2 border-black bg-[#E0FFF1] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-[#2D8B6E] dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] dark:hover:bg-[#236B54] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.08)]"
                    size="sm"
                  >
                    {publishMutation.isPending &&
                    publishMutation.variables === draft.slug ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-1 h-4 w-4" />
                    )}
                    Publish
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={
                          deleteMutation.isPending &&
                          deleteMutation.variables === draft.slug
                        }
                        className="flex-1 rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.08)]"
                        size="sm"
                      >
                        {deleteMutation.isPending &&
                        deleteMutation.variables === draft.slug ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-800 dark:text-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold dark:text-white">
                          Delete Draft?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-300">
                          This action cannot be undone. This will permanently
                          delete the draft "{draft.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-gray-500 dark:bg-neutral-700 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(draft.slug)}
                          className="rounded-none border-2 border-black bg-red-500 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 dark:border-gray-500 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}