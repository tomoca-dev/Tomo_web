import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-3 flex items-center gap-3 text-sm font-black uppercase tracking-[0.35em] text-primary"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-block h-px w-8 bg-primary origin-left"
          />
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={`font-display text-4xl font-black tracking-tight md:text-6xl lg:text-7xl ${light ? 'text-background' : 'text-foreground'}`}
      >
        {title}
      </motion.h2>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className={`mt-5 text-lg leading-relaxed ${light ? 'text-background/70' : 'text-muted-foreground'}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}