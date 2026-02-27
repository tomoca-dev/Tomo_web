import { motion } from "framer-motion";

interface CoffeeSplashProps {
  variant?: "left" | "right" | "center";
  className?: string;
  intensity?: "subtle" | "medium" | "bold";
}

export function CoffeeSplash({ 
  variant = "center", 
  className = "",
  intensity = "medium"
}: CoffeeSplashProps) {
  const opacityMap = {
    subtle: 0.15,
    medium: 0.25,
    bold: 0.4,
  };

  const baseOpacity = opacityMap[intensity];

  const positionClasses = {
    left: "left-0 -translate-x-1/2",
    right: "right-0 translate-x-1/2",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main splash blob */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
        viewport={{ once: true }}
        className={`absolute top-1/2 -translate-y-1/2 ${positionClasses[variant]}`}
      >
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
        >
          <defs>
            {/* 3D gradient for coffee splash */}
            <radialGradient id="splash-gradient" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(32, 55%, 32%)" stopOpacity={baseOpacity * 1.5} />
              <stop offset="40%" stopColor="hsl(28, 50%, 22%)" stopOpacity={baseOpacity} />
              <stop offset="70%" stopColor="hsl(25, 45%, 12%)" stopOpacity={baseOpacity * 0.7} />
              <stop offset="100%" stopColor="hsl(25, 60%, 8%)" stopOpacity="0" />
            </radialGradient>
            
            {/* Gold highlight */}
            <radialGradient id="splash-highlight" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="hsl(38, 72%, 52%)" stopOpacity={baseOpacity * 0.6} />
              <stop offset="100%" stopColor="hsl(38, 72%, 52%)" stopOpacity="0" />
            </radialGradient>

            {/* Blur filter for depth */}
            <filter id="splash-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
            </filter>
          </defs>

          {/* Background splash layer */}
          <motion.ellipse
            cx="300"
            cy="320"
            rx="280"
            ry="250"
            fill="url(#splash-gradient)"
            filter="url(#splash-blur)"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 0.95, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Mid splash blob */}
          <motion.path
            d="M300 80 
               Q420 120 480 220 
               Q540 340 480 440 
               Q400 540 280 520 
               Q140 500 100 380 
               Q60 260 120 160 
               Q180 60 300 80Z"
            fill="url(#splash-gradient)"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 5, -3, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Highlight layer */}
          <ellipse
            cx="220"
            cy="200"
            rx="120"
            ry="100"
            fill="url(#splash-highlight)"
          />

          {/* Floating coffee drops */}
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx={150 + i * 60}
              cy={150 + (i % 3) * 100}
              r={8 + (i % 3) * 4}
              fill="hsl(28, 50%, 22%)"
              fillOpacity={baseOpacity * 0.8}
              initial={{ y: 0, opacity: baseOpacity * 0.8 }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [baseOpacity * 0.8, baseOpacity * 0.5, baseOpacity * 0.8]
              }}
              transition={{ 
                duration: 3 + i * 0.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Secondary ambient splash */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        viewport={{ once: true }}
        className={`absolute bottom-0 ${variant === "left" ? "right-0" : "left-0"} w-[400px] h-[400px]`}
      >
        <div 
          className="w-full h-full rounded-full blur-[80px]"
          style={{
            background: `radial-gradient(circle, hsl(38 72% 52% / ${baseOpacity * 0.4}), transparent 70%)`
          }}
        />
      </motion.div>
    </div>
  );
}
