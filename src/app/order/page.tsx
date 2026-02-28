"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "@/hooks/useContent";
import { useOrderStatus, useQueuesAhead, useQueueConfig } from "@/hooks/useOrders";
import { MenuItem, OptionGroup } from "@/data/defaultContent";
import { OrderItem, Order, OrderItemSelection } from "@/data/orderTypes";
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
  Bell,
  Smartphone,
  Share2,
  X,
} from "lucide-react";

const LOCAL_ORDER_KEY = "dessert-last-order-id";

// ─── Cart Types ───

interface CartEntry {
  id: string;
  menuItemId: string;
  selections: Record<string, string[]>; // groupId → choiceId[]
  quantity: number;
}

// ─── Price Helpers ───

function computeUnitPrice(item: MenuItem, selections: Record<string, string[]>): number {
  const groups = item.optionGroups || [];
  let base = item.price;

  for (const group of groups) {
    const selected = selections[group.id] || [];
    if (group.pricingType === "fixed" && selected.length > 0) {
      const choice = group.choices.find((c) => c.id === selected[0]);
      if (choice) base = choice.price;
    }
  }

  let addon = 0;
  for (const group of groups) {
    const selected = selections[group.id] || [];
    if (group.pricingType === "addon") {
      for (const cid of selected) {
        const choice = group.choices.find((c) => c.id === cid);
        if (choice) addon += choice.price;
      }
    }
  }

  return base + addon;
}

function cartEntryTotal(entry: CartEntry, menu: MenuItem[]): number {
  const item = menu.find((m) => m.id === entry.menuItemId);
  if (!item) return 0;
  return computeUnitPrice(item, entry.selections) * entry.quantity;
}

function formatSelections(item: MenuItem, selections: Record<string, string[]>): string {
  const groups = item.optionGroups || [];
  const parts: string[] = [];
  for (const group of groups) {
    const selected = selections[group.id] || [];
    const names = selected
      .map((cid) => group.choices.find((c) => c.id === cid)?.name)
      .filter(Boolean);
    if (names.length > 0) parts.push(names.join(", "));
  }
  return parts.length > 0 ? parts.join(" / ") : "";
}

// Format OrderItem display name (backward-compatible)
function formatItemDisplay(item: OrderItem): string {
  if (item.selections && item.selections.length > 0) {
    const parts = item.selections.map((s) => s.choiceNames.join(", ")).filter((s) => s);
    return parts.length > 0 ? `${item.name} (${parts.join(" / ")})` : item.name;
  }
  if (item.variationName) return `${item.name} (${item.variationName})`;
  return item.name;
}

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

// ─── Selection Modal ───

