import { MotionValue } from "framer-motion";
import { useMemo } from "react";
import { CoffeeBean } from "./CoffeeBean";

interface BeanFieldProps {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  beanCount: number;
  reducedMotion: boolean;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function BeanField({
  scrollProgress,
  mouseX,
  mouseY,
  beanCount,
  reducedMotion,
}: BeanFieldProps) {
  const beans = useMemo(() => {
    const result = [];
    const layers: Array<"foreground" | "mid" | "background"> = [
      "foreground",
      "mid",
      "background",
    ];

    for (let i = 0; i < beanCount; i++) {
      const seed = i + 1;
      const layer = layers[i % 3];

      // Initial position: tight cluster around center
      const angle = seededRandom(seed) * Math.PI * 2;
      const radius = seededRandom(seed * 2) * 60 + 20;
      const initialX = Math.cos(angle) * radius;
      const initialY = Math.sin(angle) * radius;

      // Dispersed position: spread outward
      const disperseAngle = seededRandom(seed * 3) * Math.PI * 2;
      const disperseRadius = seededRandom(seed * 4) * 300 + 150;
      const dispersedX = Math.cos(disperseAngle) * disperseRadius;
      const dispersedY = Math.sin(disperseAngle) * disperseRadius - 50;

      // Final position: form product shape (oval/pouch formation)
      const finalAngle = (i / beanCount) * Math.PI * 2;
      const finalRadius = 80 + seededRandom(seed * 5) * 40;
      const finalX = Math.cos(finalAngle) * finalRadius;
      const finalY = Math.sin(finalAngle) * finalRadius * 0.7 + 30;

      // Size based on layer
      const baseSize =
        layer === "foreground" ? 32 : layer === "mid" ? 24 : 18;
      const size = baseSize + seededRandom(seed * 6) * 8;

      // Random rotation
      const rotation = seededRandom(seed * 7) * 360 - 180;

      result.push({
        id: i,
        layer,
        initialX,
        initialY,
        dispersedX,
        dispersedY,
        finalX,
        finalY,
        size,
        rotation,
      });
    }

    return result;
  }, [beanCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {beans.map((bean) => (
        <CoffeeBean
          key={bean.id}
          id={bean.id}
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          initialX={bean.initialX}
          initialY={bean.initialY}
          dispersedX={bean.dispersedX}
          dispersedY={bean.dispersedY}
          finalX={bean.finalX}
          finalY={bean.finalY}
          layer={bean.layer}
          size={bean.size}
          rotation={bean.rotation}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
