import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query Keys
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
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      return data.projects || [];
    },
  });
}

/**
 * Fetch single project by slug
 */
export function useProjectQuery(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async (): Promise<Project> => {
      const response = await fetch(`/api/projects/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      return data.project;
    },
    enabled: !!slug,
  });
}

/**
 * Fetch featured projects
 */
export function useFeaturedProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.featured(),
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch("/api/projects?featured=true");
      if (!response.ok) {
        throw new Error("Failed to fetch featured projects");
      }
      const data = await response.json();
      return data.projects || [];
    },
  });
}

/**
 * Create a new project
 */
export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectData): Promise<Project> => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create project");
      }

      return response.json();
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
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update project");
      }

      return response.json();
    },
    onMutate: async (newData: UpdateProjectData) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData(projectKeys.all);
      const previousFeatured = queryClient.getQueryData(projectKeys.featured());

      const updateProject = (old: Project[] = []) =>
        old.map((project) =>
          project._id === id ? { ...project, ...newData } : project
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
          context.previousFeatured
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
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete project");
      }

      return response.json();
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData(projectKeys.all);
      const previousFeatured = queryClient.getQueryData(projectKeys.featured());

      queryClient.setQueryData(projectKeys.all, (old: Project[] = []) =>
        old.filter((project) => project._id !== id)
      );
      queryClient.setQueryData(projectKeys.featured(), (old: Project[] = []) =>
        old.filter((project) => project._id !== id)
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
          context.previousFeatured
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
