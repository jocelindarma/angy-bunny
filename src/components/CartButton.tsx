"use client";

import { useState, useRef, useEffect } from "react";
import { CartItem } from "@/lib/types";
import CartPopover from "@/components/CartPopover";
import { CartPlus } from "@mynaui/icons-react";

export default function CartButton({ cart }: { cart: CartItem[] }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        className="relative p-2 rounded-full hover:bg-rose-100 transition"
        aria-label="View cart"
        onClick={() => setOpen((v) => !v)}
      >
        <CartPlus className="w-7 h-7 text-rose-600" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
            {itemCount}
          </span>
        )}
      </button>
      {open && (
        <div ref={popoverRef} className="absolute right-0 mt-2 z-50">
          <CartPopover cart={cart} />
        </div>
      )}
    </div>
  );
}
