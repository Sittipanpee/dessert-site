"use client";

import { Instagram, Facebook } from "lucide-react";
import { SiteContent } from "@/data/defaultContent";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
      style={{
        color: "rgba(255, 255, 255, 0.7)",
        background: "rgba(255, 255, 255, 0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#FFFFFF";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
      }}
    >
      {children}
    </a>
  );
}

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer style={{ background: "var(--theme-footer-bg)" }}>
      <div className="py-8 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="text-center sm:text-left">
            <div
              className="font-bold text-lg mb-1"
              style={{
                color: "#FFFFFF",
                fontFamily:
                  "var(--font-outfit), var(--font-noto-sans-thai), sans-serif",
              }}
            >
              {content.shopName}
            </div>
            <p
              className="text-sm"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {content.footer.tagline}
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {content.footer.facebook && (
              <SocialLink href={content.footer.facebook} label="Facebook">
                <Facebook size={20} />
              </SocialLink>
            )}
            {content.footer.instagram && (
              <SocialLink href={content.footer.instagram} label="Instagram">
                <Instagram size={20} />
              </SocialLink>
            )}
            {content.footer.tiktok && (
              <SocialLink href={content.footer.tiktok} label="TikTok">
                <TikTokIcon size={20} />
              </SocialLink>
            )}
          </div>

          {/* Copyright */}
          <p
            className="text-sm text-center sm:text-right"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            &copy; 2026 {content.shopName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
