import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface UseEditorAutosaveOptions {
  form: UseFormReturn<any>;
  isEditMode: boolean;
  selectedItemId: string;
  storageKey: string; // e.g., "post-autosave" or "project-autosave"
  checkFields?: string[];
  debounceMs?: number;
}

export function useEditorAutosave({
  form,
  isEditMode,
  selectedItemId,
  storageKey,
  checkFields = ["title", "content"],
  debounceMs = 3000,
}: UseEditorAutosaveOptions) {
  const [lastAutosaved, setLastAutosaved] = useState<Date | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const { toast } = useToast();

  useEffect(() => {
    const subscription = form.watch((formData) => {
      const hasContent = checkFields.some((field) => formData[field]);
      if (!hasContent) {
        return;
      }

      setAutosaveStatus("saving");

      const timeoutId = setTimeout(() => {
        try {
          const autosaveKey = isEditMode
            ? `${storageKey}-${selectedItemId}`
            : `${storageKey}-new`;

          localStorage.setItem(
            autosaveKey,
            JSON.stringify({
              ...formData,
              lastSaved: new Date().toISOString(),
            }),
          );

          setLastAutosaved(new Date());
          setAutosaveStatus("saved");

          setTimeout(() => setAutosaveStatus("idle"), 2000);
        } catch (error) {
          console.error("Autosave failed:", error);
          setAutosaveStatus("idle");
        }
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [form, isEditMode, selectedItemId, storageKey, checkFields, debounceMs]);

  useEffect(() => {
    const restoreAutosave = () => {
      try {
        const autosaveKey = `${storageKey}-new`;
        const saved = localStorage.getItem(autosaveKey);

        if (saved) {
          const data = JSON.parse(saved);
          const hasContent = checkFields.some((field) => data[field]);
          if (hasContent) {
            toast({
              title: "📝 Autosave Found",
              description: `Draft from ${new Date(data.lastSaved).toLocaleString()} restored`,
            });
            form.reset(data);
            setLastAutosaved(new Date(data.lastSaved));
          }
        }
      } catch (error) {
        console.error("Failed to restore autosave:", error);
      }
    };

    restoreAutosave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAutosave = (itemId?: string) => {
    try {
      localStorage.removeItem(`${storageKey}-new`);
      if (itemId) {
        localStorage.removeItem(`${storageKey}-${itemId}`);
      }
    } catch (error) {
      console.error("Failed to clear autosave:", error);
    }
  };

  return {
    lastAutosaved,
    autosaveStatus,
    clearAutosave,
  };
}
