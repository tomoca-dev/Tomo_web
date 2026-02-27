import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionBeansProps {
  pattern: "scattered" | "circle" | "wave" | "arc" | "cluster";
  count?: number;
  className?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function SectionBeans({ pattern, count = 12, className = "" }: SectionBeansProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const isMobile = useIsMobile();

  // Reduce count on mobile
  const actualCount = isMobile ? Math.floor(count * 0.5) : count;

  const beans = useMemo(() => {
    const result = [];

    for (let i = 0; i < actualCount; i++) {
      const seed = i + 1;
      let x = 0, y = 0;
      const size = 16 + seededRandom(seed * 6) * 16;
      const rotation = seededRandom(seed * 7) * 360 - 180;
      const delay = i * 0.05;

      switch (pattern) {
        case "scattered":
          x = (seededRandom(seed) - 0.5) * 100;
          y = (seededRandom(seed * 2) - 0.5) * 100;
          break;
        case "circle":
          const angle = (i / actualCount) * Math.PI * 2;
          const radius = 35 + seededRandom(seed * 3) * 10;
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          break;
        case "wave":
          x = (i / actualCount) * 100 - 50;
          y = Math.sin((i / actualCount) * Math.PI * 2) * 20;
          break;
        case "arc":
          const arcAngle = (i / actualCount) * Math.PI - Math.PI / 2;
          const arcRadius = 40;
          x = Math.cos(arcAngle) * arcRadius;
          y = Math.sin(arcAngle) * arcRadius + 30;
          break;
        case "cluster":
          const clusterAngle = seededRandom(seed) * Math.PI * 2;
          const clusterRadius = seededRandom(seed * 2) * 25;
          x = Math.cos(clusterAngle) * clusterRadius;
          y = Math.sin(clusterAngle) * clusterRadius;
          break;
      }

      result.push({ id: i, x, y, size, rotation, delay });
    }

    return result;
  }, [pattern, actualCount]);

  return (
    <div 
      ref={sectionRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          initial={{ opacity: 0, scale: 0, rotate: bean.rotation - 45 }}
          animate={isInView ? { 
            opacity: 0.6, 
            scale: 1, 
            rotate: bean.rotation 
          } : {}}
          transition={{
            duration: 0.8,
            delay: bean.delay,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="absolute"
          style={{
            left: `calc(50% + ${bean.x}%)`,
            top: `calc(50% + ${bean.y}%)`,
            width: bean.size,
            height: bean.size * 1.4,
          }}
        >
          <svg viewBox="0 0 40 56" className="w-full h-full">
            <defs>
              <linearGradient id={`section-bean-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(32, 55%, 32%)" />
                <stop offset="50%" stopColor="hsl(28, 50%, 22%)" />
                <stop offset="100%" stopColor="hsl(25, 45%, 12%)" />
              </linearGradient>
              <radialGradient id={`section-highlight-${bean.id}`} cx="30%" cy="25%" r="50%">
                <stop offset="0%" stopColor="hsl(35, 60%, 42%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(32, 55%, 32%)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse
              cx="20"
              cy="28"
              rx="18"
              ry="26"
              fill={`url(#section-bean-${bean.id})`}
            />
            <ellipse
              cx="20"
              cy="28"
              rx="18"
              ry="26"
              fill={`url(#section-highlight-${bean.id})`}
            />
            <path
              d="M20 8 Q22 28 20 48"
              stroke="hsl(25, 40%, 8%)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
