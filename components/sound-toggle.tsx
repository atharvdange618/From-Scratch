"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSoundContext } from "@/components/providers/sound-provider";
import { cn } from "@/lib/utils";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSoundContext();

  return (
    <button
      onClick={toggleSound}
      className={cn(
        "group relative inline-flex items-center justify-center h-10 w-10 rounded-none border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(74,144,204,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(74,144,204,0.3)]",
        soundEnabled
          ? "hover:bg-[#A8E6CF] dark:hover:bg-green-800"
          : "hover:bg-gray-300 dark:hover:bg-gray-700",
      )}
      aria-label={
        soundEnabled ? "Disable sound effects" : "Enable sound effects"
      }
      title={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
    >
      {soundEnabled ? (
        <Volume2 className="h-5 w-5 text-black dark:text-white transition-transform group-hover:scale-110" />
      ) : (
        <VolumeX className="h-5 w-5 text-black dark:text-white opacity-60 transition-transform group-hover:scale-110" />
      )}

      <span className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none border-2 border-black dark:border-gray-700 bg-black dark:bg-gray-800 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(74,144,204,0.3)] transition-opacity group-hover:opacity-100">
        {soundEnabled ? "Mute clicks" : "Unmute clicks"}
      </span>
    </button>
  );
}
