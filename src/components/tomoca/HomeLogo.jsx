// HomeLogo is no longer used as a standalone section — removed from Home page.
// Keeping file to avoid broken imports from other pages if referenced.
import React from 'react';
import { img } from './Data';
import { motion } from 'framer-motion';

export default function HomeLogo() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-foreground py-28 md:py-44">
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--primary))_1px,transparent_0)] [background-size:30px_30px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[520px] w-[520px] rounded-full border border-primary/10 md:h-[700px] md:w-[700px]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[380px] w-[380px] rounded-full border border-primary/15 md:h-[520px] md:w-[520px]"
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.38, 0.18] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-64 w-64 rounded-full bg-primary blur-[90px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative flex flex-col items-center gap-8 text-center"
      >
        <motion.img
          src={img.logo}
          alt="Tomoca Coffee"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-80 object-contain brightness-0 invert drop-shadow-[0_0_100px_rgba(255,107,0,0.7)] md:w-[36rem]"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="h-px w-64 origin-center bg-primary/60"
        />
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.6em' }}
          transition={{ duration: 1.2, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-sm font-black uppercase text-background/60"
        >
          Addis Ababa · Since 1953
        </motion.p>
      </motion.div>
    </section>
  );
}