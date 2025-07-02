"use client";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
      <motion.div
        className="loading loading-spinner loading-xl"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <motion.p
        className="mt-4 text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading MindMend...
      </motion.p>
    </div>
  );
}

export default Loader;
