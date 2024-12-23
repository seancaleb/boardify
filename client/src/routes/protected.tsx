/* eslint-disable react-refresh/only-export-components */
import { DataLoader } from "@/components/elements";
import { DashboardLayout } from "@/components/layout";
import { useGetProfile } from "@/features/account";
import { lazyImport } from "@/utils/lazy-import";
import { Suspense, useEffect } from "react";
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom";
import { ErrorRoute } from "./error";

const { Profile } = lazyImport(() => import("@/features/account/routes/profile"), "Profile");
const { AccountDetails } = lazyImport(
  () => import("@/features/account/routes/account-details"),
  "AccountDetails"
);
const { PrivacyAndSecurity } = lazyImport(
  () => import("@/features/account/routes/privacy-and-security"),
  "PrivacyAndSecurity"
);
const { Board } = lazyImport(() => import("@/features/board/routes/board"), "Board");
const { Boards } = lazyImport(() => import("@/features/board/routes/boards"), "Boards");

const ProtectedRoutes = () => {
  const profile = useGetProfile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/boards");
    }
  }, [location, navigate]);

  if (profile.isError) {
    throw new Error(profile.error.message);
  }

  if (profile.isPending) {
    return <DataLoader data="profile" />;
  }

  return (
    <DashboardLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
};

export const protectedRoutes: RouteObject = {
  path: "/",
  element: <ProtectedRoutes />,
  children: [
    {
      path: "/profile",
      element: <Profile />,
      errorElement: <ErrorRoute />,
    },
    {
      path: "/settings",
      errorElement: <ErrorRoute />,
      children: [
        {
          path: "account-details",
          element: <AccountDetails />,
        },
        {
          path: "privacy-and-security",
          element: <PrivacyAndSecurity />,
        },
      ],
    },
    {
      path: "/boards",
      errorElement: <ErrorRoute />,
      children: [
        {
          path: "",
          element: <Boards />,
        },
        {
          path: ":boardId",
          element: <Board />,
        },
      ],
    },
  ],
  errorElement: <ErrorRoute />,
};
