import Hero from "@/components/Hero";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-background to-blue-300">
 
      <Hero />

    </main>
  ),
});