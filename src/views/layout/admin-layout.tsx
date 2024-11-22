import DashboardNavbar from "@/components/custom-ui/navbar/DashboardNavbar";
import NastranSidebar from "@/components/custom-ui/sidebar/NastranSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useAuthState } from "@/context/AuthContextProvider";
import { handleKeyPress } from "@/lib/keyboard";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AdminLayout() {
  const { logout } = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("keydown", (event) =>
      handleKeyPress({
        logout,
        event,
        navigate,
      })
    );

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", (event) =>
        handleKeyPress({
          logout,
          event,
          navigate,
        })
      );
    };
  }, []);

  return (
    <section className="min-h-[100vh] max-h-[100vh] flex bg-secondary">
      <NastranSidebar />
      <main className="min-h-full flex-1 pb-12 flex flex-col overflow-auto">
        <DashboardNavbar />
        <Outlet />
      </main>
      <Toaster />
    </section>
  );
}
