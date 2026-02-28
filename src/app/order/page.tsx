"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "@/hooks/useContent";
import { useOrderStatus, useQueuesAhead, useQueueConfig } from "@/hooks/useOrders";
import { MenuItem } from "@/data/defaultContent";
import { OrderItem, Order } from "@/data/orderTypes";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Upload,
  Clock,
  CheckCircle,
  Download,
  Ticket,
  User,
  Phone,
} from "lucide-react";

const LOCAL_ORDER_KEY = "dessert-last-order-id";

// ─── Step Indicator ───

function StepIndicator({ step }: { step: number }) {
  const steps = ["เลือกเมนู", "ข้อมูล", "ชำระเงิน", "บัตรคิว"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`step-dot ${
                i + 1 < step ? "done" : i + 1 === step ? "active" : "pending"
              }`}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span
              className="text-[10px] sm:text-xs font-medium whitespace-nowrap"
              style={{ color: i + 1 <= step ? "var(--theme-primary)" : "var(--theme-text-secondary)" }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`step-line mx-1 sm:mx-2 ${
                i + 1 < step ? "done" : ""
              }`}
              style={{ minWidth: "24px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── My Queue Banner ───

function MyQueueBanner() {
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    setSavedId(localStorage.getItem(LOCAL_ORDER_KEY));
  }, []);

  if (!savedId) return null;

  return (
    <a
      href={`/order/status?id=${savedId}`}
      className="glass-cart-bar fixed top-4 left-4 right-4 z-50 flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold"
      style={{ borderRadius: "16px" }}
    >
      <Ticket size={18} />
      ดูคิวของฉัน
    </a>
  );
}

// ─── Step 1: Menu Selection ───

function MenuStep({
  menu,
  cart,
  setCart,
  onNext,
}: {
  menu: MenuItem[];
  cart: Record<string, number>;
  setCart: (c: Record<string, number>) => void;
  onNext: () => void;
}) {
  const total = menu.reduce(
    (sum, item) => sum + (cart[item.id] || 0) * item.price,
    0
  );
  const count = Object.values(cart).reduce((s, q) => s + q, 0);

  const imgClasses = [
    "menu-img-1",
    "menu-img-2",
    "menu-img-3",
    "menu-img-4",
    "menu-img-5",
    "menu-img-6",
  ];

  return (
    <>
      <h2
        className="text-xl sm:text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--theme-text-primary)" }}
      >
        เลือกเมนูที่ต้องการ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-28">
        {menu.map((item, i) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="glass-card overflow-hidden flex"
              style={{ cursor: "default" }}
            >
              {/* Image */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover shrink-0"
                  style={{ borderRadius: "24px 0 0 24px" }}
                />
              ) : (
                <div
                  className={`${imgClasses[i % imgClasses.length]} w-24 h-24 shrink-0`}
                  style={{ borderRadius: "24px 0 0 24px" }}
                />
              )}

              {/* Content */}
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                  <h3
                    className="font-semibold text-sm truncate"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="text-xs line-clamp-1"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    ฿{item.price}
                  </span>

                  {qty === 0 ? (
                    <button
                      onClick={() =>
                        setCart({ ...cart, [item.id]: 1 })
                      }
                      className="glass-cta"
                      style={{
                        padding: "4px 14px",
                        fontSize: "13px",
                        borderRadius: "12px",
                      }}
                    >
                      <Plus size={14} />
                      เพิ่ม
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const next = { ...cart };
                          if (qty <= 1) delete next[item.id];
                          else next[item.id] = qty - 1;
                          setCart(next);
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                          color: "var(--theme-primary)",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="font-bold text-sm w-5 text-center"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setCart({ ...cart, [item.id]: qty + 1 })
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                          color: "var(--theme-primary)",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="glass-cart-bar fixed bottom-6 left-4 right-4 z-40 flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span className="font-semibold text-sm">
              {count} รายการ
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">฿{total}</span>
            <button
              onClick={onNext}
              className="bg-white/20 hover:bg-white/30 rounded-xl px-4 py-1.5 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              ถัดไป
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Step 1.5: Customer Info ───

function InfoStep({
  name,
  setName,
  phone,
  setPhone,
  onBack,
  onNext,
}: {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-md mx-auto">
      <h2
        className="text-xl sm:text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--theme-text-primary)" }}
      >
        ข้อมูลลูกค้า
      </h2>

      <div className="glass-card p-6" style={{ cursor: "default" }}>
        <div className="flex flex-col gap-5">
          <div>
            <label
              className="text-sm font-medium mb-2 flex items-center gap-2"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              <User size={16} />
              ชื่อ <span style={{ color: "#E8668B" }}>*</span>
            </label>
            <input
              className="admin-input"
              placeholder="ชื่อที่ใช้เรียกคิว"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label
              className="text-sm font-medium mb-2 flex items-center gap-2"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              <Phone size={16} />
              เบอร์โทร (ไม่จำเป็น)
            </label>
            <input
              className="admin-input"
              placeholder="08x-xxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="glass-cta-secondary flex-1">
          <ArrowLeft size={16} />
          กลับ
        </button>
        <button
          onClick={onNext}
          disabled={!name.trim()}
          className="glass-cta flex-1"
          style={{ opacity: name.trim() ? 1 : 0.5 }}
        >
          ถัดไป
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Payment ───

function PaymentStep({
  items,
  menu,
  total,
  customerName,
  customerPhone,
  onBack,
  onOrderCreated,
}: {
  items: OrderItem[];
  menu: MenuItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  onBack: () => void;
  onOrderCreated: (order: Order) => void;
}) {
  const [method, setMethod] = useState<"promptpay" | "cash">("promptpay");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { config } = useQueueConfig();

  // Generate PromptPay QR
  useEffect(() => {
    if (method !== "promptpay" || !config?.promptPayNumber) return;

    async function generateQR() {
      try {
        const promptpayMod = await import("promptpay-qr");
        const promptpayQR = promptpayMod.default || promptpayMod;
        const { toDataURL } = await import("qrcode");
        const payload = promptpayQR(config!.promptPayNumber, { amount: total });
        const url = await toDataURL(payload, { width: 280, margin: 2 });
        setQrDataUrl(url);
      } catch (err) {
        console.error("PromptPay QR generation failed:", err);
      }
    }
    generateQR();
  }, [method, config, total]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone: customerPhone || undefined,
          items,
          totalPrice: total,
          paymentMethod: method,
        }),
      });
      const order: Order = await res.json();

      // Upload slip if provided
      if (slipFile && method === "promptpay") {
        const formData = new FormData();
        formData.append("file", slipFile);
        formData.append("orderId", order.id);
        await fetch("/api/upload-proof", { method: "POST", body: formData });
      }

      // Save orderId to localStorage
      localStorage.setItem(LOCAL_ORDER_KEY, order.id);
      onOrderCreated(order);
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2
        className="text-xl sm:text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--theme-text-primary)" }}
      >
        ชำระเงิน
      </h2>

      {/* Order summary */}
      <div className="glass-card p-5 mb-5" style={{ cursor: "default" }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--theme-text-primary)" }}>
          สรุปออเดอร์
        </h3>
        <div className="flex flex-col gap-2 mb-3">
          {items.map((item) => (
            <div key={item.menuItemId} className="flex justify-between text-sm">
              <span style={{ color: "var(--theme-text-secondary)" }}>
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium" style={{ color: "var(--theme-text-primary)" }}>
                ฿{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex justify-between font-bold pt-3"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)", color: "var(--theme-primary)" }}
        >
          <span>รวมทั้งหมด</span>
          <span>฿{total}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setMethod("promptpay")}
          className={`flex-1 p-4 rounded-2xl text-center font-semibold text-sm transition-all ${
            method === "promptpay"
              ? "glass-cta"
              : "glass-card"
          }`}
          style={method !== "promptpay" ? { cursor: "pointer", color: "#5B6B62" } : {}}
        >
          PromptPay QR
        </button>
        <button
          onClick={() => setMethod("cash")}
          className={`flex-1 p-4 rounded-2xl text-center font-semibold text-sm transition-all ${
            method === "cash"
              ? "glass-cta"
              : "glass-card"
          }`}
          style={method !== "cash" ? { cursor: "pointer", color: "#5B6B62" } : {}}
        >
          จ่ายหน้าร้าน
        </button>
      </div>

      {/* PromptPay QR */}
      {method === "promptpay" && (
        <div className="glass-card p-5 mb-5 text-center" style={{ cursor: "default" }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="PromptPay QR"
              className="mx-auto mb-4"
              style={{ width: 220, height: 220 }}
            />
          ) : (
            <div
              className="w-[220px] h-[220px] mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(45,143,94,0.06)" }}
            >
              <span className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                กำลังสร้าง QR...
              </span>
            </div>
          )}
          <p className="text-sm font-medium mb-4" style={{ color: "var(--theme-text-secondary)" }}>
            สแกนเพื่อชำระ ฿{total}
          </p>

          {/* Upload slip */}
          <label
            className="glass-cta-secondary inline-flex cursor-pointer"
            style={{ fontSize: "13px", padding: "10px 20px" }}
          >
            <Upload size={16} />
            {slipFile ? slipFile.name : "แนบสลิป"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      )}

      {method === "cash" && (
        <div className="glass-card p-5 mb-5 text-center" style={{ cursor: "default" }}>
          <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
            ชำระเงินสดที่ร้านเมื่อรับของ
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="glass-cta-secondary flex-1">
          <ArrowLeft size={16} />
          กลับ
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="glass-cta flex-1"
          style={{ opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "กำลังสั่ง..." : "สั่งเลย!"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Queue Ticket ───

function TicketStep({ order }: { order: Order }) {
  const { order: liveOrder } = useOrderStatus(order.id);
  const queuesAhead = useQueuesAhead(order.id);
  const { config } = useQueueConfig();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketQrUrl, setTicketQrUrl] = useState<string | null>(null);

  const current = liveOrder || order;
  const isReady = current.status === "ready";
  const estimatedMin = (queuesAhead + 1) * (config?.minutesPerQueue || 5);

  // Generate QR code pointing to status page
  useEffect(() => {
    async function gen() {
      try {
        const { toDataURL } = await import("qrcode");
        const statusUrl = `${window.location.origin}/order/status?id=${order.id}`;
        const url = await toDataURL(statusUrl, { width: 160, margin: 1 });
        setTicketQrUrl(url);
      } catch (err) {
        console.error("Ticket QR generation failed:", err);
      }
    }
    gen();
  }, [order.id]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Notify when ready
  useEffect(() => {
    if (isReady && "Notification" in window && Notification.permission === "granted") {
      new Notification("ถึงคิวแล้ว! 🎉", {
        body: `คิว ${current.queueNumber} - มารับของได้เลย`,
        icon: "/favicon.ico",
      });
    }
  }, [isReady, current.queueNumber]);

  const handleSaveTicket = async () => {
    if (!ticketRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#F7FBF8",
        scale: 2,
      });

      // Try Web Share API first (works on iOS)
      if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `queue-${current.queueNumber}.png`, {
            type: "image/png",
          });
          try {
            await navigator.share({ files: [file] });
          } catch {
            // User cancelled or not supported — fallback below
            fallbackDownload(canvas);
          }
        }, "image/png");
      } else {
        fallbackDownload(canvas);
      }
    } catch {
      // ignore
    }
  };

  const fallbackDownload = (canvas: HTMLCanvasElement) => {
    // For desktop browsers
    const link = document.createElement("a");
    link.download = `queue-${current.queueNumber}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-md mx-auto text-center">
      {isReady && (
        <div
          className="pulse-ready glass-card p-4 mb-6 text-center"
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
          <p
            className="font-bold text-lg"
            style={{ color: "var(--theme-primary)" }}
          >
            ถึงคิวแล้ว! มารับของได้เลย
          </p>
        </div>
      )}

      {/* Ticket card */}
      <div ref={ticketRef} className="glass-ticket p-6 sm:p-8 mb-6">
        {/* Header */}
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          บัตรคิว
        </p>
        <p
          className="font-bold mb-1"
          style={{
            fontSize: "4rem",
            lineHeight: 1,
            color: "var(--theme-primary)",
          }}
        >
          {String(current.queueNumber).padStart(3, "0")}
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--theme-text-secondary)" }}>
          {current.customerName}
        </p>

        {/* Status badge */}
        <div className="mb-4">
          <span className={isReady ? "badge-ready" : "badge-preparing"}>
            {isReady ? "พร้อมรับ" : "กำลังเตรียม"}
          </span>
        </div>

        {/* Wait info */}
        {!isReady && (
          <div
            className="flex items-center justify-center gap-2 mb-4 text-sm"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <Clock size={16} />
            <span>
              รออีก ~{estimatedMin} นาที ({queuesAhead} คิวข้างหน้า)
            </span>
          </div>
        )}

        {/* Items */}
        <div
          className="text-left mb-4 pt-4"
          style={{
            borderTop: "1px dashed color-mix(in srgb, var(--theme-primary) 20%, transparent)",
          }}
        >
          {(current.items || []).map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm py-1"
            >
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
            style={{
              borderTop: "1px dashed color-mix(in srgb, var(--theme-primary) 20%, transparent)",
              color: "var(--theme-primary)",
            }}
          >
            <span>รวม</span>
            <span>฿{current.totalPrice}</span>
          </div>
        </div>

        {/* QR to status page */}
        {ticketQrUrl && (
          <div className="pt-3" style={{ borderTop: "1px dashed color-mix(in srgb, var(--theme-primary) 20%, transparent)" }}>
            <img
              src={ticketQrUrl}
              alt="Status QR"
              className="mx-auto mb-1"
              style={{ width: 100, height: 100 }}
            />
            <p className="text-[10px]" style={{ color: "var(--theme-text-secondary)" }}>
              สแกนเพื่อดูสถานะคิว
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <button
        onClick={handleSaveTicket}
        className="glass-cta w-full mb-3"
      >
        <Download size={18} />
        บันทึกบัตรคิว
      </button>
      <a href="/" className="glass-cta-secondary inline-flex w-full justify-center">
        กลับหน้าหลัก
      </a>
    </div>
  );
}

// ─── Main Order Page ───

export default function OrderPage() {
  const { content, isLoaded } = useContent();
  useTheme();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Build items from cart
  const buildItems = useCallback((): OrderItem[] => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const menuItem = content.menu.find((m) => m.id === id)!;
        return {
          menuItemId: id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: qty,
        };
      });
  }, [cart, content.menu]);

  const total = buildItems().reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--theme-bg-main)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--theme-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)",
      }}
    >
      {/* Only show "my queue" banner on step 1 if user doesn't have active order in this session */}
      {step === 1 && !createdOrder && <MyQueueBanner />}

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <a
          href="/"
          className="flex items-center gap-1 text-sm font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          <ArrowLeft size={18} />
          กลับ
        </a>
        <span
          className="font-bold text-lg"
          style={{
            color: "#0F1F17",
            fontFamily: "var(--font-outfit), var(--font-noto-sans-thai), sans-serif",
          }}
        >
          สั่งซื้อ
        </span>
        <div style={{ width: 50 }} />
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <StepIndicator step={step} />

        {step === 1 && (
          <MenuStep
            menu={content.menu}
            cart={cart}
            setCart={setCart}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <InfoStep
            name={customerName}
            setName={setCustomerName}
            phone={customerPhone}
            setPhone={setCustomerPhone}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <PaymentStep
            items={buildItems()}
            menu={content.menu}
            total={total}
            customerName={customerName}
            customerPhone={customerPhone}
            onBack={() => setStep(2)}
            onOrderCreated={(order) => {
              setCreatedOrder(order);
              setStep(4);
            }}
          />
        )}

        {step === 4 && createdOrder && <TicketStep order={createdOrder} />}
      </div>
    </div>
  );
}
