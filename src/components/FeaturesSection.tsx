import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, Globe, Award, Coffee } from "lucide-react";
import { CoffeeSplash } from "./CoffeeSplash";
import { SectionBeans } from "./SectionBeans";

const features = [
  {
    icon: Leaf,
    title: "Single Origin",
    description: "100% Ethiopian Arabica from the highlands of Yirgacheffe and Sidamo, where coffee was first discovered.",
  },
  {
    icon: Globe,
    title: "Direct Trade",
    description: "We work directly with farming cooperatives, ensuring fair prices and sustainable practices.",
  },
  {
    icon: Award,
    title: "Master Roasted",
    description: "Small-batch roasting in Addis Ababa using traditional methods perfected over seven decades.",
  },
  {
    icon: Coffee,
    title: "Fresh Delivered",
    description: "Roasted to order and shipped within 24 hours to preserve peak flavor and aroma.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-card overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* 3D Coffee splash effects */}
      <CoffeeSplash variant="right" intensity="subtle" />
      
      {/* Decorative beans that morph into a circle pattern */}
      <SectionBeans pattern="circle" count={16} />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_transparent_0%,_hsl(var(--card)/0.8)_60%)]" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-primary mb-4 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
          >
            Our Promise
          </motion.span>
          <h2
            id="features-heading"
            className="text-3xl md:text-5xl font-display font-medium text-foreground mb-6"
          >
            Crafted with <span className="text-gradient-gold">Purpose</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every bean tells a story of tradition, sustainability, and uncompromising quality.
          </p>
        </motion.div>

        {/* Features grid with enhanced 3D cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.22, 0.61, 0.36, 1],
                delay: index * 0.1,
              }}
              className="group relative perspective-1000"
            >
              {/* Card with 3D hover effect */}
              <div className="relative p-8 rounded-xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-glow hover:-translate-y-1 transform-gpu">
                {/* Floating icon with glow */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg"
                  >
                    <feature.icon className="w-7 h-7" />
                  </motion.div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 w-14 h-14 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-medium text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line with animation */}
                <motion.div 
                  className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl overflow-hidden"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-primary via-gold to-copper" />
                </motion.div>

                {/* Ambient corner glow */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-2/3 bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-1/3 h-1/2 bg-copper/5 blur-[100px] pointer-events-none" />
    </section>
  );
}
