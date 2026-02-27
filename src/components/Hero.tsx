import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { BeanField } from "./BeanField";
import { HeroContent } from "./HeroContent";
import { useIsMobile } from "@/hooks/use-mobile";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowMemory, setLowMemory] = useState(false);
  const isMobile = useIsMobile();

  // Detect user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Check device memory
    if ("deviceMemory" in navigator && (navigator as any).deviceMemory < 2) {
      setLowMemory(true);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Map scroll to hero animation range
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Mouse position for cursor proximity effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion || lowMemory || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reducedMotion, lowMemory, isMobile]);

  // Determine bean count based on device
  const getBeanCount = () => {
    if (reducedMotion || lowMemory) return 0;
    if (isMobile) return 16;
    if (window.innerWidth < 1024) return 28;
    return 48;
  };

  const beanCount = getBeanCount();
  const shouldAnimate = !reducedMotion && !lowMemory;

  // Background gradient based on scroll
  const bgOpacity = useTransform(scrollProgress, [0, 0.5, 1], [1, 0.95, 0.9]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
      aria-label="Hero section"
    >
      {/* Ambient background elements */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />
        
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiPjwvcmVjdD4KPC9zdmc+')] mix-blend-overlay" />
        
        {/* Glow behind content */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </motion.div>

      {/* Bean animation field */}
      {beanCount > 0 && (
        <BeanField
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          beanCount={beanCount}
          reducedMotion={!shouldAnimate}
        />
      )}

      {/* Hero content */}
      <HeroContent
        scrollProgress={scrollProgress}
        reducedMotion={!shouldAnimate}
      />

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-border/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-border/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-border/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-border/30" />
    </section>
  );
}
