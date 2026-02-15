import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/lib/types";
import { fetchWithErrorHandling, handleApiError } from "@/lib/api-error-handler";

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  published: () => [...postKeys.all, { published: true }] as const,
  drafts: () => [...postKeys.all, "drafts"] as const,
  detail: (slug: string) => [...postKeys.all, slug] as const,
  related: (slug: string) => [...postKeys.all, slug, "related"] as const,
};

// Types
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
      const data = await fetchWithErrorHandling<{ posts: Post[] }>(
        "/api/posts?listView=true&isPublished=true",
        {},
        { action: "load posts", resourceType: "posts" }
      );
      return data.posts || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch single post by slug
 */
export function usePostQuery(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async (): Promise<Post> => {
      const data = await fetchWithErrorHandling<{ data: Post }>(
        `/api/posts/${slug}`,
        {},
        { action: "load this post", resourceType: "post" }
      );
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
      const data = await fetchWithErrorHandling<{ posts: Post[] }>(
        "/api/posts?isPublished=false",
        {},
        { action: "load drafts", resourceType: "drafts" }
      );
      return data.posts || [];
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create a new post
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      return await fetchWithErrorHandling<Post>(
        "/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        { action: "create post", resourceType: "post" }
      );
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
 * Update an existing post by slug
 */
export function useUpdatePostMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePostData): Promise<Post> => {
      return await fetchWithErrorHandling<Post>(
        `/api/posts/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        { action: "update post", resourceType: "post" }
      );
    },
    onMutate: async (newData: UpdatePostData) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      const updatePost = (old: Post[] = []) =>
        old.map((post) =>
          post.slug === slug
            ? { ...post, ...newData, updatedAt: new Date().toISOString() }
            : post,
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
          context.previousPublished,
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
 * Delete a post by slug
 */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<{ message: string }> => {
      return await fetchWithErrorHandling<{ message: string }>(
        `/api/posts/${slug}`,
        {
          method: "DELETE",
        },
        { action: "delete post", resourceType: "post" }
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      queryClient.setQueryData(postKeys.drafts(), (old: Post[] = []) =>
        old.filter((post) => post._id !== id),
      );
      queryClient.setQueryData(postKeys.published(), (old: Post[] = []) =>
        old.filter((post) => post._id !== id),
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
          context.previousPublished,
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
    mutationFn: async (slug: string): Promise<Post> => {
      return await fetchWithErrorHandling<Post>(
        `/api/posts/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublished: true }),
        },
        { action: "publish post", resourceType: "post" }
      );
    },
    onMutate: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousDrafts = queryClient.getQueryData(postKeys.drafts());
      const previousPublished = queryClient.getQueryData(postKeys.published());

      const drafts = queryClient.getQueryData(postKeys.drafts()) as
        | Post[]
        | undefined;
      const draftToPublish = drafts?.find((post) => post.slug === slug);

      if (draftToPublish) {
        queryClient.setQueryData(postKeys.drafts(), (old: Post[] = []) =>
          old.filter((post) => post.slug !== slug),
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
    onError: (err, slug, context) => {
      if (context?.previousDrafts) {
        queryClient.setQueryData(postKeys.drafts(), context.previousDrafts);
      }
      if (context?.previousPublished) {
        queryClient.setQueryData(
          postKeys.published(),
          context.previousPublished,
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
