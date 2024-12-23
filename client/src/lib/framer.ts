import { MotionProps, Transition } from "framer-motion";

// export const ease = [0.6, -0.05, 0.01, 0.99];
export const ease = [0.6, 0.01, 0.05, 0.95];

export const animateFadeVertical: MotionProps = {
  initial: {
    y: 16,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 6,
    opacity: 0,
  },
};

export const animateFadeHorizontal: MotionProps = {
  initial: {
    x: -6,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: 6,
    opacity: 0,
  },
};

export const transition: Transition = {
  type: "tween",
  duration: 0.3,
  ease,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 50,
  ease,
};
