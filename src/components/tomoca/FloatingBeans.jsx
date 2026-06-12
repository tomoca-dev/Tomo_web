import React from 'react';
import { motion } from 'framer-motion';

const BEANS = ['☕', '🫘', '✨', '🌿', '☕', '🫘'];

// Randomly floating coffee bean emojis across a section
export default function FloatingBeans({ count = 6 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BEANS.slice(0, count).map((b, i) => {
        const left = 5 + (i * 17) % 90;
        const top = 10 + (i * 23) % 75;
        const duration = 5 + (i * 1.3) % 4;
        const delay = i * 0.9;
        return (
          <motion.span
            key={i}
            style={{ left: `${left}%`, top: `${top}%`, fontSize: 18 + (i % 3) * 6 }}
            animate={{
              y: [0, -18, 4, -10, 0],
              rotate: [0, 15, -10, 20, 0],
              opacity: [0.18, 0.45, 0.2, 0.4, 0.18],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute select-none"
          >
            {b}
          </motion.span>
        );
      })}
    </div>
  );
}