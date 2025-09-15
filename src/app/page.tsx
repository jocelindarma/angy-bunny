"use client";

import Header from "@/components/Header";
import Section from "@/components/Section";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Contact from "@/components/Contact";
import Rewards from "@/components/Rewards";
import { MENU } from "@/lib/menu";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { addToCart } = useCart();

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
        <Rewards />
      </Section>

      <Section>
        <Contact />
      </Section>

      <footer className="pb-10 text-center text-rose-400">
        Made with 🐇 & ❤️
      </footer>
    </div>
  );
}
