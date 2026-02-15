"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/lib/hooks/use-online";
import { useToast } from "@/components/ui/use-toast";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Some features may not work until you're back online",
        duration: Infinity,
      });
    } else {
      if (typeof window !== "undefined" && !navigator.onLine) {
        toast({
          title: "You're back online!",
          description: "All features are now available",
          duration: 3000,
        });
      }
    }
  }, [isOnline, toast]);

  if (!isOnline) {
    return (
      <div className="sticky top-16 z-40 border-b-4 border-black dark:border-gray-700 bg-[#FF9149] dark:bg-orange-600 px-4 py-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <WifiOff className="h-5 w-5 text-white" />
          <p className="text-sm font-bold text-white">
            You're offline - Some features may not work
          </p>
        </div>
      </div>
    );
  }

  return null;
}
