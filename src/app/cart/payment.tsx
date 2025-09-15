"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRISDisplay } from "@/components/QRISDisplay";
import { toCurrency } from "@/lib/currency";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qris, setQris] = useState<null | { qrString: string; qrUrl: string; id: string }>(null);
  const [qrisLoading, setQrisLoading] = useState(false);
  const [qrisError, setQrisError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Get order data from query or sessionStorage
    let orderData = null;
    const orderParam = searchParams ? searchParams.get("order") : null;
    if (orderParam) {
      try {
        orderData = JSON.parse(decodeURIComponent(orderParam));
      } catch {}
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pendingOrder");
      if (stored) orderData = JSON.parse(stored);
    }
    setOrder(orderData);
    if (orderData) {
      setQrisLoading(true);
      fetch("/api/create-qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderData.orderTotal,
          reference_id: orderData.reference_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.qr_string && data.qr_url) {
            setQris({ qrString: data.qr_string, qrUrl: data.qr_url, id: data.id });
          } else {
            setQrisError(data.error || "Failed to create QRIS");
          }
        })
        .catch((err) => setQrisError(err.message || "Failed to create QRIS"))
        .finally(() => setQrisLoading(false));
    }
  }, [searchParams]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-rose-700 text-lg">No order found. Please return to cart.</div>
        <button className="mt-4 text-rose-500 underline" onClick={() => router.push("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">Payment</h1>
      <div className="w-full max-w-lg bg-white border border-pink-100 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex justify-between text-rose-700 font-medium">
            <span>Order Total</span>
            <span>{toCurrency(order.orderTotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-rose-400 mt-1">
            <span>Name</span>
            <span>{order.delivery?.name}</span>
          </div>
          <div className="flex justify-between text-xs text-rose-400">
            <span>Address</span>
            <span>{order.delivery?.address}</span>
          </div>
        </div>
        {qris ? (
          <QRISDisplay qrString={qris.qrString} qrUrl={qris.qrUrl} />
        ) : qrisLoading ? (
          <div className="text-center text-rose-500">Generating QRIS...</div>
        ) : qrisError ? (
          <div className="text-center text-red-500">{qrisError}</div>
        ) : null}
        <button className="w-full mt-6 text-rose-400 underline hover:text-rose-600" onClick={() => router.push("/cart")}>Back to Cart</button>
      </div>
    </div>
  );
}
