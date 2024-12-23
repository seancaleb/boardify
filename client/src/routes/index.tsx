import { notFoundRoute } from "@/routes/not-found";
import { protectedRoutes } from "@/routes/protected";
import { publicRoutes } from "@/routes/public";
import { initializeRoutes } from "@/routes/root";
import { useAppStore } from "@/stores";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";

export const AppRoutes = () => {
  const auth = useAppStore.use.auth();

  const routes: RouteObject[] = [
    initializeRoutes([auth.isAuthenticated ? protectedRoutes : publicRoutes, notFoundRoute]),
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
