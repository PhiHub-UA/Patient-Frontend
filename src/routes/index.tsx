import Hero from "@/components/Hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-background to-blue-300">
 
      <Hero />

    </main>
  ),
});