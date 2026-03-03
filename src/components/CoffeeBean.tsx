import { motion, MotionValue, useTransform } from "framer-motion";
import { useMemo } from "react";

interface CoffeeBeanProps {
  id: number;
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  initialX: number;
  initialY: number;
  dispersedX: number;
  dispersedY: number;
  finalX: number;
  finalY: number;
  layer: "foreground" | "mid" | "background";
  size: number;
  rotation: number;
  reducedMotion: boolean;
}

const layerConfig = {
  foreground: { parallax: 1.0, rotationRange: 12, opacity: 1, scale: 1 },
  mid: { parallax: 0.5, rotationRange: 8, opacity: 0.85, scale: 0.8 },
  background: { parallax: 0.2, rotationRange: 4, opacity: 0.6, scale: 0.6 },
};

export function CoffeeBean({
  id,
  scrollProgress,
  mouseX,
  mouseY,
  initialX,
  initialY,
  dispersedX,
  dispersedY,
  finalX,
  finalY,
  layer,
  size,
  rotation,
  reducedMotion,
}: CoffeeBeanProps) {
  const config = layerConfig[layer];

  // Scroll-driven position interpolation
  // 0-25%: disperse, 25-65%: reassemble, 65-100%: lock
  const x = useTransform(scrollProgress, [0, 0.25, 0.65, 1], [
    initialX,
    dispersedX * config.parallax,
    finalX,
    finalX,
  ]);

  const y = useTransform(scrollProgress, [0, 0.25, 0.65, 1], [
    initialY,
    dispersedY * config.parallax,
    finalY,
    finalY,
  ]);

  const rotate = useTransform(
    scrollProgress,
    [0, 0.25, 0.65, 1],
    [rotation, rotation + config.rotationRange * 2, rotation - config.rotationRange, rotation]
  );

  const scale = useTransform(scrollProgress, [0, 0.25, 0.65, 1], [
    config.scale,
    config.scale * 1.1,
    config.scale * 0.95,
    config.scale,
  ]);

  const opacity = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [
    0,
    config.opacity,
    config.opacity,
    config.opacity * 0.8,
  ]);

  // Bean SVG with gradient
  const beanGradientId = useMemo(() => `bean-gradient-${id}`, [id]);
  const highlightId = useMemo(() => `bean-highlight-${id}`, [id]);

  if (reducedMotion) {
    return (
      <div
        className="absolute"
        style={{
          left: `calc(50% + ${finalX}px)`,
          top: `calc(50% + ${finalY}px)`,
          width: size,
          height: size * 1.4,
          opacity: config.opacity * 0.5,
        }}
      >
        <svg viewBox="0 0 40 56" className="w-full h-full">
          <defs>
            <linearGradient id={beanGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(32, 55%, 32%)" />
              <stop offset="50%" stopColor="hsl(28, 50%, 22%)" />
              <stop offset="100%" stopColor="hsl(25, 45%, 12%)" />
            </linearGradient>
          </defs>
          <ellipse
            cx="20"
            cy="28"
            rx="18"
            ry="26"
            fill={`url(#${beanGradientId})`}
          />
          <path
            d="M20 8 Q22 28 20 48"
            stroke="hsl(25, 40%, 8%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        left: "50%",
        top: "50%",
        width: size,
        height: size * 1.4,
        marginLeft: -size / 2,
        marginTop: (-size * 1.4) / 2,
        zIndex: layer === "foreground" ? 30 : layer === "mid" ? 20 : 10,
      }}
    >
      <svg viewBox="0 0 40 56" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id={beanGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(32, 55%, 32%)" />
            <stop offset="50%" stopColor="hsl(28, 50%, 22%)" />
            <stop offset="100%" stopColor="hsl(25, 45%, 12%)" />
          </linearGradient>
          <radialGradient id={highlightId} cx="30%" cy="25%" r="50%">
            <stop offset="0%" stopColor="hsl(35, 60%, 42%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(32, 55%, 32%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Bean body */}
        <ellipse
          cx="20"
          cy="28"
          rx="18"
          ry="26"
          fill={`url(#${beanGradientId})`}
        />
        {/* Highlight */}
        <ellipse
          cx="20"
          cy="28"
          rx="18"
          ry="26"
          fill={`url(#${highlightId})`}
        />
        {/* Center crease */}
        <path
          d="M20 8 Q22 28 20 48"
          stroke="hsl(25, 40%, 8%)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary crease detail */}
        <path
          d="M20 12 Q18 28 20 44"
          stroke="hsl(25, 35%, 15%)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}
