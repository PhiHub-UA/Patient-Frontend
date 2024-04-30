import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <main className="flex flex-col items-center min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  ),
});
