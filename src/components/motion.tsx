'use client';

/**
 * Reusable framer-motion wrappers layered onto existing USDS components.
 * All animations respect `prefers-reduced-motion` via useReducedMotion().
 */

import { type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

// ---------------------------------------------------------------------------
// AnimatedCard — fade-in + slight y-translate on mount, hover spring
// ---------------------------------------------------------------------------

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AnimatedTableRow — stagger-ready table row
// ---------------------------------------------------------------------------

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -3 },
  visible: { opacity: 1, x: 0 },
};

export function AnimatedTableRow({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.tr
      variants={reduced ? undefined : rowVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.15, delay: index * 0.02 }}
    >
      {children}
    </motion.tr>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — layoutId for smooth status change animations
// ---------------------------------------------------------------------------

export function StatusBadge({
  layoutId,
  children,
  className,
}: {
  layoutId: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <span className={className}>{children}</span>;
  }
  return (
    <motion.span layoutId={layoutId} className={className}>
      {children}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// MotionTabs — content crossfade for tab panels
// ---------------------------------------------------------------------------

const tabPanelVariants: Variants = {
  enter: { opacity: 0, y: 2 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -2 },
};

export function MotionTabPanel({
  activeKey,
  children,
}: {
  activeKey: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        variants={reduced ? undefined : tabPanelVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.12 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// StaggerContainer — parent for stagger animations
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// Re-export AnimatePresence for convenience
export { AnimatePresence };
