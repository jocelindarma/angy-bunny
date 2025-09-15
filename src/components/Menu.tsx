"use client";

import { MenuItem } from "@/lib/types";
import { toCurrency } from "@/lib/currency";
import { useCart } from "@/context/CartContext";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export default function Menu({ items, onAdd }: Props) {
  const { cart, updateQty, removeFromCart } = useCart();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="text-2xl font-semibold text-center text-rose-700">
        Our Menu
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-6">
        {items.map((item) => {
          const carted = cart.find((i) => i.id === item.id && !i.free);
          return (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-rose-50/50 hover:shadow-md transition-shadow h-full min-h-[300px] sm:min-h-[300px]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-contain mb-3"
              />
              <div className="uppercase tracking-wide text-sm font-medium text-rose-700">
                {item.name}
              </div>
              <div className="text-rose-600 font-semibold">
                {toCurrency(item.price)}
              </div>
              <div className="flex-grow" />
              {carted ? (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded-full bg-rose-200 text-rose-700 text-lg font-bold hover:bg-rose-300"
                    onClick={() => {
                      if (carted.qty <= 1) {
                        removeFromCart(item.id);
                      } else {
                        updateQty(item.id, carted.qty - 1);
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="font-semibold text-rose-700 text-lg min-w-[2ch] text-center">
                    {carted.qty}
                  </span>
                  <button
                    className="px-2 py-1 rounded-full bg-rose-500 text-white text-lg font-bold hover:bg-rose-600"
                    onClick={() => updateQty(item.id, carted.qty + 1)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAdd(item)}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 active:scale-[.98] transition"
                >
                  <span>＋</span> Add to cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
