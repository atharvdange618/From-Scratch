"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSoundOptions {
  volume?: number;
  playbackRate?: number;
  soundEnabled?: boolean;
}

interface SoundControls {
  play: () => void;
  stop: () => void;
  pause: () => void;
  isPlaying: boolean;
}

/**
 * Hook to play sound effects
 * @param soundPath - Path to the sound file in public folder (e.g., "/sounds/click.mp3")
 * @param options - Optional configuration for volume, playback rate, and enabling/disabling sound
 * @returns Controls to play, stop, and pause the sound
 */
export function useSound(
  soundPath: string,
  options: UseSoundOptions = {},
): SoundControls {
  const { volume = 0.5, playbackRate = 1, soundEnabled = true } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;

      const audio = audioRef.current;

      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.pause();
        audio.src = "";
      };
    }
  }, [soundPath, volume, playbackRate]);

  const play = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return;

    if (audioRef.current.currentTime > 0) {
      audioRef.current.currentTime = 0;
    }

    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Sound playback failed:", error);
      });
    }
  }, [soundEnabled]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  return { play, stop, pause, isPlaying };
}

/**
 * Hook specifically for click sounds with optimized settings
 * @param variant - Click sound variant ('default', 'success', 'error', 'soft')
 * @returns Play function for the click sound
 */
export function useClickSound(
  variant: "default" | "success" | "error" | "soft" = "default",
) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const enabled = localStorage.getItem("soundEffectsEnabled");
      setSoundEnabled(enabled !== "false");
    }
  }, []);

  const soundPaths = {
    default: "/sounds/click.mp3",
    success: "/sounds/click-success.mp3",
    error: "/sounds/click-error.mp3",
    soft: "/sounds/click-soft.mp3",
  };

  const { play } = useSound(soundPaths[variant], {
    volume: 0.3,
    playbackRate: 1,
    soundEnabled,
  });

  return play;
}
