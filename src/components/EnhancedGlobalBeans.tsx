import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBeanDensity } from "@/contexts/BeanDensityContext";

interface EnhancedGlobalBeansProps {
  baseCount?: number;
  className?: string;
  pageIntensity?: "default" | "heritage" | "purpose" | "collection";
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Performance-safe bean counts per device tier
const BEAN_LIMITS = {
  desktop: { min: 8, max: 48, default: 16 },
  tablet: { min: 6, max: 28, default: 10 },
  mobile: { min: 4, max: 16, default: 6 },
};

// Page-specific intensity multipliers for extra motion
const PAGE_INTENSITY = {
  default: { countMultiplier: 1, motionScale: 1, morphSpeed: 1 },
  heritage: { countMultiplier: 1.3, motionScale: 1.5, morphSpeed: 0.7 },
  purpose: { countMultiplier: 1.2, motionScale: 1.4, morphSpeed: 0.8 },
  collection: { countMultiplier: 1.4, motionScale: 1.6, morphSpeed: 0.6 },
};

// Parallax layers with different depths
const PARALLAX_LAYERS = [
  { z: 0.2, opacity: 0.02, sizeScale: 0.6, speed: 0.3 },  // Far background
  { z: 0.5, opacity: 0.04, sizeScale: 0.8, speed: 0.6 },  // Mid layer
  { z: 1.0, opacity: 0.08, sizeScale: 1.0, speed: 1.0 },  // Foreground
];

function getDeviceMemory(): number {
  // @ts-ignore - deviceMemory is not in all browsers
  return navigator.deviceMemory || 4;
}

export function EnhancedGlobalBeans({
  baseCount,
  className = "",
  pageIntensity = "default",
}: EnhancedGlobalBeansProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isLowPower, setIsLowPower] = useState(false);
  const { multiplier: densityMultiplier } = useBeanDensity();

  useEffect(() => {
    const memory = getDeviceMemory();
    setIsLowPower(memory < 2);
  }, []);

  // Calculate safe bean count based on device capabilities and settings
  const safeCount = useMemo(() => {
    if (reducedMotion || isLowPower) return 0;

    const limits = isMobile
      ? BEAN_LIMITS.mobile
      : typeof window !== "undefined" && window.innerWidth < 1024
      ? BEAN_LIMITS.tablet
      : BEAN_LIMITS.desktop;

    const intensity = PAGE_INTENSITY[pageIntensity];
    const base = baseCount !== undefined ? baseCount : limits.default;
    const adjusted = Math.round(base * intensity.countMultiplier * densityMultiplier);

    // Apply device memory cap for high density settings
    const memoryCap = getDeviceMemory() < 4 ? limits.max * 0.6 : limits.max;
    return Math.min(Math.max(adjusted, limits.min), memoryCap);
  }, [baseCount, isMobile, reducedMotion, isLowPower, pageIntensity, densityMultiplier]);

  const intensity = PAGE_INTENSITY[pageIntensity];

  // Generate beans across all parallax layers
  const beans = useMemo(() => {
    const result: Array<{
      id: string;
      layer: number;
      x: number;
      y: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      opacity: number;
      parallaxZ: number;
      speed: number;
    }> = [];

    const beansPerLayer = Math.ceil(safeCount / PARALLAX_LAYERS.length);

    PARALLAX_LAYERS.forEach((layer, layerIndex) => {
      for (let i = 0; i < beansPerLayer; i++) {
        const seed = layerIndex * 1000 + i + 42;
        result.push({
          id: `${layerIndex}-${i}`,
          layer: layerIndex,
          x: seededRandom(seed) * 100,
          y: seededRandom(seed * 2) * 100,
          size: (12 + seededRandom(seed * 3) * 20) * layer.sizeScale,
          rotation: seededRandom(seed * 4) * 360,
          duration: (40 + seededRandom(seed * 5) * 40) / (layer.speed * intensity.morphSpeed),
          delay: seededRandom(seed * 6) * 20,
          opacity: layer.opacity + seededRandom(seed * 7) * 0.02,
          parallaxZ: layer.z,
          speed: layer.speed,
        });
      }
    });

    return result;
  }, [safeCount, intensity.morphSpeed]);

  if (safeCount === 0) return null;

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
      style={{ perspective: "1000px" }}
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
            y: [0, -30 * intensity.motionScale, 0, 20 * intensity.motionScale, 0],
            x: [0, 15 * intensity.motionScale, -10 * intensity.motionScale, 5, 0],
            rotate: [
              bean.rotation,
              bean.rotation + 12 * intensity.motionScale,
              bean.rotation - 8 * intensity.motionScale,
              bean.rotation,
            ],
            scale: [1, 1.02, 0.98, 1], // Subtle morph/breathing effect
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
            transform: `translate3d(0, 0, ${bean.parallaxZ * -100}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <svg viewBox="0 0 40 56" className="w-full h-full">
            <defs>
              <linearGradient
                id={`enhanced-bean-${bean.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
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
              fill={`url(#enhanced-bean-${bean.id})`}
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
