"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

const navLinks = [
  { label: "เมนู", href: "#menu" },
  { label: "เกี่ยวกับ", href: "#about" },
  { label: "สาขา", href: "#branches" },
  { label: "ติดต่อ", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`glass-nav ${scrolled ? "scrolled" : ""} fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-5 py-2.5 lg:px-8`}
        style={{ height: "clamp(52px, 6vw, 60px)" }}
      >
        {/* Logo */}
        <a
          href="#"
          className="font-bold text-lg tracking-tight"
          style={{
            color: "var(--theme-primary)",
            fontFamily: "var(--font-outfit), var(--font-noto-sans-thai), sans-serif",
          }}
        >
          หวานละมุน
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] lg:text-base font-medium transition-colors duration-200"
              style={{ color: "var(--theme-text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text-secondary)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/order"
            className="glass-cta"
            style={{ padding: "8px 20px", fontSize: "14px", borderRadius: "12px" }}
          >
            <ShoppingCart size={16} />
            สั่งซื้อ
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{ color: "var(--theme-primary)" }}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="mobile-menu-overlay fixed inset-0 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out panel */}
      <div
        className={`mobile-menu-panel fixed top-0 right-0 bottom-0 w-72 z-50 p-6 flex flex-col gap-6 transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            aria-label="Close menu"
            style={{ color: "var(--theme-primary)" }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-xl font-semibold py-2 transition-colors"
              style={{ color: "var(--theme-text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text-primary)")}
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="/order"
          className="glass-cta mt-2 text-center"
          onClick={() => setMobileOpen(false)}
        >
          <ShoppingCart size={18} />
          สั่งซื้อ
        </a>
      </div>
    </>
  );
}
