import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/components/common/NotFound";
import AuthorizeCallback from "@/pages/auth";
import { useAuthStore } from "@/store/useAuthStore";
import Layout from "@/pages/layout";
import MindMap from "@/pages/Mindmap";
import { ErrorBoundary } from "react-error-boundary";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/mindmap",
        element: <MindMap />,
      },
      {
        path: "/mindmap/:mindMapId",
        element: <MindMap />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthorizeCallback />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "updated" && event.query.queryKey[0] === "user") {
    const data = event.query.state.data;
    if (data?.email && data?.name) useAuthStore.getState().setUser(data?.email, data?.name);
    else useAuthStore.getState().logout();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<NotFound />}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);
