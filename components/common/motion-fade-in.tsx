'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type MotionAs = 'div' | 'article' | 'section';

interface MotionFadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'whileInView' | 'viewport' | 'transition'> {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  /** Use whileInView (scroll-triggered) vs animate (mount-triggered) */
  trigger?: 'view' | 'mount';
  as?: MotionAs;
  className?: string;
}

export function MotionFadeIn({
  children,
  delay = 0,
  y = 20,
  trigger = 'view',
  as = 'div',
  className,
  ...rest
}: MotionFadeInProps) {
  const Component = motion[as] as typeof motion.div;

  const common = {
    initial: { opacity: 0, y },
    transition: { duration: 0.6, delay },
    className,
    ...rest,
  };

  if (trigger === 'mount') {
    return (
      <Component animate={{ opacity: 1, y: 0 }} {...common}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      {...common}
    >
      {children}
    </Component>
  );
}
