"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / rect.width;
    const distY = (e.clientY - centerY) / rect.height;
    x.set(distX * 8);
    y.set(distY * 8);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, rotateX, rotateY }}
      transition={{ type: "spring" as const, stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}
