import { cn } from "@/lib/utils";
import {
  LazyMotion,
  domMin,
  m,
  useAnimation,
  useReducedMotion,
} from "motion/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

const SearchIcon = forwardRef(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 0.6,
      isAnimated = true,
      color,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation();
    const reduced = useReducedMotion();
    const isControlled = useRef(false);

    useImperativeHandle(ref, () => {
      isControlled.current = true;
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleEnter = useCallback(
      (e) => {
        if (!isAnimated || reduced) return;
        if (!isControlled.current) controls.start("animate");
        else onMouseEnter?.(e);
      },
      [controls, reduced, isAnimated, onMouseEnter]
    );

    const handleLeave = useCallback(
      (e) => {
        if (!isControlled.current) controls.start("normal");
        else onMouseLeave?.(e);
      },
      [controls, onMouseLeave]
    );

    const circleVariants = {
      normal: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.15, 0.95, 1],
        rotate: [0, -10, 10, 0],
        transition: { duration, ease: "easeInOut" },
      },
    };

    const handleVariants = {
      normal: { x: 0, y: 0 },
      animate: {
        x: [0, 2, -1, 0],
        y: [0, 2, -1, 0],
        transition: { duration, ease: "easeInOut" },
      },
    };

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
          >
            <m.circle cx="11" cy="11" r="8" variants={circleVariants} />
            <m.path d="m21 21-4.3-4.3" variants={handleVariants} />
          </m.svg>
        </m.div>
      </LazyMotion>
    );
  }
);

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };

