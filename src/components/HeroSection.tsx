"use client";

import { Phone, ExternalLink, ChevronDown } from "lucide-react";
import { SiteContent } from "@/data/defaultContent";
import { PandanAccent } from "@/components/PandanDecor";

export default function HeroSection({ content }: { content: SiteContent }) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-5"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-from) 0%, var(--theme-bg-gradient-mid) 40%, var(--theme-bg-gradient-to) 100%)",
      }}
    >
      {/* Pandan leaf accents */}
      <PandanAccent position="both" />

      {/* Floating blobs */}
      <div
        className="blob"
        style={{
          width: "340px",
          height: "340px",
          background: "var(--theme-primary-light)",
          top: "10%",
          left: "-5%",
          animationDelay: "0s",
        }}
      />
      <div
        className="blob"
        style={{
          width: "260px",
          height: "260px",
          background: "var(--theme-accent)",
          top: "50%",
          right: "-3%",
          animationDelay: "-3s",
        }}
      />
      <div
        className="blob"
        style={{
          width: "200px",
          height: "200px",
          background: "var(--theme-bg-gradient-mid)",
          bottom: "15%",
          left: "30%",
          animationDelay: "-5s",
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="glass-hero-overlay relative z-10 max-w-xl w-full mx-auto px-6 py-10 sm:px-10 sm:py-14 text-center">
        <h1
          className="font-bold leading-[1.1] mb-4"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            color: "var(--theme-text-primary)",
            fontFamily: "var(--font-noto-sans-thai), sans-serif",
          }}
        >
          {content.hero.heading}
        </h1>
        <p
          className="mb-8 font-normal"
          style={{
            fontSize: "clamp(1.0625rem, 2.5vw, 1.125rem)",
            lineHeight: 1.6,
            color: "var(--theme-text-secondary)",
          }}
        >
          {content.hero.subtext}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={`tel:${content.hero.phone}`} className="glass-cta w-full sm:w-auto">
            <Phone size={20} />
            โทรสั่งเลย
          </a>
          <a
            href={content.hero.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-cta-secondary w-full sm:w-auto"
          >
            <ExternalLink size={20} />
            ดูเพิ่มเติม
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#menu" aria-label="Scroll down">
          <ChevronDown
            size={28}
            className="animate-bounce-slow"
            style={{ color: "var(--theme-primary)" }}
          />
        </a>
      </div>
    </section>
  );
}
