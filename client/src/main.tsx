import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/components/common/NotFound";
import AuthorizeCallback from "@/pages/auth";

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
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
