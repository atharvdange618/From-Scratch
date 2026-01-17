import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to handle image uploads for editors
 */
export function useImageUpload(
  setValue: UseFormSetValue<any>,
  fieldName: string = "bannerImage",
) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl =
          result.data?.secure_url || result.data?.url || result.url;
        if (!imageUrl) {
          throw new Error("No URL in upload response");
        }
        setValue(fieldName, imageUrl, { shouldValidate: true });
        toast({
          title: "✅ Success",
          description: "Image uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "❌ Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return {
    uploading,
    handleImageUpload,
  };
}
