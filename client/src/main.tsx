import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/components/common/NotFound";
import AuthorizeCallback from "@/pages/auth";
import { useAuthStore } from "@/store/useAuthStore";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth/github/callback",
    element: <AuthorizeCallback />,
  },
  {
    path: "/auth/kakao/callback",
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
    useAuthStore.getState().setUser(data?.email, data?.nickname);
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
