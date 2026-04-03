"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const enabled = localStorage.getItem("soundEffectsEnabled");
    setSoundEnabled(enabled !== "false");
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newValue = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("soundEffectsEnabled", String(newValue));
      }
      return newValue;
    });
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
