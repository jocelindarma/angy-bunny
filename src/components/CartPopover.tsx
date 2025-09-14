"use client";

import { CartItem } from "@/lib/types";
import { toCurrency } from "@/lib/currency";
import Link from "next/link";

export default function CartPopover({ cart }: { cart: CartItem[] }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className="w-72 bg-white rounded-xl shadow-lg border border-rose-100 p-4">
      <h3 className="text-lg font-semibold mb-2 text-center text-rose-700">
        Cart
      </h3>
      {cart.length === 0 ? (
        <div className="text-rose-400 text-center">Your cart is empty.</div>
      ) : (
        <div className="space-y-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-rose-700"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{toCurrency(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="font-bold text-right mt-2 text-rose-700">
            Total: {toCurrency(total)}
          </div>
          <Link href="/cart">
            <button className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold transition">
              View Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
