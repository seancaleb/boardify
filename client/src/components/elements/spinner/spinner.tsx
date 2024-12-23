import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";

type SpinnerProps = ComponentProps<typeof Loader2>;

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", className)} {...props} />;
};
