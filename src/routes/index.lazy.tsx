import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-bl from-secondary to-blue-300">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  ),
});
