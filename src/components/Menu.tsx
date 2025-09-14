"use client";

import { MenuItem } from "@/lib/types";
import { toCurrency } from "@/lib/currency";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export default function Menu({ items, onAdd }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="text-2xl font-semibold text-center text-rose-700">
        Our Menu
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-rose-50/50 hover:shadow-md transition-shadow"
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
            <button
              onClick={() => onAdd(item)}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 active:scale-[.98] transition"
            >
              <span>＋</span> Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
