import { useQuery } from "@tanstack/react-query";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
  featured: () => [...projectKeys.all, { featured: true }] as const,
  detail: (slug: string) => [...projectKeys.all, slug] as const,
};

// Types
interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: "Active" | "Completed" | "Archived";
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  bannerImage?: string;
  featured: boolean;
}

/**
 * Fetch all projects
 */
export function useProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: async (): Promise<Project[]> => {
      const data = await fetchWithErrorHandling<{ projects: Project[] }>(
        "/api/projects",
        {},
        { action: "load projects", resourceType: "projects" },
      );
      return data.projects || [];
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch projects list for editor
 */
export function useProjectsListQuery() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: async (): Promise<
      Array<{
        _id: string;
        name: string;
        slug: string;
        status: string;
        createdAt: string;
      }>
    > => {
      const data = await fetchWithErrorHandling<{
        projects: Array<{
          _id: string;
          name: string;
          slug: string;
          status: string;
          createdAt: string;
        }>;
      }>(
        "/api/projects/list",
        {},
        { action: "load projects list", resourceType: "projects" },
      );
      return data.projects || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
