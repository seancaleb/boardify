import { lazyImport } from "@/utils/lazy-import";
import { RouteObject } from "react-router-dom";

const { SignIn } = lazyImport(() => import("./sign-in"), "SignIn");
const { SignUp } = lazyImport(() => import("./sign-up"), "SignUp");

export const authRoutes: RouteObject[] = [
  {
    path: "sign-in",
    element: <SignIn />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
  },
];
