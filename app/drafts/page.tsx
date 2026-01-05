"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateandnumbers";
import { calculateReadingTime } from "@/lib/reading-time";

interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedDate: string;
  isPublished: boolean;
  linkedProject?: {
    _id: string;
    name: string;
    slug: string;
  };
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletedDraft, setDeletedDraft] = useState<Post | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function checkAdmin() {
      if (!isSignedIn) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setIsAdmin(data.isAdmin);

        if (!data.isAdmin) {
          router.push("/");
        } else {
          fetchDrafts();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        router.push("/");
      } finally {
        setCheckingAdmin(false);
      }
    }

    if (isLoaded && isSignedIn) {
      checkAdmin();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts?isPublished=false");
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
      toast({
        title: "❌ Error",
        description: "Failed to load drafts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (postId: string) => {
    setPublishingId(postId);

    const draftToPublish = drafts.find((d) => d._id === postId);
    if (!draftToPublish) return;

    setDrafts((prev) => prev.filter((d) => d._id !== postId));

    try {
      const response = await fetch(`/api/posts/id/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });

      if (response.ok) {
        toast({
          title: "✅ Published",
          description: "Post has been published successfully",
        });
      } else {
        throw new Error("Failed to publish");
      }
    } catch (error) {
      // Rollback on error
      setDrafts((prev) => [...prev, draftToPublish]);
      toast({
        title: "❌ Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (postId: string) => {
    const draftToDelete = drafts.find((d) => d._id === postId);
    if (!draftToDelete) return;

    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    setDrafts((prev) => prev.filter((d) => d._id !== postId));
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
          className="rounded-none border-2 border-black bg-[#60B5FF] px-3 py-1 text-xs font-bold"
        >
          Undo
        </Button>
      ),
    });

    const timeout = setTimeout(() => {
      performDelete(postId);
    }, 5000);

    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    if (deletedDraft && undoTimeout) {
      clearTimeout(undoTimeout);
      setDrafts((prev) => [...prev, deletedDraft]);
      setDeletedDraft(null);
      setUndoTimeout(null);
      toast({
        title: "Undo successful",
        description: "Draft has been restored.",
      });
    }
  };

  const performDelete = async (postId: string) => {
    setDeletingId(postId);
    try {
      const response = await fetch(`/api/posts/id/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setDeletedDraft(null);
      setUndoTimeout(null);
    } catch (error) {
      if (deletedDraft) {
        setDrafts((prev) => [...prev, deletedDraft]);
        setDeletedDraft(null);
      }
      toast({
        title: "❌ Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
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
        // Copy preview URL to clipboard
        await navigator.clipboard.writeText(data.data.previewUrl);
        toast({
          title: "✅ Preview Link Generated",
          description: "Link copied to clipboard!",
        });
      } else {
        throw new Error(data.message || "Failed to generate preview");
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to generate preview link",
        variant: "destructive",
      });
    }
  };

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-none border-4 border-black bg-[#FFE5B4] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-black leading-tight">Draft Posts</h1>
            <p className="mt-1 text-lg text-gray-600">
              Manage your unpublished content
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-none border-4 border-black bg-[#AFDDFF]  px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
          </Badge>
          <Button
            onClick={fetchDrafts}
            disabled={loading}
            variant="outline"
            className="rounded-none border-4 border-black bg-white px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/editor")}
            className="rounded-none border-4 border-black bg-black px-6 py-2 font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-black hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]"
          >
            + New Post
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) : drafts.length === 0 ? (
        <Card className="rounded-none border-4 border-black bg-[#E0FFF1] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileText className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-bold">No Drafts Found</h3>
            <p className="mb-6 text-gray-600">
              You don't have any draft posts yet
            </p>
            <Button
              onClick={() => router.push("/editor")}
              className="rounded-none border-4 border-black bg-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(255,145,73,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,145,73,1)]"
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
              className="flex flex-col rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <CardHeader>
                {draft.bannerImage && (
                  <div className="mb-4 -mt-6 -mx-6">
                    <img
                      src={draft.bannerImage}
                      alt={draft.title}
                      className="h-48 w-full border-b-4 border-black object-cover"
                    />
                  </div>
                )}
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className="rounded-none border-2 border-black bg-[#FFE5B4] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {draft.category}
                  </Badge>
                  {draft.linkedProject && (
                    <Badge className="rounded-none border-2 border-black bg-[#E0FFF1] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      🔗 {draft.linkedProject.name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  {draft.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {draft.summary}
                </p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(draft.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadingTime(draft.content)} min read</span>
                  </div>
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {draft.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-none border border-black bg-white px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {draft.tags.length > 3 && (
                        <span className="text-gray-400">
                          +{draft.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 border-t-4 border-black bg-gray-50 pt-4">
                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => handleEdit(draft._id)}
                    className="flex-1 rounded-none border-2 border-black bg-[#AFDDFF] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    size="sm"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handlePreview(draft._id)}
                    variant="outline"
                    className="flex-1 rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    size="sm"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Preview
                  </Button>
                </div>

                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => handlePublish(draft._id)}
                    disabled={publishingId === draft._id}
                    className="flex-1 rounded-none border-2 border-black bg-[#E0FFF1] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    size="sm"
                  >
                    {publishingId === draft._id ? (
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
                        disabled={deletingId === draft._id}
                        className="flex-1 rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        size="sm"
                      >
                        {deletingId === draft._id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                          Delete Draft?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the draft "{draft.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(draft._id)}
                          className="rounded-none border-2 border-black bg-red-500 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600"
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
