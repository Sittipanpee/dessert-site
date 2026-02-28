"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useOrderStatus, useQueuesAhead, useQueueConfig } from "@/hooks/useOrders";
import { useTheme } from "@/hooks/useTheme";
import { Clock, CheckCircle, ArrowLeft } from "lucide-react";

function StatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  useTheme();
  const { order, loading } = useOrderStatus(orderId);
  const queuesAhead = useQueuesAhead(orderId);
  const { config } = useQueueConfig();

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--theme-text-secondary)" }}>ไม่พบ Order ID</p>
        <a href="/order" className="glass-cta inline-flex mt-4">
          ไปหน้าสั่งซื้อ
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--theme-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--theme-text-secondary)" }}>ไม่พบออเดอร์นี้</p>
        <a href="/order" className="glass-cta inline-flex mt-4">
          ไปหน้าสั่งซื้อ
        </a>
      </div>
    );
  }

  const isReady = order.status === "ready";
  const estimatedMin = queuesAhead * (config?.minutesPerQueue || 5);

  return (
    <div className="max-w-md mx-auto text-center">
      {/* Ready notification */}
      {isReady && (
        <div
          className="pulse-ready glass-card p-4 mb-6"
          style={{
            background: "color-mix(in srgb, var(--theme-primary) 12%, transparent)",
            border: "2px solid var(--theme-primary)",
            cursor: "default",
          }}
        >
          <CheckCircle
            size={40}
            className="mx-auto mb-2"
            style={{ color: "var(--theme-primary)" }}
          />
          <p className="font-bold text-lg" style={{ color: "var(--theme-primary)" }}>
            ถึงคิวแล้ว! มารับของได้เลย
          </p>
        </div>
      )}

      {/* Ticket */}
      <div className="glass-ticket p-6 sm:p-8 mb-6">
        <p className="text-sm font-medium mb-1" style={{ color: "var(--theme-text-secondary)" }}>
          บัตรคิว
        </p>
        <p
          className="font-bold mb-1"
          style={{ fontSize: "4rem", lineHeight: 1, color: "var(--theme-primary)" }}
        >
          {String(order.queueNumber).padStart(3, "0")}
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--theme-text-secondary)" }}>
          {order.customerName}
        </p>

        <div className="mb-4">
          <span className={isReady ? "badge-ready" : "badge-preparing"}>
            {isReady ? "พร้อมรับ" : "กำลังเตรียม"}
          </span>
        </div>

        {!isReady && (
          <div
            className="flex items-center justify-center gap-2 mb-4 text-sm"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <Clock size={16} />
            <span>
              คิวข้างหน้า: {queuesAhead} คิว (~{estimatedMin} นาที)
            </span>
          </div>
        )}

        {/* Items */}
        <div
          className="text-left pt-4"
          style={{ borderTop: "1px dashed color-mix(in srgb, var(--theme-primary) 20%, transparent)" }}
        >
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span style={{ color: "var(--theme-text-secondary)" }}>
                {item.name} x{item.quantity}
              </span>
              <span style={{ color: "var(--theme-text-primary)" }}>
                ฿{item.price * item.quantity}
              </span>
            </div>
          ))}
          <div
            className="flex justify-between font-bold text-sm pt-2 mt-2"
            style={{ borderTop: "1px dashed color-mix(in srgb, var(--theme-primary) 20%, transparent)", color: "var(--theme-primary)" }}
          >
            <span>รวม</span>
            <span>฿{order.totalPrice}</span>
          </div>
        </div>
      </div>

      <a href="/" className="glass-cta-secondary inline-flex">
        <ArrowLeft size={16} />
        กลับหน้าหลัก
      </a>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)",
      }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--theme-primary)", borderTopColor: "transparent" }}
            />
          </div>
        }
      >
        <StatusContent />
      </Suspense>
    </div>
  );
}
