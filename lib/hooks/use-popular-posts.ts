import { useQuery } from "@tanstack/react-query";

interface PopularPost {
  slug: string;
  title: string;
  summary: string;
  publishedDate?: Date;
  views: number;
  totalViews: number;
}

interface PostViewsResponse {
  popularPosts: PopularPost[];
  periodDays: number;
}

async function fetchPostViews(days: number = 30): Promise<PostViewsResponse> {
  const response = await fetch(`/api/analytics/post-views?days=${days}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post views");
  }
  return response.json();
}

export function usePopularPosts(days: number = 30) {
  return useQuery({
    queryKey: ["popular-posts", days],
    queryFn: () => fetchPostViews(days),
    staleTime: 5 * 60 * 1000,
  });
}
