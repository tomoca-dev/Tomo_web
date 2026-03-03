import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  variantId?: string | null;
  variantName?: string | null;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (key: { productId: string; variantId?: string | null }) => void;
  setQuantity: (key: { productId: string; variantId?: string | null }, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "tomoca_cart_v1";

function makeKey(productId: string, variantId?: string | null) {
  return `${productId}::${variantId ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem: CartContextType["addItem"] = (item) => {
    const qty = Math.max(1, item.quantity ?? 1);
    setItems((prev) => {
      const key = makeKey(item.productId, item.variantId);
      const idx = prev.findIndex((x) => makeKey(x.productId, x.variantId) === key);
      if (idx === -1) return [...prev, { ...item, quantity: qty }];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
      return copy;
    });
  };

  const removeItem: CartContextType["removeItem"] = (key) => {
    setItems((prev) => prev.filter((x) => makeKey(x.productId, x.variantId) !== makeKey(key.productId, key.variantId)));
  };

  const setQuantity: CartContextType["setQuantity"] = (key, quantity) => {
    const qty = Math.max(1, quantity);
    setItems((prev) =>
      prev.map((x) =>
        makeKey(x.productId, x.variantId) === makeKey(key.productId, key.variantId) ? { ...x, quantity: qty } : x
      )
    );
  };

  const clear = () => setItems([]);

  const value = useMemo(() => {
    const itemCount = items.reduce((acc, x) => acc + x.quantity, 0);
    const subtotal = items.reduce((acc, x) => acc + x.unitPrice * x.quantity, 0);
    return { items, itemCount, subtotal, addItem, removeItem, setQuantity, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
