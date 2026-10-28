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

const UserIcon = forwardRef(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 0.5,
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

    const headVariants = {
      normal: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration, ease: "easeInOut" },
      },
    };

    const bodyVariants = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
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
            <m.circle cx="12" cy="8" r="5" variants={headVariants} />
            <m.path
              d="M20 21a8 8 0 0 0-16 0"
              variants={bodyVariants}
              style={{ originX: "50%", originY: "100%" }}
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    );
  }
);

UserIcon.displayName = "UserIcon";
export { UserIcon };

