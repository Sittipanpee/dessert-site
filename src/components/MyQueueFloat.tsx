"use client";

import { useState, useEffect } from "react";
import { Ticket, Clock, CheckCircle, X } from "lucide-react";
import { Order } from "@/data/orderTypes";

const LOCAL_ORDER_KEY = "dessert-last-order-id";

export default function MyQueueFloat() {
  const [order, setOrder] = useState<Order | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const orderId = localStorage.getItem(LOCAL_ORDER_KEY);
    if (!orderId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) setOrder(data);
        } else {
          // Order not found — clear it
          localStorage.removeItem(LOCAL_ORDER_KEY);
        }
      } catch {
        // ignore
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  // Notify when ready
  useEffect(() => {
    if (order?.status === "ready" && "Notification" in window && Notification.permission === "granted") {
      new Notification("ถึงคิวแล้ว! 🎉", {
        body: `คิว ${order.queueNumber} - มารับของได้เลย`,
        icon: "/favicon.ico",
      });
    }
  }, [order?.status, order?.queueNumber]);

  if (!order || dismissed) return null;

  const isReady = order.status === "ready";

  return (
    <div
      className="fixed bottom-6 left-4 right-4 z-40 max-w-sm mx-auto"
      style={{ pointerEvents: "auto" }}
    >
      <a
        href={`/order/status?id=${order.id}`}
        className={`glass-ticket flex items-center gap-3 p-4 ${isReady ? "pulse-ready" : ""}`}
        style={{
          cursor: "pointer",
          textDecoration: "none",
          borderRadius: "20px",
          border: isReady ? "2px solid var(--theme-primary)" : undefined,
        }}
      >
        {/* Queue number */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: isReady
              ? "color-mix(in srgb, var(--theme-primary) 15%, transparent)"
              : "color-mix(in srgb, var(--theme-primary) 8%, transparent)",
          }}
        >
          <span
            className="font-bold text-lg"
            style={{ color: "var(--theme-primary)" }}
          >
            {order.queueNumber}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Ticket size={14} style={{ color: "var(--theme-primary)" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              คิวของฉัน
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isReady ? (
              <>
                <CheckCircle size={14} style={{ color: "var(--theme-primary)" }} />
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--theme-primary)" }}
                >
                  ถึงคิวแล้ว!
                </span>
              </>
            ) : (
              <>
                <Clock size={14} style={{ color: "var(--theme-text-secondary)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  กำลังเตรียม...
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDismissed(true);
          }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: "color-mix(in srgb, var(--theme-text-secondary) 10%, transparent)",
            color: "var(--theme-text-secondary)",
          }}
        >
          <X size={14} />
        </button>
      </a>
    </div>
  );
}
