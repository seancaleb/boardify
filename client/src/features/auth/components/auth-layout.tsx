import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="max-w-md w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform">
      {children}
    </div>
  );
};
