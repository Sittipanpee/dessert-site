"use client";

import { Phone, ExternalLink } from "lucide-react";
import { SiteContent } from "@/data/defaultContent";
import { PandanAccent } from "@/components/PandanDecor";

export default function CtaSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="contact"
      className="py-12 sm:py-20 px-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--theme-bg-gradient-mid) 0%, var(--theme-bg-gradient-to) 40%, var(--theme-primary-light) 100%)",
      }}
    >
      {/* Pandan leaf accents */}
      <PandanAccent position="both" />

      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          width: "300px",
          height: "300px",
          background: "var(--theme-accent)",
          top: "-10%",
          right: "-5%",
          animationDelay: "-2s",
        }}
      />

      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="reveal glass-hero-overlay px-6 py-10 sm:px-10 sm:py-14">
          <h2
            className="font-bold mb-8"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.2,
              color: "var(--theme-text-primary)",
            }}
          >
            {content.cta.heading}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${content.cta.phone}`}
              className="glass-cta w-full sm:w-auto"
            >
              <Phone size={20} />
              โทรเลย
            </a>
            <a
              href={content.cta.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-cta-secondary w-full sm:w-auto"
            >
              <ExternalLink size={20} />
              เว็บไซต์ของเรา
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
