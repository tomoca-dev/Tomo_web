import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GlobalBeansProps {
  count?: number;
  className?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Performance-safe bean counts
const BEAN_LIMITS = {
  desktop: { min: 8, max: 24, default: 16 },
  tablet: { min: 6, max: 16, default: 10 },
  mobile: { min: 4, max: 10, default: 6 },
};

function getDeviceMemory(): number {
  // @ts-ignore - deviceMemory is not in all browsers
  return navigator.deviceMemory || 4;
}

export function GlobalBeans({ count, className = "" }: GlobalBeansProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const memory = getDeviceMemory();
    setIsLowPower(memory < 2);
  }, []);

  // Calculate safe bean count based on device capabilities
  const safeCount = useMemo(() => {
    if (reducedMotion || isLowPower) return 0;
    
    const limits = isMobile ? BEAN_LIMITS.mobile : 
      (typeof window !== 'undefined' && window.innerWidth < 1024) ? BEAN_LIMITS.tablet : 
      BEAN_LIMITS.desktop;
    
    if (count !== undefined) {
      return Math.min(Math.max(count, limits.min), limits.max);
    }
    return limits.default;
  }, [count, isMobile, reducedMotion, isLowPower]);

  const beans = useMemo(() => {
    const result = [];
    for (let i = 0; i < safeCount; i++) {
      const seed = i + 42;
      result.push({
        id: i,
        x: seededRandom(seed) * 100,
        y: seededRandom(seed * 2) * 100,
        size: 12 + seededRandom(seed * 3) * 20,
        rotation: seededRandom(seed * 4) * 360,
        duration: 40 + seededRandom(seed * 5) * 40, // 40-80s per cycle
        delay: seededRandom(seed * 6) * 20,
        opacity: 0.03 + seededRandom(seed * 7) * 0.06,
      });
    }
    return result;
  }, [safeCount]);

  if (safeCount === 0) return null;

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          className="absolute will-change-transform"
          initial={{
            left: `${bean.x}%`,
            top: `${bean.y}%`,
            rotate: bean.rotation,
            opacity: bean.opacity,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [bean.rotation, bean.rotation + 8, bean.rotation - 5, bean.rotation],
          }}
          transition={{
            duration: bean.duration,
            repeat: Infinity,
            ease: "linear",
            delay: bean.delay,
          }}
          style={{
            width: bean.size,
            height: bean.size * 1.4,
          }}
        >
          <svg viewBox="0 0 40 56" className="w-full h-full">
            <defs>
              <linearGradient id={`global-bean-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--bean-light))" />
                <stop offset="50%" stopColor="hsl(var(--bean-medium))" />
                <stop offset="100%" stopColor="hsl(var(--bean-dark))" />
              </linearGradient>
            </defs>
            <ellipse
              cx="20"
              cy="28"
              rx="18"
              ry="26"
              fill={`url(#global-bean-${bean.id})`}
            />
            <path
              d="M20 8 Q22 28 20 48"
              stroke="hsl(var(--espresso))"
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
