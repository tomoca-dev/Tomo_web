import React from 'react';
import { motion } from 'framer-motion';

// Animated equalizer bars — for Spotify section
export default function SpotifyBars({ color = '#1DB954', count = 5 }) {
  const heights = [14, 22, 30, 18, 26];
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {heights.slice(0, count).map((h, i) => (
        <motion.div
          key={i}
          style={{ width: 4, backgroundColor: color }}
          animate={{ height: [h * 0.4, h, h * 0.6, h * 1.1, h * 0.5, h] }}
          transition={{ duration: 0.9 + i * 0.15, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full"
        />
      ))}
    </div>
  );
}