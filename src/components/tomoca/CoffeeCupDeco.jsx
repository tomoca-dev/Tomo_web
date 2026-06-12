import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Quirky animated coffee cup with steam — click it for a surprise
export default function CoffeeCupDeco() {
  const [clicked, setClicked] = useState(0);
  const msgs = ['☕ Fresh brew!', '🌍 Ethiopia calling!', '🔥 Since 1953!', '✨ That\'s the good stuff!'];

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Steam */}
      <div className="mb-1 flex gap-1.5 h-8">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5], scaleX: [1, 1.3, 0.8] }}
            transition={{ duration: 1.6 + i * 0.3, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 rounded-full bg-primary/40"
          />
        ))}
      </div>

      {/* Cup */}
      <motion.button
        onClick={() => setClicked(c => c + 1)}
        whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="text-4xl cursor-pointer"
        title="Click me!"
        aria-label="Animated coffee cup - click for a surprise"
      >
        ☕
      </motion.button>

      {/* Surprise message */}
      <AnimatePresence>
        {clicked > 0 && (
          <motion.div
            key={clicked}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.7 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow-lg"
          >
            {msgs[(clicked - 1) % msgs.length]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}