import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { Suspense } from "react";
import React from "react";
import { AuthProvider } from "./context/AuthContextProvider.tsx";
import { GlobalStateProvider } from "./context/GlobalStateContext.tsx";
import NastranSpinner from "./components/custom-ui/spinner/NastranSpinner.tsx";
const LazyApp = React.lazy(() => import("@/App.tsx"));

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <AuthProvider>
      <Suspense
        fallback={
          <div className="h-screen bg-secondary flex justify-center items-center">
            <NastranSpinner />
          </div>
        }
      >
        <GlobalStateProvider>
          <LazyApp />
        </GlobalStateProvider>
      </Suspense>
    </AuthProvider>
  </ThemeProvider>
);