function SelectionModal({
  item,
  onAdd,
  onClose,
}: {
  item: MenuItem;
  onAdd: (selections: Record<string, string[]>, qty: number) => void;
  onClose: () => void;
}) {
  const groups = item.optionGroups || [];
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const g of groups) {
      if (g.selectionType === "single" && g.choices.length > 0) {
        init[g.id] = [g.choices[0].id];
      } else {
        init[g.id] = [];
      }
    }
    return init;
  });
  const [qty, setQty] = useState(1);

  const toggleChoice = (group: OptionGroup, choiceId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] || [];
      if (group.selectionType === "single") {
        return { ...prev, [group.id]: [choiceId] };
      }
      // multiple or limit
      if (current.includes(choiceId)) {
        return { ...prev, [group.id]: current.filter((c) => c !== choiceId) };
      }
      if (group.selectionType === "limit" && group.maxSelections && current.length >= group.maxSelections) {
        return prev;
      }
      return { ...prev, [group.id]: [...current, choiceId] };
    });
  };

  const unitPrice = computeUnitPrice(item, selections);
  const totalPrice = unitPrice * qty;

  // Validate: all single groups must have a selection
  const isValid = groups.every((g) => {
    if (g.selectionType === "single") return (selections[g.id] || []).length === 1;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="glass-card w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
        style={{ borderRadius: "24px 24px 0 0", cursor: "default" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-bold text-lg" style={{ color: "var(--theme-text-primary)" }}>
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {item.description && (
          <p className="px-5 text-xs mb-3" style={{ color: "var(--theme-text-secondary)" }}>
            {item.description}
          </p>
        )}

        {/* Option Groups */}
        <div className="px-5 flex flex-col gap-4">
          {groups.map((group) => {
            const selected = selections[group.id] || [];
            const remaining = group.selectionType === "limit" && group.maxSelections
              ? group.maxSelections - selected.length
              : null;

            return (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: "var(--theme-text-primary)" }}>
                    {group.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                    {group.selectionType === "single" && "เลือก 1 อย่าง"}
                    {group.selectionType === "multiple" && "เลือกได้หลายอย่าง"}
                    {group.selectionType === "limit" && remaining !== null && `เลือกได้อีก ${remaining} อย่าง`}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.choices.map((choice) => {
                    const isSelected = selected.includes(choice.id);
                    const isDisabled = !isSelected &&
                      group.selectionType === "limit" &&
                      group.maxSelections !== undefined &&
                      selected.length >= group.maxSelections;

                    return (
                      <button
                        key={choice.id}
                        onClick={() => toggleChoice(group, choice.id)}
                        disabled={isDisabled}
                        className="flex items-center justify-between p-3 rounded-xl transition-all"
                        style={{
                          background: isSelected
                            ? "color-mix(in srgb, var(--theme-primary) 12%, transparent)"
                            : "rgba(255,255,255,0.5)",
                          border: isSelected
                            ? "1.5px solid var(--theme-primary)"
                            : "1.5px solid transparent",
                          opacity: isDisabled ? 0.4 : 1,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Radio / Checkbox indicator */}
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              border: `2px solid ${isSelected ? "var(--theme-primary)" : "color-mix(in srgb, var(--theme-text-secondary) 30%, transparent)"}`,
                              borderRadius: group.selectionType === "single" ? "50%" : "6px",
                              background: isSelected ? "var(--theme-primary)" : "transparent",
                            }}
                          >
                            {isSelected && (
                              <CheckCircle size={12} style={{ color: "white" }} />
                            )}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>
                            {choice.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
                          {group.pricingType === "fixed" ? `฿${choice.price}` : `+฿${choice.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity + Add button */}
        <div className="p-5 pt-4 mt-2" style={{ borderTop: "1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)" }}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg w-8 text-center" style={{ color: "var(--theme-text-primary)" }}>
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={() => { if (isValid) onAdd(selections, qty); }}
            disabled={!isValid}
            className="glass-cta w-full"
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            เพิ่มลงตะกร้า ฿{totalPrice}
          </button>
        </div>
      </div>
    </div>
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
  cart: CartEntry[];
  setCart: (c: CartEntry[]) => void;
  onNext: () => void;
}) {
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  const total = cart.reduce((sum, entry) => sum + cartEntryTotal(entry, menu), 0);
  const count = cart.reduce((s, e) => s + e.quantity, 0);

  const imgClasses = [
    "menu-img-1",
    "menu-img-2",
    "menu-img-3",
    "menu-img-4",
    "menu-img-5",
    "menu-img-6",
  ];

  const hasOptions = (item: MenuItem) => item.optionGroups && item.optionGroups.length > 0;

  // Simple qty control for items without option groups
  const SimpleQtyControl = ({ itemId, price }: { itemId: string; price: number }) => {
    const entry = cart.find((e) => e.menuItemId === itemId);
    const qty = entry?.quantity || 0;

    if (qty === 0) {
      return (
        <button
          onClick={() => setCart([...cart, { id: Date.now().toString(), menuItemId: itemId, selections: {}, quantity: 1 }])}
          className="glass-cta"
          style={{ padding: "3px 10px", fontSize: "12px", borderRadius: "10px" }}
        >
          <Plus size={12} />
          เพิ่ม
        </button>
      );
    }
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            if (qty <= 1) setCart(cart.filter((e) => e.menuItemId !== itemId || Object.keys(e.selections).length > 0));
            else setCart(cart.map((e) => e.id === entry!.id ? { ...e, quantity: e.quantity - 1 } : e));
          }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
        >
          <Minus size={12} />
        </button>
        <span className="font-bold text-xs w-4 text-center" style={{ color: "var(--theme-text-primary)" }}>{qty}</span>
        <button
          onClick={() => setCart(cart.map((e) => e.id === entry!.id ? { ...e, quantity: e.quantity + 1 } : e))}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
        >
          <Plus size={12} />
        </button>
      </div>
    );
  };

  const handleAddFromModal = (item: MenuItem, selections: Record<string, string[]>, qty: number) => {
    const newEntry: CartEntry = {
      id: Date.now().toString(),
      menuItemId: item.id,
      selections,
      quantity: qty,
    };
    setCart([...cart, newEntry]);
    setModalItem(null);
  };

  // Count items in cart for a menu item
  const itemCartCount = (itemId: string) =>
    cart.filter((e) => e.menuItemId === itemId).reduce((s, e) => s + e.quantity, 0);

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
          const withOptions = hasOptions(item);
          const cartCount = itemCartCount(item.id);

          return (
            <div
              key={item.id}
              className="glass-card overflow-hidden"
              style={{ cursor: "default" }}
            >
              <div className="flex">
                {/* Image */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover shrink-0"
                    style={{ borderRadius: "24px 0 0 0" }}
                  />
                ) : (
                  <div
                    className={`${imgClasses[i % imgClasses.length]} w-24 h-24 shrink-0`}
                    style={{ borderRadius: "24px 0 0 0" }}
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
                    <span className="font-bold text-sm" style={{ color: "var(--theme-primary)" }}>
                      {withOptions
                        ? (() => {
                            const prices = item.optionGroups!.flatMap((g) =>
                              g.pricingType === "fixed" ? g.choices.map((c) => c.price) : []
                            );
                            if (prices.length > 0) {
                              const mn = Math.min(...prices);
                              const mx = Math.max(...prices);
                              return mn === mx ? `฿${mn}` : `฿${mn} - ฿${mx}`;
                            }
                            return `฿${item.price}`;
                          })()
                        : `฿${item.price}`}
                    </span>

                    {!withOptions && <SimpleQtyControl itemId={item.id} price={item.price} />}

                    {withOptions && (
                      <div className="flex items-center gap-1.5">
                        {cartCount > 0 && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "color-mix(in srgb, var(--theme-primary) 15%, transparent)", color: "var(--theme-primary)" }}
                          >
                            {cartCount}
                          </span>
                        )}
                        <button
                          onClick={() => setModalItem(item)}
                          className="glass-cta"
                          style={{ padding: "3px 10px", fontSize: "12px", borderRadius: "10px" }}
                        >
                          <Plus size={12} />
                          เลือก
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart entries for this item (with options) */}
              {withOptions && cartCount > 0 && (
                <div
                  className="px-3 pb-3 flex flex-col gap-1.5"
                  style={{ borderTop: "1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}
                >
                  {cart
                    .filter((e) => e.menuItemId === item.id)
                    .map((entry) => {
                      const selText = formatSelections(item, entry.selections);
                      const unitP = computeUnitPrice(item, entry.selections);
                      return (
                        <div key={entry.id} className="flex items-center justify-between pt-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs truncate" style={{ color: "var(--theme-text-secondary)" }}>
                              {selText || "ไม่มีตัวเลือก"}
                            </span>
                            <span className="text-xs font-semibold shrink-0" style={{ color: "var(--theme-primary)" }}>
                              ฿{unitP}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                if (entry.quantity <= 1) setCart(cart.filter((e) => e.id !== entry.id));
                                else setCart(cart.map((e) => e.id === entry.id ? { ...e, quantity: e.quantity - 1 } : e));
                              }}
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-bold text-xs w-4 text-center" style={{ color: "var(--theme-text-primary)" }}>
                              {entry.quantity}
                            </span>
                            <button
                              onClick={() => setCart(cart.map((e) => e.id === entry.id ? { ...e, quantity: e.quantity + 1 } : e))}
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)", color: "var(--theme-primary)" }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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

      {/* Selection Modal */}
      {modalItem && (
        <SelectionModal
          item={modalItem}
          onAdd={(selections, qty) => handleAddFromModal(modalItem, selections, qty)}
          onClose={() => setModalItem(null)}
        />
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
  const [accepted, setAccepted] = useState(false);
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
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span style={{ color: "var(--theme-text-secondary)" }}>
                {formatItemDisplay(item)} x{item.quantity}
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
          {config?.accountName && (
            <p className="text-sm font-medium mt-2" style={{ color: "var(--theme-text-primary)" }}>
              {config.accountName}
            </p>
          )}
          {config?.accountNumber && (
            <p className="text-xs mt-1" style={{ color: "var(--theme-text-secondary)" }}>
              เลขบัญชี: {config.accountNumber}
            </p>
          )}
          {qrDataUrl && (
            <a href={qrDataUrl} download="promptpay-qr.png" className="glass-cta-secondary inline-flex mt-2" style={{ fontSize: "13px", padding: "8px 16px" }}>
              <Download size={14} />
              บันทึก QR
            </a>
          )}

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

      <label className="flex items-start gap-3 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded accent-emerald-600 shrink-0"
        />
        <span className="text-xs leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
          รับที่ร้าน/ตลาดนัดเท่านั้นนะคะ ไม่มีบริการส่ง 🙏
        </span>
      </label>

      {method === "promptpay" && !slipFile && (
        <p className="text-xs text-center mb-3" style={{ color: "#E8668B" }}>
          กรุณาแนบสลิปก่อนสั่ง
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="glass-cta-secondary flex-1">
          <ArrowLeft size={16} />
          กลับ
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !accepted || (method === "promptpay" && !slipFile)}
          className="glass-cta flex-1"
          style={{ opacity: (submitting || !accepted || (method === "promptpay" && !slipFile)) ? 0.6 : 1 }}
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
  const { content } = useContent();
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

  // Notify ONCE when ready
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (isReady && !notifiedRef.current && "Notification" in window && Notification.permission === "granted") {
      notifiedRef.current = true;
      new Notification(`${content.shopName} - ถึงคิวแล้ว!`, {
        body: `คิว ${current.queueNumber} - มารับของได้เลย`,
        icon: "/favicon.ico",
      });
    }
  }, [isReady, current.queueNumber, content.shopName]);

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
                {formatItemDisplay(item)} x{item.quantity}
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

      {/* Add to Home Screen tip */}
      <div className="glass-card p-4 mb-3 text-left" style={{ cursor: "default" }}>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "color-mix(in srgb, var(--theme-primary) 12%, transparent)" }}
          >
            <Bell size={16} style={{ color: "var(--theme-primary)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--theme-text-primary)" }}>
            รับแจ้งเตือนเมื่อถึงคิว
          </p>
        </div>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--theme-text-secondary)" }}>
          เพิ่มเว็บนี้ลงหน้าจอโฮม แล้วเปิดจากไอคอน จะได้รับแจ้งเตือนอัตโนมัติ
        </p>

        {/* iPhone steps */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={14} style={{ color: "var(--theme-primary)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--theme-primary)" }}>iPhone / Safari</span>
          </div>
          <div className="flex items-start gap-3 ml-1">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <Share2 size={14} style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="text-[9px]" style={{ color: "var(--theme-text-secondary)" }}>แชร์</span>
            </div>
            <ArrowRight size={14} className="mt-1.5 shrink-0" style={{ color: "var(--theme-text-secondary)" }} />
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <Plus size={14} style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="text-[9px] text-center leading-tight" style={{ color: "var(--theme-text-secondary)" }}>เพิ่มไปที่<br />หน้าจอโฮม</span>
            </div>
            <ArrowRight size={14} className="mt-1.5 shrink-0" style={{ color: "var(--theme-text-secondary)" }} />
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <CheckCircle size={14} style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="text-[9px]" style={{ color: "var(--theme-text-secondary)" }}>เพิ่ม</span>
            </div>
          </div>
        </div>

        {/* Android steps */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={14} style={{ color: "var(--theme-primary)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--theme-primary)" }}>Android / Chrome</span>
          </div>
          <div className="flex items-start gap-3 ml-1">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth={2.5} strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </div>
              <span className="text-[9px]" style={{ color: "var(--theme-text-secondary)" }}>เมนู ⋮</span>
            </div>
            <ArrowRight size={14} className="mt-1.5 shrink-0" style={{ color: "var(--theme-text-secondary)" }} />
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <Plus size={14} style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="text-[9px] text-center leading-tight" style={{ color: "var(--theme-text-secondary)" }}>เพิ่มไปที่<br />หน้าจอหลัก</span>
            </div>
            <ArrowRight size={14} className="mt-1.5 shrink-0" style={{ color: "var(--theme-text-secondary)" }} />
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--theme-primary) 8%, transparent)" }}>
                <CheckCircle size={14} style={{ color: "var(--theme-primary)" }} />
              </div>
              <span className="text-[9px]" style={{ color: "var(--theme-text-secondary)" }}>ติดตั้ง</span>
            </div>
          </div>
        </div>
      </div>

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
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Build OrderItem[] from CartEntry[]
  const buildItems = useCallback((): OrderItem[] => {
    return cart
      .filter((entry) => entry.quantity > 0)
      .map((entry) => {
        const menuItem = content.menu.find((m) => m.id === entry.menuItemId)!;
        const unitPrice = computeUnitPrice(menuItem, entry.selections);
        const groups = menuItem.optionGroups || [];

        // Build selections for the order
        const selections: OrderItemSelection[] = [];
        for (const group of groups) {
          const selectedIds = entry.selections[group.id] || [];
          if (selectedIds.length === 0) continue;
          const choiceNames = selectedIds
            .map((cid) => group.choices.find((c) => c.id === cid)?.name)
            .filter(Boolean) as string[];
          let addedPrice = 0;
          if (group.pricingType === "addon") {
            addedPrice = selectedIds.reduce((sum, cid) => {
              const c = group.choices.find((ch) => ch.id === cid);
              return sum + (c?.price || 0);
            }, 0);
          }
          selections.push({ groupName: group.name, choiceNames, addedPrice });
        }

        return {
          menuItemId: entry.menuItemId,
          name: menuItem.name,
          selections: selections.length > 0 ? selections : undefined,
          price: unitPrice,
          quantity: entry.quantity,
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
