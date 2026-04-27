import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "EUR" | "ETB";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const rates: Record<Currency, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 1, symbol: "$", label: "USD" },
  EUR: { rate: 0.92, symbol: "€", label: "EUR" },
  ETB: { rate: 65, symbol: "Br", label: "Birr" },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("tomo-currency");
    return (saved as Currency) || "USD";
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("tomo-currency", newCurrency);
  };

  const convertPrice = (priceInUSD: number) => {
    return priceInUSD * rates[currency].rate;
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = convertPrice(priceInUSD);
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
