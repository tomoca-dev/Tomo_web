import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "EUR" | "ETB";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (basePrice: number) => string;
  convertPrice: (basePrice: number) => number;
}

const rates: Record<Currency, { rate: number; symbol: string; label: string }> = {
  ETB: { rate: 1, symbol: "Br", label: "Birr" },
  USD: { rate: 1 / 65, symbol: "$", label: "USD" },
  EUR: { rate: 0.92 / 65, symbol: "€", label: "EUR" },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("tomo-currency");
    return (saved as Currency) || "ETB";
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("tomo-currency", newCurrency);
  };

  const convertPrice = (basePrice: number) => {
    return basePrice * rates[currency].rate;
  };

  const formatPrice = (basePrice: number) => {
    const converted = convertPrice(basePrice);
    const { symbol } = rates[currency];
    
    if (currency === "ETB") {
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
