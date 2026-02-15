/**
 * API Error Handler Utility
 */

interface ErrorContext {
  action: string; // e.g., "fetch posts", "create post", "delete project"
  resourceType?: string; // e.g., "post", "project", "draft"
}

/**
 * Generate a user-friendly error message based on the response status
 */
export async function handleApiError(
  response: Response,
  context: ErrorContext,
): Promise<never> {
  const { action, resourceType = "content" } = context;

  if (!navigator.onLine) {
    throw new Error(
      "You're offline. Check your internet connection and try again.",
    );
  }

  switch (response.status) {
    case 400:
      try {
        const error = await response.json();
        throw new Error(
          error.message ||
            `Invalid request. Please check your input and try again.`,
        );
      } catch {
        throw new Error(
          `Invalid request. Please check your input and try again.`,
        );
      }

    case 401:
      throw new Error(
        `You need to be logged in to ${action}. Please sign in and try again.`,
      );

    case 403:
      throw new Error(
        `You don't have permission to ${action}. Contact an admin if you think this is a mistake.`,
      );

    case 404:
      throw new Error(
        `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} not found. It may have been moved or deleted.`,
      );

    case 409:
      throw new Error(
        `This ${resourceType} already exists. Try using a different name or slug.`,
      );

    case 422:
      try {
        const error = await response.json();
        throw new Error(
          error.message || `Validation error. Please check your input.`,
        );
      } catch {
        throw new Error(`Validation error. Please check your input.`);
      }

    case 429:
      throw new Error(`Too many requests. Please wait a moment and try again.`);

    case 500:
      throw new Error(
        `Server error. We're working on it—please try again in a moment.`,
      );

    case 502:
    case 503:
    case 504:
      throw new Error(
        `Service temporarily unavailable. Please try again in a few moments.`,
      );

    default:
      try {
        const error = await response.json();
        throw new Error(
          error.message ||
            `Failed to ${action}. (Error ${response.status}) Please try again.`,
        );
      } catch {
        throw new Error(
          `Failed to ${action}. (Error ${response.status}) Please try again.`,
        );
      }
  }
}

/**
 * Wrapper for fetch calls with better error handling
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {},
  context: ErrorContext,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      await handleApiError(response, context);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Network error while trying to ${context.action}. Check your connection and try again.`,
    );
  }
}
