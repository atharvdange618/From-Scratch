"use client";

import { motion } from "framer-motion";

export function LiveStatusDot() {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
