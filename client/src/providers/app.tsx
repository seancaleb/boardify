import { IS_DEVELOPMENT } from "@/config";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider as WrapBalancerProvider } from "react-wrap-balancer";

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme
        baseColor={`hsl(var(--skeleton-base))`}
        highlightColor={`hsl(var(--skeleton-highlight))`}
      >
        <WrapBalancerProvider>
          {children}
          {IS_DEVELOPMENT && <ReactQueryDevtools initialIsOpen={false} position="left" />}
        </WrapBalancerProvider>
      </SkeletonTheme>
    </QueryClientProvider>
  );
};
