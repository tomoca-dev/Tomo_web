import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Reusable scroll reveal variants
export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }
  })
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut', delay: i * 0.1 }
  })
};

export const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }
  })
};

export const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }
  })
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }
  })
};

// Generic scroll reveal wrapper
export function Reveal({ children, variant = fadeUp, custom = 0, className = '', once = true, amount = 0.15 }) {
  return (
    <motion.div
      variants={variant}
      custom={custom}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered container
export function StaggerContainer({ children, className = '', stagger = 0.12, once = true }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated number counter
export function CountUp({ to, suffix = '', duration = 2 }) {
  const [count, setCount] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  React.useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}