"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "@/lib/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }
  function updateQty(id: number, qty: number) {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }
  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
