import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

export const projectKeys = {
  all: ["projects"] as const,
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

interface CreateProjectData {
  name: string;
  description: string;
  status?: "Active" | "Completed" | "Archived";
  techStack: string[];
  bannerImage?: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

interface UpdateProjectData extends Partial<CreateProjectData> {
  _id?: string;
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
 * Fetch single project by slug
 */
export function useProjectQuery(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async (): Promise<Project> => {
      const data = await fetchWithErrorHandling<{ project: Project }>(
        `/api/projects/${slug}`,
        {},
        { action: "load this project", resourceType: "project" },
      );
      return data.project;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch featured projects
 */
export function useFeaturedProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.featured(),
    queryFn: async (): Promise<Project[]> => {
      const data = await fetchWithErrorHandling<{ projects: Project[] }>(
        "/api/projects?featured=true",
        {},
        { action: "load featured projects", resourceType: "projects" },
      );
      return data.projects || [];
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Create a new project
 */
export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectData): Promise<Project> => {
      return await fetchWithErrorHandling<Project>(
        "/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        { action: "create project", resourceType: "project" },
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      if (data.featured) {
        queryClient.invalidateQueries({ queryKey: projectKeys.featured() });
      }
    },
  });
}

/**
 * Update an existing project by ID
 */
export function useUpdateProjectMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProjectData): Promise<Project> => {
      return await fetchWithErrorHandling<Project>(
        `/api/projects/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
        { action: "update project", resourceType: "project" },
      );
    },
    onMutate: async (newData: UpdateProjectData) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData(projectKeys.all);
      const previousFeatured = queryClient.getQueryData(projectKeys.featured());

      const updateProject = (old: Project[] = []) =>
        old.map((project) =>
          project._id === id ? { ...project, ...newData } : project,
        );

      queryClient.setQueryData(projectKeys.all, updateProject);
      queryClient.setQueryData(projectKeys.featured(), updateProject);

      return { previousProjects, previousFeatured };
    },
    onError: (err, newData, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.all, context.previousProjects);
      }
      if (context?.previousFeatured) {
        queryClient.setQueryData(
          projectKeys.featured(),
          context.previousFeatured,
        );
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      if (data?.slug) {
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(data.slug),
        });
      }
      if (data?.featured) {
        queryClient.invalidateQueries({ queryKey: projectKeys.featured() });
      }
    },
  });
}

/**
 * Delete a project by ID
 */
export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      return await fetchWithErrorHandling<{ message: string }>(
        `/api/projects/${id}`,
        {
          method: "DELETE",
        },
        { action: "delete project", resourceType: "project" },
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData(projectKeys.all);
      const previousFeatured = queryClient.getQueryData(projectKeys.featured());

      queryClient.setQueryData(projectKeys.all, (old: Project[] = []) =>
        old.filter((project) => project._id !== id),
      );
      queryClient.setQueryData(projectKeys.featured(), (old: Project[] = []) =>
        old.filter((project) => project._id !== id),
      );

      return { previousProjects, previousFeatured };
    },
    onError: (err, id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.all, context.previousProjects);
      }
      if (context?.previousFeatured) {
        queryClient.setQueryData(
          projectKeys.featured(),
          context.previousFeatured,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
