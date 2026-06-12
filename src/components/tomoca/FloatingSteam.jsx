import React from 'react';
import { motion } from 'framer-motion';

// Quirky floating steam wisps — decorative element for hero
export default function FloatingSteam({ count = 5, className = '' }) {
  const wisps = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 20 + i * 18 + (i % 2 === 0 ? 0 : 8),
    delay: i * 0.7,
    duration: 2.8 + i * 0.4,
    size: 6 + (i % 3) * 4,
  }));

  return (
    <div className={`pointer-events-none relative flex items-end gap-1 ${className}`}>
      {wisps.map(w => (
        <motion.div
          key={w.id}
          style={{ width: w.size, height: w.size * 3 }}
          animate={{
            y: [0, -40, -80],
            opacity: [0, 0.6, 0],
            scaleX: [1, 1.4, 0.6],
            rotate: [0, w.id % 2 === 0 ? 12 : -12, 0],
          }}
          transition={{
            duration: w.duration,
            delay: w.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="rounded-full bg-background/30 blur-[3px]"
        />
      ))}
    </div>
  );
}