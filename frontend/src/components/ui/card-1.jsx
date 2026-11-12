import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

const ZoomImage = React.forwardRef(
  (
    {
      className,
      src,
      alt = 'Fine Jewellery',
      zoomScale = 1.45,
      transitionDuration = 0.3,
      borderRadius = 16,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(50);
    const mouseY = useMotionValue(50);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    const transformOrigin = useTransform(
      [smoothMouseX, smoothMouseY],
      ([latestX, latestY]) => `${latestX}% ${latestY}%`
    );

    const handleMouseMove = (e) => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      mouseX.set(((e.clientX - left) / width) * 100);
      mouseY.set(((e.clientY - top) / height) * 100);
    };

    const handleMouseLeave = () => {
      mouseX.set(50);
      mouseY.set(50);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative w-full h-full overflow-hidden', className)}
        style={{ borderRadius: `${borderRadius}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none"
          style={{
            borderRadius: `${borderRadius}px`,
            transformOrigin: transformOrigin
          }}
          whileHover={{ scale: zoomScale }}
          transition={{
            type: 'spring',
            duration: transitionDuration,
            bounce: 0
          }}
        />
      </motion.div>
    );
  }
);

ZoomImage.displayName = 'ZoomImage';

export { ZoomImage };
export default ZoomImage;