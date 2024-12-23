/* eslint-disable react-refresh/only-export-components */
import { lazyImport } from "@/utils/lazy-import";
import { Suspense, useEffect } from "react";
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom";
import { ErrorRoute } from "./error";

const { SignIn } = lazyImport(() => import("@/features/auth/routes/sign-in"), "SignIn");
const { SignUp } = lazyImport(() => import("@/features/auth/routes/sign-up"), "SignUp");

const PublicRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/sign-in");
    }
  }, [location, navigate]);

  return (
    <main className="min-h-screen">
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicRoutes />,
  children: [
    {
      path: "sign-in",
      element: <SignIn />,
      errorElement: <ErrorRoute />,
    },
    {
      path: "sign-up",
      element: <SignUp />,
      errorElement: <ErrorRoute />,
    },
  ],
  errorElement: <ErrorRoute />,
};
