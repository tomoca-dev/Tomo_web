import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type DensityLevel = "default" | "plus25" | "plus50" | "plus200";

interface BeanDensityContextType {
  density: DensityLevel;
  multiplier: number;
  setDensity: (level: DensityLevel) => void;
  isLoading: boolean;
}

const densityMultipliers: Record<DensityLevel, number> = {
  default: 1.0,
  plus25: 1.25,
  plus50: 1.5,
  plus200: 3.0,
};

const BeanDensityContext = createContext<BeanDensityContextType | undefined>(undefined);

export function BeanDensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<DensityLevel>("default");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage for immediate UX, then sync with DB
    const stored = localStorage.getItem("tomoca-bean-density") as DensityLevel;
    if (stored && densityMultipliers[stored]) {
      setDensityState(stored);
    }
    
    // Fetch from DB for admin-set global default
    fetchGlobalSetting();
  }, []);

  const fetchGlobalSetting = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "bean_density")
        .maybeSingle();
      
      if (data?.value) {
        const setting = data.value as { level: DensityLevel };
        // Only use global setting if user hasn't set local preference
        if (!localStorage.getItem("tomoca-bean-density")) {
          setDensityState(setting.level);
        }
      }
    } catch (e) {
      // Silently fail, use defaults
    }
    setIsLoading(false);
  };

  const setDensity = (level: DensityLevel) => {
    setDensityState(level);
    localStorage.setItem("tomoca-bean-density", level);
  };

  return (
    <BeanDensityContext.Provider
      value={{
        density,
        multiplier: densityMultipliers[density],
        setDensity,
        isLoading,
      }}
    >
      {children}
    </BeanDensityContext.Provider>
  );
}

export function useBeanDensity() {
  const context = useContext(BeanDensityContext);
  if (!context) {
    throw new Error("useBeanDensity must be used within a BeanDensityProvider");
  }
  return context;
}
