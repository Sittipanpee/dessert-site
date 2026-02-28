"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ADMIN_PASSWORD = "admin1234";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  useTheme(); // Apply theme CSS variables

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)",
      }}
    >
      <div className="glass-hero-overlay w-full max-w-sm px-8 py-10 text-center">
        <div
          className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--theme-primary) 10%, transparent)" }}
        >
          <Lock size={24} style={{ color: "var(--theme-primary)" }} />
        </div>
        <h1
          className="font-bold text-2xl mb-2"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Admin Panel
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--theme-text-secondary)" }}>
          กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบ
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="admin-input mb-4"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="text-sm mb-3" style={{ color: "#E8668B" }}>
              รหัสผ่านไม่ถูกต้อง
            </p>
          )}
          <button type="submit" className="glass-cta w-full">
            เข้าสู่ระบบ
          </button>
        </form>
        <a
          href="/"
          className="inline-block mt-4 text-sm font-medium hover:underline"
          style={{ color: "var(--theme-primary)" }}
        >
          กลับหน้าหลัก
        </a>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 sm:p-7 mb-6" style={{ cursor: "default" }}>
      <h2
        className="font-bold text-lg mb-5 pb-3"
        style={{
          color: "var(--theme-text-primary)",
          borderBottom: "1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
