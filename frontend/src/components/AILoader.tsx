"use client";

import { motion } from "framer-motion";

export default function AILoader() {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 w-full">
      <motion.span
        className="h-3 w-3 rounded-full bg-accent"
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.span
        className="h-3 w-3 rounded-full bg-accent"
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.span
        className="h-3 w-3 rounded-full bg-accent"
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <p className="ml-2 text-sm text-muted-foreground italic">
        Thera is thinking...
      </p>
    </div>
  );
}
