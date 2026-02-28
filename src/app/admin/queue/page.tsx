"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LoginScreen, SectionCard } from "@/components/AdminShared";
import { useAllOrders, useQueueConfig } from "@/hooks/useOrders";
import { useTheme } from "@/hooks/useTheme";
import { Order } from "@/data/orderTypes";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  RotateCcw,
  Save,
  Image as ImageIcon,
  Phone,
  Volume2,
  VolumeX,
} from "lucide-react";

// Generate a notification beep using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    // First beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 880;
    osc1.type = "sine";
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);
    // Second beep (higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1100;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.45);
    // Cleanup
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available
  }
}

function QueueDashboard() {
  useTheme();
  const { orders, refetch, optimisticUpdate } = useAllOrders();
  const { config, save } = useQueueConfig();
  const [editing, setEditing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevOrderCountRef = useRef<number | null>(null);

  // Play sound when new orders come in
  useEffect(() => {
    const currentCount = orders.length;
    if (prevOrderCountRef.current !== null && currentCount > prevOrderCountRef.current && soundEnabled) {
      playNotificationSound();
    }
    prevOrderCountRef.current = currentCount;
  }, [orders.length, soundEnabled]);
  const [promptPay, setPromptPay] = useState("");
  const [minutesPer, setMinutesPer] = useState("");
  const [autoReset, setAutoReset] = useState("");
  const [slipModal, setSlipModal] = useState<string | null>(null);

  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  const startEdit = () => {
    if (!config) return;
    setPromptPay(config.promptPayNumber);
    setMinutesPer(String(config.minutesPerQueue));
    setAutoReset(config.autoResetTime);
    setEditing(true);
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    await save({
      ...config,
      promptPayNumber: promptPay,
      minutesPerQueue: parseInt(minutesPer) || 5,
      autoResetTime: autoReset,
    });
    setEditing(false);
  };

  const handleReset = async () => {
    if (!confirm("รีเซ็ตคิวทั้งหมด? (เลขคิวจะเริ่มต้นใหม่)")) return;
    await fetch("/api/queue-reset", { method: "POST" });
    refetch();
  };

  const handleMarkReady = (order: Order) => {
    optimisticUpdate(order.id, { status: "ready" });
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)",
      }}
    >
      {/* Header */}
      <div
        className="glass-nav sticky top-0 z-50 flex items-center justify-between px-5 py-3 mx-0"
        style={{ borderRadius: 0 }}
      >
        <a
          href="/admin"
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          <ArrowLeft size={18} />
          Admin
        </a>
        <span
          className="font-bold"
          style={{
            color: "#0F1F17",
            fontFamily: "var(--font-outfit), var(--font-noto-sans-thai), sans-serif",
          }}
        >
          จัดการคิว
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              color: soundEnabled ? "var(--theme-primary)" : "var(--theme-text-secondary)",
              background: soundEnabled
                ? "color-mix(in srgb, var(--theme-primary) 10%, transparent)"
                : "transparent",
            }}
            title={soundEnabled ? "ปิดเสียง" : "เปิดเสียง"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: "#E8668B" }}
          >
            <RotateCcw size={16} />
            รีเซ็ต
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-6">
        {/* Overview badges */}
        <div className="flex gap-3 mb-6">
          <div
            className="flex-1 glass-card p-4 text-center"
            style={{ cursor: "default" }}
          >
            <p
              className="font-bold"
              style={{ fontSize: "2rem", color: "#F0A500" }}
            >
              {preparing.length}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              กำลังเตรียม
            </p>
          </div>
          <div
            className="flex-1 glass-card p-4 text-center"
            style={{ cursor: "default" }}
          >
            <p
              className="font-bold"
              style={{ fontSize: "2rem", color: "var(--theme-primary)" }}
            >
              {ready.length}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              เสร็จแล้ว
            </p>
          </div>
        </div>

        {/* Config */}
        <SectionCard title="ตั้งค่าคิว">
          {!editing ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                เลขพร้อมเพย์:{" "}
                <strong style={{ color: "var(--theme-text-primary)" }}>
                  {config?.promptPayNumber || "-"}
                </strong>
              </p>
              <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                นาทีต่อคิว:{" "}
                <strong style={{ color: "var(--theme-text-primary)" }}>
                  {config?.minutesPerQueue || 5} นาที
                </strong>
              </p>
              <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                เวลา auto reset:{" "}
                <strong style={{ color: "var(--theme-text-primary)" }}>
                  {config?.autoResetTime || "06:00"}
                </strong>
              </p>
              <button
                onClick={startEdit}
                className="glass-cta-secondary mt-3 self-start"
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                แก้ไข
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--theme-text-secondary)" }}>
                  เลขพร้อมเพย์
                </label>
                <input
                  className="admin-input"
                  value={promptPay}
                  onChange={(e) => setPromptPay(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--theme-text-secondary)" }}>
                  นาทีต่อคิว
                </label>
                <input
                  className="admin-input"
                  type="number"
                  value={minutesPer}
                  onChange={(e) => setMinutesPer(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--theme-text-secondary)" }}>
                  เวลา Auto Reset (HH:mm)
                </label>
                <input
                  className="admin-input"
                  value={autoReset}
                  onChange={(e) => setAutoReset(e.target.value)}
                  placeholder="06:00"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveConfig} className="glass-cta flex-1">
                  <Save size={16} />
                  บันทึก
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="glass-cta-secondary flex-1"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Preparing orders */}
        <h3
          className="font-bold text-lg mb-4 flex items-center gap-2"
          style={{ color: "var(--theme-text-primary)" }}
        >
          <Clock size={20} style={{ color: "#F0A500" }} />
          กำลังเตรียม ({preparing.length})
        </h3>

        {preparing.length === 0 && (
          <div className="glass-card p-6 mb-6 text-center" style={{ cursor: "default" }}>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              ไม่มีคิวที่กำลังเตรียม
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          {preparing.map((order) => (
            <div
              key={order.id}
              className="glass-card p-5"
              style={{ cursor: "default" }}
            >
              <div className="flex items-start gap-4">
                {/* Queue number (very large) */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-2xl"
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(240, 165, 0, 0.1)",
                  }}
                >
                  <span
                    className="font-bold"
                    style={{ fontSize: "2.5rem", color: "#F0A500", lineHeight: 1 }}
                  >
                    {order.queueNumber}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: "var(--theme-text-primary)" }}>
                      {order.customerName}
                    </span>
                    {order.customerPhone && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--theme-text-secondary)" }}>
                        <Phone size={12} />
                        {order.customerPhone}
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="mb-2">
                    {(order.items || []).map((item, i) => (
                      <span
                        key={i}
                        className="text-xs mr-2"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>

                  {/* Price + payment */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-sm" style={{ color: "var(--theme-primary)" }}>
                      ฿{order.totalPrice}
                    </span>
                    <span className="badge-preparing text-xs">
                      {order.paymentMethod === "promptpay" ? "PromptPay" : "เงินสด"}
                    </span>
                    {order.paymentProofUrl && (
                      <button
                        onClick={() => setSlipModal(order.paymentProofUrl!)}
                        className="text-xs flex items-center gap-1 font-medium"
                        style={{ color: "var(--theme-primary)" }}
                      >
                        <ImageIcon size={14} />
                        ดูสลิป
                      </button>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleMarkReady(order)}
                    className="glass-cta w-full"
                    style={{ fontSize: "15px", padding: "10px 0" }}
                  >
                    <CheckCircle size={18} />
                    เสร็จแล้ว
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ready orders */}
        <h3
          className="font-bold text-lg mb-4 flex items-center gap-2"
          style={{ color: "var(--theme-text-primary)" }}
        >
          <CheckCircle size={20} style={{ color: "var(--theme-primary)" }} />
          เสร็จแล้ว ({ready.length})
        </h3>

        {ready.length === 0 && (
          <div className="glass-card p-6 mb-6 text-center" style={{ cursor: "default" }}>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              ยังไม่มีคิวที่เสร็จ
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {ready.map((order) => (
            <div
              key={order.id}
              className="glass-card p-4 flex items-center gap-4"
              style={{
                cursor: "default",
                opacity: 0.7,
                background: "color-mix(in srgb, var(--theme-primary) 6%, transparent)",
              }}
            >
              <span
                className="font-bold shrink-0"
                style={{ fontSize: "1.5rem", color: "var(--theme-primary)" }}
              >
                {order.queueNumber}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm" style={{ color: "var(--theme-text-primary)" }}>
                  {order.customerName}
                </span>
                <span className="text-xs ml-2" style={{ color: "var(--theme-text-secondary)" }}>
                  ฿{order.totalPrice}
                </span>
              </div>
              <span className="badge-ready text-xs">เสร็จ</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slip modal */}
      {slipModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSlipModal(null)}
        >
          <div
            className="glass-card p-3 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={slipModal}
              alt="สลิปการชำระเงิน"
              className="w-full rounded-2xl"
            />
            <button
              onClick={() => setSlipModal(null)}
              className="glass-cta-secondary w-full mt-3"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQueuePage() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <QueueDashboard />
  ) : (
    <LoginScreen onLogin={() => setAuthenticated(true)} />
  );
}
