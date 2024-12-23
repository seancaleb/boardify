/* eslint-disable react-refresh/only-export-components */
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion";
import { Outlet, RouteObject, ScrollRestoration, useLocation } from "react-router-dom";
import { ErrorRoute } from "./error";

const RootRoute = () => {
  const location = useLocation();

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait" initial={true}>
        <Outlet />
      </AnimatePresence>
      {!location.search && <ScrollRestoration />}
    </>
  );
};

export const initializeRoutes = (routes: RouteObject[]): RouteObject => ({
  element: <RootRoute />,
  children: routes,
  errorElement: <ErrorRoute />,
});
