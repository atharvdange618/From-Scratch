import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

/**
 * Custom hook to auto-generate slug from title when creating new content
 */
export function useSlugGenerator(
  title: string,
  isEditMode: boolean,
  setValue: UseFormSetValue<any>,
) {
  useEffect(() => {
    if (title && !isEditMode) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  }, [title, setValue, isEditMode]);
}
