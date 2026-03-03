import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CoffeeSplash } from "./CoffeeSplash";
import { SectionBeans } from "./SectionBeans";
import tomocaLady from "@/assets/tomoca-lady.jpg";

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { value: "70+", label: "Years", suffix: "" },
    { value: "3", label: "Regions", suffix: "" },
    { value: "100", label: "Ethiopian", suffix: "%" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-secondary overflow-hidden"
      aria-labelledby="story-heading"
    >
      {/* 3D Coffee splash effects */}
      <CoffeeSplash variant="right" intensity="medium" />
      
      {/* Decorative beans in wave pattern */}
      <SectionBeans pattern="wave" count={18} />

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_left,_hsl(38_72%_52%/0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(25_65%_45%/0.08)_0%,_transparent_50%)]" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side with 3D depth */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative perspective-1000 group"
          >
          <motion.div 
              className="relative cursor-pointer"
              whileHover={{ rotateY: 5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 140, damping: 28 }}
            >
              {/* Main image container with paintbrush effect */}
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-background relative shadow-elevated transform-gpu">
                {/* Paintbrush textured background */}
                <div className="absolute inset-0">
                  {/* Base warm tone */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30_40%_65%)] via-[hsl(25_35%_55%)] to-[hsl(20_30%_40%)]" />
                  
                  {/* Paint stroke textures via layered gradients */}
                  <div className="absolute inset-0 opacity-40" style={{
                    background: `
                      radial-gradient(ellipse 80% 20% at 20% 30%, hsl(35 50% 70% / 0.6), transparent),
                      radial-gradient(ellipse 60% 30% at 70% 20%, hsl(28 45% 55% / 0.5), transparent),
                      radial-gradient(ellipse 90% 15% at 40% 70%, hsl(22 40% 50% / 0.4), transparent),
                      radial-gradient(ellipse 50% 40% at 80% 60%, hsl(30 35% 60% / 0.3), transparent)
                    `
                  }} />
                  
                  {/* Diagonal brush strokes */}
                  <div className="absolute inset-0 opacity-20" style={{
                    background: `
                      repeating-linear-gradient(135deg, transparent, transparent 8px, hsl(32 40% 60% / 0.3) 8px, hsl(32 40% 60% / 0.3) 10px),
                      repeating-linear-gradient(45deg, transparent, transparent 12px, hsl(25 35% 50% / 0.2) 12px, hsl(25 35% 50% / 0.2) 14px)
                    `
                  }} />
                  
                  {/* Rough edge paint splatters */}
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-[hsl(35_50%_70%/0.3)] rounded-full blur-2xl" />
                  <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[hsl(25_40%_50%/0.25)] rounded-full blur-3xl" />
                  <div className="absolute top-1/3 -right-8 w-24 h-48 bg-[hsl(30_45%_60%/0.2)] rounded-full blur-2xl rotate-45" />
                </div>
                
                {/* The Lady image */}
                <img 
                  src={tomocaLady} 
                  alt="TOMOCA heritage - Ethiopian coffee lady" 
                  className="absolute inset-0 w-full h-full object-cover object-top mix-blend-multiply opacity-90 transition-all duration-700 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105"
                />
                
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
                
                {/* Year display overlaid */}
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
                  <motion.span 
                    className="text-[60px] md:text-[80px] font-display text-cream/80 leading-none drop-shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    1953
                  </motion.span>
                  <motion.span 
                    className="text-xs tracking-[0.4em] uppercase text-cream/60 mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Addis Ababa
                  </motion.span>
                </div>

                {/* Decorative frame */}
                <div className="absolute inset-4 border border-cream/15 rounded-xl pointer-events-none" />
              </div>

              {/* Floating accent orb */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute -bottom-8 -right-8 w-40 h-40"
              >
                <div className="w-full h-full bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute inset-4 bg-gold/10 rounded-full blur-2xl" />
              </motion.div>

              {/* Corner decoration */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-4"
            >
              <span className="w-8 h-px bg-primary" />
              Our Heritage
            </motion.span>
            <h2
              id="story-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6 leading-tight"
            >
              Seven Decades of
              <br />
              <span className="text-gradient-gold">Coffee Excellence</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In 1953, in the bustling heart of Addis Ababa, TOMOCA opened its doors
                with a simple mission: to share the extraordinary coffee of our homeland
                with the world.
              </p>
              <p>
                Ethiopia is the birthplace of coffee—where the coffee plant was first
                discovered in the ancient forests of Kaffa. Our beans carry this legacy,
                grown in the same soil that gave birth to the world's most beloved beverage.
              </p>
              <p>
                Today, we continue our founders' tradition, carefully selecting and
                roasting each batch to honor the farmers, the land, and the centuries
                of coffee culture that came before us.
              </p>
            </div>

            {/* Stats with enhanced 3D styling */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 mt-10 pt-10 border-t border-border/50">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5 + index * 0.1,
                    ease: [0.22, 0.61, 0.36, 1]
                  }}
                  className="text-center relative group"
                >
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  
                  <span className="text-3xl md:text-4xl lg:text-5xl font-display text-primary block">
                    {stat.value}
                    <span className="text-2xl">{stat.suffix}</span>
                  </span>
                  <span className="block text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
