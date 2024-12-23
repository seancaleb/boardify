import { AuthorizeClient } from "@/features/auth";
import { AppProvider } from "@/providers/app";
import { AppRoutes } from "@/routes";

export const App = () => {
  return (
    <AppProvider>
      <AuthorizeClient>
        <AppRoutes />
      </AuthorizeClient>
    </AppProvider>
  );
};
