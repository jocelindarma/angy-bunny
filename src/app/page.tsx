"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Contact from "@/components/Contact";
import Cart from "@/components/Cart";
import { MENU } from "@/lib/menu";
import { CartItem, MenuItem } from "@/lib/types";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFFDF7_100%)] text-rose-800">
      <Header />

      <Section>
        <Story />
      </Section>

      <Section>
        <Menu items={MENU} onAdd={addToCart} />
      </Section>

      <Section>
        <Contact />
      </Section>

      <Section>
        <Cart
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
        />
      </Section>

      <footer className="pb-10 text-center text-rose-400">
        Made with 🐇 & ❤️
      </footer>
    </div>
  );
}
