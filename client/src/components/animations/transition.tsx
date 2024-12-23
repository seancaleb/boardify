import { animateFadeHorizontal, transition } from "@/lib/framer";
import { cn } from "@/lib/utils";
import { MotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

type TransitionProps = {
  children: ReactNode;
  childKey?: string;
  MotionProps?: MotionProps;
  className?: string;
};

export const Transition = ({ children, childKey, MotionProps, className }: TransitionProps) => {
  return (
    <motion.div
      key={childKey ?? location.pathname}
      className={cn("absolute top-16 left-4 right-4 bottom-4 overflow-visible", className)}
      transition={transition}
      {...animateFadeHorizontal}
      {...MotionProps}
    >
      {children}
    </motion.div>
  );
};
