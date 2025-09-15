"use client";

import { CartItem } from "@/lib/types";
import { toCurrency } from "@/lib/currency";

type Props = {
  cart: CartItem[];
  updateQty: (id: number, qty: number, free: boolean) => void;
  removeFromCart: (id: number, free: boolean) => void;
};

export default function Cart({ cart, updateQty, removeFromCart }: Props) {
  const total = cart
    .filter((item) => !item.free)
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="mb-4 bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="text-2xl font-semibold mb-3 text-center text-rose-700">
        Your Cart
      </h2>
      {cart.length === 0 ? (
        <div className="text-rose-400 text-center">Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.free ? "free" : "paid"}`}
              className="flex items-center justify-between"
            >
              <div className="text-rose-700">
                <span className="font-medium">{item.name}</span>
                {item.free && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                    FREE
                  </span>
                )}
                <span className="mx-2">×</span>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item.id,
                      Math.max(1, parseInt(e.target.value || "1", 10)),
                      !!item.free
                    )
                  }
                  className="w-14 mx-1 border border-rose-200 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-rose-300"
                  disabled={item.free}
                />
                <span className="ml-2 text-rose-600">
                  {item.free ? "FREE" : toCurrency(item.price)}
                </span>
              </div>
              <button
                className="text-xs text-rose-500 hover:text-rose-600 underline decoration-dotted"
                onClick={() => removeFromCart(item.id, !!item.free)}
              >
                Remove Item
              </button>
            </div>
          ))}
          <div className="font-bold text-right mt-4 text-rose-700">
            Subtotal: {" "}
            {toCurrency(
              cart.filter((i) => !i.free).reduce((sum, i) => sum + i.price * i.qty, 0)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
