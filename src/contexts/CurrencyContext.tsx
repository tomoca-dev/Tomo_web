import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "EUR" | "ETB";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (basePrice: number, targetCurrency?: Currency) => string;
  convertPrice: (basePrice: number) => number;
}

const rates: Record<Currency, { rate: number; symbol: string; label: string }> = {
  ETB: { rate: 1, symbol: "Birr", label: "Birr" },
  USD: { rate: 1 / 65, symbol: "$", label: "USD" },
  EUR: { rate: 0.92 / 65, symbol: "€", label: "EUR" },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("tomo-currency");
    const isManual = localStorage.getItem("tomo-currency-manual") === "true";
    return (isManual && saved as Currency) || "ETB";
  });

  useEffect(() => {
    const isManual = localStorage.getItem("tomo-currency-manual") === "true";
    if (!isManual) {
      // 1. Initial quick timezone-based detection (non-blocking, instant)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      let detectedCurrency: Currency = "ETB";
      
      if (tz.includes("Addis_Ababa") || tz.includes("Asmara") || tz.includes("Nairobi")) {
        detectedCurrency = "ETB";
      } else if (tz.startsWith("Europe/")) {
        detectedCurrency = "EUR";
      } else {
        detectedCurrency = "USD";
      }
      
      setCurrencyState(detectedCurrency);
      localStorage.setItem("tomo-currency", detectedCurrency);
      
      // 2. Refined check with geolocation API (non-blocking)
      const detectLocation = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);
          const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            // Only update if the user hasn't made a manual choice in the meantime
            if (localStorage.getItem("tomo-currency-manual") !== "true") {
              let finalCurrency: Currency = "USD";
              if (data.country_code === "ET") {
                finalCurrency = "ETB";
              } else if (["AT","BE","CY","EE","FI","FR","DE","GR","HR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"].includes(data.country_code)) {
                finalCurrency = "EUR";
              }
              setCurrencyState(finalCurrency);
              localStorage.setItem("tomo-currency", finalCurrency);
            }
          }
        } catch (e) {
          console.warn("Location detection failed, using timezone guess:", e);
        }
      };
      
      detectLocation();
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("tomo-currency", newCurrency);
    localStorage.setItem("tomo-currency-manual", "true");
  };

  const convertPrice = (basePrice: number) => {
    return basePrice * rates[currency].rate;
  };

  const formatPrice = (basePrice: number, targetCurrency?: Currency) => {
    const activeCurrency = targetCurrency || currency;
    const converted = basePrice * rates[activeCurrency].rate;
    const { symbol } = rates[activeCurrency];
    
    if (activeCurrency === "ETB") {
      return `${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
    }
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

