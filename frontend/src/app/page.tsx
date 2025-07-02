"use client"

import Hero from "@/components/Hero";
import useSmoothScroll from "@/hooks/useSmoothScroll";


export default function Page() {
  useSmoothScroll()
  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <Hero />
    </main>
  );
}
