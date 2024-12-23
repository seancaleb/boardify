import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type ContentLayoutProps = {
  header: ReactNode;
  children: ReactNode;
  className?: ComponentProps<"div">["className"];
};

export const ContentLayout = ({ header, children, className }: ContentLayoutProps) => {
  return (
    <div className={cn("", className)}>
      <div className="py-4 px-5 md:px-10 border-y border-border">{header}</div>
      <div className="px-5 md:px-10 py-4">{children}</div>
    </div>
  );
};
