import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { img } from './Data';

/**
 * Full-screen logo intro that "opens" as you scroll.
 * - Sticky panel covers 200vh of scroll distance
 * - Logo scales up and fades as user scrolls through
 * - The panel clips open (scaleY from center) revealing content beneath
 */
export default function LogoIntro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Panel clips shut → open as progress goes 0→1
  const clipTop = useTransform(scrollYProgress, [0, 0.85], ['0%', '50%']);
  const clipBottom = useTransform(scrollYProgress, [0, 0.85], ['100%', '50%']);

  // Logo: scale up subtly then fade out
  const logoScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.18]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.55, 0.75], [1, 1, 0]);

  // Tagline fades out earlier
  const tagOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Scroll cue fades fast
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    // Scroll container — 200vh gives enough travel for the animation
    <div ref={ref} className="relative h-[200vh]">
      {/* Sticky viewport-filling panel */}
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden bg-foreground transform-gpu"
        style={{
          clipPath: useTransform(
            [clipTop, clipBottom],
            ([t, b]) => `inset(${t} 0% ${`calc(100% - ${b})`} 0%)`
          ),
        }}
      >
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--primary))_1px,transparent_0)] [background-size:32px_32px]" />

        {/* Static glow behind logo */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/18 blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.img
            src={img.logo}
            alt="Tomoca Coffee"
            style={{ scale: logoScale, opacity: logoOpacity }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[85vw] max-w-4xl object-contain brightness-0 invert drop-shadow-[0_0_80px_rgba(255,107,0,0.55)] transform-gpu"
          />

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: tagOpacity }}
            className="mt-8 h-px w-48 origin-center bg-primary/40"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.05em' }}
            animate={{ opacity: 1, letterSpacing: '0.55em' }}
            transition={{ duration: 1.4, delay: 0.9 }}
            style={{ opacity: tagOpacity }}
            className="mt-5 text-[11px] font-black uppercase text-background/45"
          >
            Addis Ababa · Since 1953
          </motion.p>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-background/20 pt-2">
            <div className="h-2 w-0.5 rounded-full bg-background/30" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-background/30">Scroll</span>
        </motion.div>
      </motion.div>
    </div>
  );
}