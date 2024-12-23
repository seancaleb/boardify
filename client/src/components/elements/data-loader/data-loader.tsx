import { Transition } from "@/components/animations";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Spinner } from "..";

type DataLoaderProps = {
  data?: string;
} & ComponentProps<"div">;

export const DataLoader = ({ data, ...props }: DataLoaderProps) => {
  const loadingTitle = data ? `Loading ${data}` : "Please wait";

  return (
    <Transition className="top-0">
      <div
        {...props}
        className={cn(
          "absolute top-0 right-0 left-0 bottom-0 grid place-items-center",
          props.className
        )}
      >
        <div className="grid gap-1 justify-items-center">
          <Spinner className="h-[26px] w-[26px]" />
          <h3>{loadingTitle}</h3>
        </div>
      </div>
    </Transition>
  );
};
