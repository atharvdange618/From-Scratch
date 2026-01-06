import { postKeys } from "./hooks/use-posts";
import { projectKeys } from "./hooks/use-projects";
import { QueryClient } from "@tanstack/react-query";

export const handlePostHover = (queryClient: QueryClient, slug: string) => {
  queryClient.prefetchQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async () => {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      const data = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const handleProjectHover = (queryClient: QueryClient, slug: string) => {
  queryClient.prefetchQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      return data.project;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
