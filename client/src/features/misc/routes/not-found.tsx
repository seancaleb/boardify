import { useAppStore } from "@/stores";
import { Navigate } from "react-router-dom";

export const NotFound = () => {
  const auth = useAppStore.use.auth();

  if (auth.role !== null) {
    return <Navigate to="/boards" replace />;
  } else {
    return <Navigate to="/sign-in" replace />;
  }
};
