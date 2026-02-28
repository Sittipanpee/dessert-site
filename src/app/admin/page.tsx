"use client";

import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { SiteContent, MenuItem, Branch, defaultContent } from "@/data/defaultContent";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  LogOut,
  Palette,
  ClipboardList,
} from "lucide-react";
import { LoginScreen, SectionCard } from "@/components/AdminShared";
import { useTheme, themes } from "@/hooks/useTheme";

function AdminDashboard() {
  const { content, saveContent, resetContent } = useContent();
  const { themeId, setTheme, currentTheme } = useTheme();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const handleSave = () => {
    saveContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("รีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้น?")) {
      resetContent();
      setDraft(defaultContent);
    }
  };

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    setDraft((d) => ({ ...d, hero: { ...d.hero, [field]: value } }));
  };

  const updateAbout = (field: string, value: string | string[]) => {
    setDraft((d) => ({ ...d, about: { ...d.about, [field]: value } }));
  };

  const updateCta = (field: keyof SiteContent["cta"], value: string) => {
    setDraft((d) => ({ ...d, cta: { ...d.cta, [field]: value } }));
  };

  const updateFooter = (field: keyof SiteContent["footer"], value: string) => {
    setDraft((d) => ({ ...d, footer: { ...d.footer, [field]: value } }));
  };

  const updateMenuItem = (
    id: string,
    field: keyof MenuItem,
    value: string | number | boolean
  ) => {
    setDraft((d) => ({
      ...d,
      menu: d.menu.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateBranch = (
    id: string,
    field: keyof Branch,
    value: string
  ) => {
    setDraft((d) => ({
      ...d,
      branches: d.branches.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }));
  };

  const addBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      name: "สาขาใหม่",
      mapEmbedUrl: "",
    };
    setDraft((d) => ({ ...d, branches: [...d.branches, newBranch] }));
  };

  const removeBranch = (id: string) => {
    setDraft((d) => ({
      ...d,
      branches: d.branches.filter((b) => b.id !== id),
    }));
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "เมนูใหม่",
      description: "รายละเอียดเมนู",
      price: 0,
      isPopular: false,
      imageUrl: "",
    };
    setDraft((d) => ({ ...d, menu: [...d.menu, newItem] }));
  };

  const removeMenuItem = (id: string) => {
    setDraft((d) => ({
      ...d,
      menu: d.menu.filter((item) => item.id !== id),
    }));
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background:
          `linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)`,
      }}
    >
      {/* Header */}
      <div
        className="glass-nav sticky top-0 z-50 flex items-center justify-between px-5 py-3 mx-0"
        style={{ borderRadius: 0 }}
      >
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          <ArrowLeft size={18} />
          กลับหน้าหลัก
        </a>
        <span
          className="font-bold"
          style={{
            color: "#0F1F17",
            fontFamily:
              "var(--font-outfit), var(--font-noto-sans-thai), sans-serif",
          }}
        >
          Admin Panel
        </span>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 text-sm"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          <LogOut size={16} />
          ออก
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-8">
        {/* Quick links */}
        <div className="flex gap-3 mb-6">
          <a
            href="/admin/queue"
            className="glass-cta flex-1 justify-center"
            style={{ padding: "12px 20px", fontSize: "14px" }}
          >
            <ClipboardList size={18} />
            จัดการคิว
          </a>
        </div>

        {/* Theme Selector */}
        <SectionCard title="ธีมสี (Color Theme)">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={18} style={{ color: "var(--theme-primary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              เลือกธีมสีสำหรับเว็บไซต์
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                style={{
                  background:
                    themeId === t.id
                      ? `color-mix(in srgb, ${t.primary} 12%, transparent)`
                      : "rgba(255, 255, 255, 0.5)",
                  border:
                    themeId === t.id
                      ? `2px solid ${t.primary}`
                      : "2px solid transparent",
                }}
              >
                {/* Color swatch */}
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: t.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: t.primaryLight }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: t.accent }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: themeId === t.id ? t.primary : "var(--theme-text-secondary)",
                  }}
                >
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="ชื่อร้าน">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              ชื่อร้าน (แสดงที่ Navbar, Footer, การแจ้งเตือน)
            </label>
            <input
              className="admin-input"
              value={draft.shopName}
              onChange={(e) => setDraft((d) => ({ ...d, shopName: e.target.value }))}
              placeholder="หวานละมุน"
            />
          </div>
        </SectionCard>

        {/* Hero */}
        <SectionCard title="Hero Section">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              หัวข้อหลัก
            </label>
            <input
              className="admin-input"
              value={draft.hero.heading}
              onChange={(e) => updateHero("heading", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              ข้อความรอง
            </label>
            <input
              className="admin-input"
              value={draft.hero.subtext}
              onChange={(e) => updateHero("subtext", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              เบอร์โทร
            </label>
            <input
              className="admin-input"
              value={draft.hero.phone}
              onChange={(e) => updateHero("phone", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              URL เว็บไซต์
            </label>
            <input
              className="admin-input"
              value={draft.hero.websiteUrl}
              onChange={(e) => updateHero("websiteUrl", e.target.value)}
            />
          </div>
        </SectionCard>

        {/* Menu */}
        <SectionCard title="Menu Items">
          <div className="flex flex-col gap-5">
            {draft.menu.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(45, 143, 94, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                    style={{ color: "#E8668B" }}
                    aria-label="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      ชื่อ
                    </label>
                    <input
                      className="admin-input"
                      value={item.name}
                      onChange={(e) =>
                        updateMenuItem(item.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      ราคา (฿)
                    </label>
                    <input
                      className="admin-input"
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      รายละเอียด
                    </label>
                    <input
                      className="admin-input"
                      value={item.description}
                      onChange={(e) =>
                        updateMenuItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      URL รูปภาพ (ว่างไว้ = ใช้สีพื้นหลัง)
                    </label>
                    <input
                      className="admin-input"
                      value={item.imageUrl}
                      onChange={(e) =>
                        updateMenuItem(item.id, "imageUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt="preview"
                        className="mt-2 w-24 h-18 object-cover rounded-lg"
                        style={{ border: "1px solid rgba(45,143,94,0.15)" }}
                      />
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isPopular}
                        onChange={(e) =>
                          updateMenuItem(item.id, "isPopular", e.target.checked)
                        }
                        className="w-4 h-4 rounded accent-emerald-600"
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        ยอดนิยม (Popular badge)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addMenuItem}
              className="glass-cta-secondary flex items-center justify-center gap-2 w-full"
            >
              <Plus size={18} />
              เพิ่มเมนู
            </button>
          </div>
        </SectionCard>

        {/* About */}
        <SectionCard title="About Section">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              หัวข้อ
            </label>
            <input
              className="admin-input"
              value={draft.about.heading}
              onChange={(e) => updateAbout("heading", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              URL รูปภาพ (ว่างไว้ = ใช้สีพื้นหลัง)
            </label>
            <input
              className="admin-input"
              value={draft.about.imageUrl}
              onChange={(e) => updateAbout("imageUrl", e.target.value)}
              placeholder="https://example.com/shop-photo.jpg"
            />
            {draft.about.imageUrl && (
              <img
                src={draft.about.imageUrl}
                alt="preview"
                className="w-32 h-24 object-cover rounded-xl"
                style={{ border: "1px solid rgba(45,143,94,0.15)" }}
              />
            )}
            {draft.about.paragraphs.map((p, i) => (
              <div key={i}>
                <label
                  className="text-sm font-medium mb-1 block"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  ย่อหน้าที่ {i + 1}
                </label>
                <textarea
                  className="admin-textarea"
                  value={p}
                  onChange={(e) => {
                    const newParagraphs = [...draft.about.paragraphs];
                    newParagraphs[i] = e.target.value;
                    updateAbout("paragraphs", newParagraphs);
                  }}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* CTA */}
        <SectionCard title="CTA Section">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              หัวข้อ
            </label>
            <input
              className="admin-input"
              value={draft.cta.heading}
              onChange={(e) => updateCta("heading", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              เบอร์โทร
            </label>
            <input
              className="admin-input"
              value={draft.cta.phone}
              onChange={(e) => updateCta("phone", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              URL เว็บไซต์
            </label>
            <input
              className="admin-input"
              value={draft.cta.websiteUrl}
              onChange={(e) => updateCta("websiteUrl", e.target.value)}
            />
          </div>
        </SectionCard>

        {/* Branches */}
        <SectionCard title="สาขา (Branches)">
          <div className="flex flex-col gap-5">
            {draft.branches.map((branch) => (
              <div
                key={branch.id}
                className="p-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(45, 143, 94, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {branch.name}
                  </span>
                  <button
                    onClick={() => removeBranch(branch.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                    style={{ color: "#E8668B" }}
                    aria-label="Delete branch"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--theme-text-secondary)" }}>
                      ชื่อสาขา
                    </label>
                    <input
                      className="admin-input"
                      value={branch.name}
                      onChange={(e) => updateBranch(branch.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--theme-text-secondary)" }}>
                      Google Map Embed URL
                    </label>
                    <input
                      className="admin-input"
                      value={branch.mapEmbedUrl}
                      onChange={(e) => updateBranch(branch.id, "mapEmbedUrl", e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addBranch}
              className="glass-cta-secondary flex items-center justify-center gap-2 w-full"
            >
              <Plus size={18} />
              เพิ่มสาขา
            </button>
          </div>
        </SectionCard>

        {/* Footer */}
        <SectionCard title="Footer">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              Tagline
            </label>
            <input
              className="admin-input"
              value={draft.footer.tagline}
              onChange={(e) => updateFooter("tagline", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              Facebook URL
            </label>
            <input
              className="admin-input"
              value={draft.footer.facebook}
              onChange={(e) => updateFooter("facebook", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              Instagram URL
            </label>
            <input
              className="admin-input"
              value={draft.footer.instagram}
              onChange={(e) => updateFooter("instagram", e.target.value)}
            />
            <label className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              TikTok URL
            </label>
            <input
              className="admin-input"
              value={draft.footer.tiktok}
              onChange={(e) => updateFooter("tiktok", e.target.value)}
            />
          </div>
        </SectionCard>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={handleSave} className="glass-cta flex-1">
            <Save size={18} />
            {saved ? "บันทึกแล้ว!" : "บันทึกการเปลี่ยนแปลง"}
          </button>
          <button onClick={handleReset} className="glass-cta-secondary flex-1">
            <RotateCcw size={18} />
            รีเซ็ตเป็นค่าเริ่มต้น
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <AdminDashboard />
  ) : (
    <LoginScreen onLogin={() => setAuthenticated(true)} />
  );
}
