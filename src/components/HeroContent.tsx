import { motion, MotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroContentProps {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}

export function HeroContent({ scrollProgress, reducedMotion }: HeroContentProps) {
  const letterSpacing = useTransform(scrollProgress, [0, 0.65], ["0.08em", "0.02em"]);
  const headlineOpacity = useTransform(scrollProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0.8]);
  const headlineY = useTransform(scrollProgress, [0, 0.65], [20, 0]);
  const subheadOpacity = useTransform(scrollProgress, [0.15, 0.3, 0.8, 1], [0, 1, 1, 0.6]);
  const ctaOpacity = useTransform(scrollProgress, [0.25, 0.4], [0, 1]);
  const ctaScale = useTransform(scrollProgress, [0.25, 0.4], [0.95, 1]);

  if (reducedMotion) {
    return (
      <div className="relative z-40 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <span className="text-2xl md:text-3xl font-display tracking-[0.3em] text-primary uppercase">
            TOMOCA
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Ethiopian Heritage,
          <br />
          <span className="text-gradient-gold">Crafted Excellence</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          From the birthplace of coffee to your cup. Premium single-origin beans,
          roasted to perfection in the heart of Addis Ababa since 1953.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Button variant="hero" size="lg" className="min-w-[200px]" asChild>
            <Link to="/shop">Explore Our Coffee</Link>
          </Button>
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/our-story">Our Story</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-40 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        className="mb-8"
      >
        <span className="text-2xl md:text-3xl font-display tracking-[0.3em] text-primary uppercase">
          TOMOCA
        </span>
      </motion.div>

      <motion.h1
        style={{ letterSpacing, opacity: headlineOpacity, y: headlineY }}
        className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-foreground leading-tight mb-6"
      >
        Ethiopian Heritage,
        <br />
        <span className="text-gradient-gold">Crafted Excellence</span>
      </motion.h1>

      <motion.p
        style={{ opacity: subheadOpacity }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
      >
        From the birthplace of coffee to your cup. Premium single-origin beans,
        roasted to perfection in the heart of Addis Ababa since 1953.
      </motion.p>

      <motion.div
        style={{ opacity: ctaOpacity, scale: ctaScale }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button variant="hero" size="lg" className="min-w-[200px]" asChild>
          <Link to="/shop">Explore Our Coffee</Link>
        </Button>
        <Button variant="heroOutline" size="lg" asChild>
          <Link to="/our-story">Our Story</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to Discover</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
