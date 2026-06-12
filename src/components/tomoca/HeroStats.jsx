import React from 'react';
import { motion } from 'framer-motion';
import { CountUp, StaggerContainer, fadeUp } from './ScrollReveal';

const STATS = [
  { value: 70, suffix: '+', label: 'Years Roasting' },
  { value: 3, suffix: '', label: 'Locations in Addis' },
  { value: 100, suffix: '%', label: 'Ethiopian Arabica' },
  { value: 1953, suffix: '', label: 'Founded' },
];

export default function HeroStats() {
  return (
    <div className="relative z-10 border-t border-foreground/10 bg-foreground/95 backdrop-blur-xl">
      <StaggerContainer className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-background/10 md:grid-cols-4 px-0">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            custom={i}
            className="flex flex-col items-center py-8 px-4 text-center"
          >
            <span className="font-display text-4xl font-black text-primary md:text-5xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </span>
            <span className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-background/55">{s.label}</span>
          </motion.div>
        ))}
      </StaggerContainer>
    </div>
  );
}