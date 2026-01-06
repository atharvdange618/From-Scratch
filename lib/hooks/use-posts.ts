import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  published: () => [...postKeys.all, { published: true }] as const,
  drafts: () => [...postKeys.all, "drafts"] as const,
  detail: (slug: string) => [...postKeys.all, slug] as const,
  related: (slug: string) => [...postKeys.all, slug, "related"] as const,
};

// Types
interface Post {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  bannerImage?: string;
  isPublished: boolean;
  publishedDate?: string;
  linkedProject?: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreatePostData {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  bannerImage?: string;
  isPublished?: boolean;
  linkedProject?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

interface UpdatePostData extends Partial<CreatePostData> {
  _id?: string;
}

/**
 * Fetch all published posts
 */
export function usePostsQuery() {
  return useQuery({
    queryKey: postKeys.published(),
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      return data.posts || [];
    },
  });
}

/**
 * Fetch single post by slug
 */
export function usePostQuery(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async (): Promise<Post> => {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!slug,
  });
}

/**
 * Fetch all draft posts (admin only)
 */
export function useDraftsQuery() {
  return useQuery({
    queryKey: postKeys.drafts(),
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch("/api/posts?isPublished=false");
      if (!response.ok) {
        throw new Error("Failed to fetch drafts");
      }
      const data = await response.json();
      return data.posts || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter stale time for admin content
  });
}

/**
 * Create a new post
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.isPublished) {
        queryClient.invalidateQueries({ queryKey: postKeys.published() });
      } else {
        queryClient.invalidateQueries({ queryKey: postKeys.drafts() });
      }
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

/**
 * Update an existing post by ID
 */
export function useUpdatePostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePostData): Promise<Post> => {
      const response = await fetch(`/api/posts/id/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update post");
      }

      return response.json();
    },
    onMutate: async (newData: UpdatePostData) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      const updatePost = (old: Post[] = []) =>
        old.map((post) =>
          post._id === id
            ? { ...post, ...newData, updatedAt: new Date().toISOString() }
            : post
        );

      queryClient.setQueryData(postKeys.drafts(), updatePost);
      queryClient.setQueryData(postKeys.published(), updatePost);

      return { previousDrafts, previousPublished };
    },
    onError: (err, newData, context) => {
      if (context?.previousDrafts) {
        queryClient.setQueryData(postKeys.drafts(), context.previousDrafts);
      }
      if (context?.previousPublished) {
        queryClient.setQueryData(
          postKeys.published(),
          context.previousPublished
        );
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      if (data?.slug) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(data.slug) });
      }
      if (data?.isPublished) {
        queryClient.invalidateQueries({ queryKey: postKeys.published() });
      } else {
        queryClient.invalidateQueries({ queryKey: postKeys.drafts() });
      }
    },
  });
}

/**
 * Delete a post by ID
 */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/posts/id/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
      }

      return response.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      queryClient.setQueryData(postKeys.drafts(), (old: Post[] = []) =>
        old.filter((post) => post._id !== id)
      );
      queryClient.setQueryData(postKeys.published(), (old: Post[] = []) =>
        old.filter((post) => post._id !== id)
      );

      return { previousDrafts, previousPublished };
    },
    onError: (err, id, context) => {
      if (context?.previousDrafts) {
        queryClient.setQueryData(postKeys.drafts(), context.previousDrafts);
      }
      if (context?.previousPublished) {
        queryClient.setQueryData(
          postKeys.published(),
          context.previousPublished
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

/**
 * Publish a draft post
 */
export function usePublishPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Post> => {
      const response = await fetch(`/api/posts/id/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to publish post");
      }

      return response.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      const drafts = queryClient.getQueryData(postKeys.drafts()) as
        | Post[]
        | undefined;
      const draftToPublish = drafts?.find((post) => post._id === id);

      if (draftToPublish) {
        queryClient.setQueryData(postKeys.drafts(), (old: Post[] = []) =>
          old.filter((post) => post._id !== id)
        );

        const publishedPost = {
          ...draftToPublish,
          isPublished: true,
          publishedDate: new Date().toISOString(),
        };

        queryClient.setQueryData(postKeys.published(), (old: Post[] = []) => [
          publishedPost,
          ...old,
        ]);
      }

      return { previousDrafts, previousPublished };
    },
    onError: (err, id, context) => {
      if (context?.previousDrafts) {
        queryClient.setQueryData(postKeys.drafts(), context.previousDrafts);
      }
      if (context?.previousPublished) {
        queryClient.setQueryData(
          postKeys.published(),
          context.previousPublished
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.published() });
      queryClient.invalidateQueries({ queryKey: postKeys.drafts() });
    },
  });
}
