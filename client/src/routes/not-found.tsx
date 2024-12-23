import { NotFound } from "@/features/misc";
import { RouteObject } from "react-router-dom";

export const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFound />,
};
