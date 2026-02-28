"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { SiteContent } from "@/data/defaultContent";

export default function BranchesSection({
  content,
}: {
  content: SiteContent;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const branches = content.branches;

  if (!branches || branches.length === 0) return null;

  return (
    <section
      id="branches"
      className="py-12 sm:py-20 px-5 relative overflow-hidden"
      style={{ background: "var(--theme-bg-main)" }}
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        <h2
          className="reveal font-bold text-center mb-3"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            lineHeight: 1.2,
            color: "var(--theme-text-primary)",
          }}
        >
          สาขาของเรา
        </h2>
        <p
          className="reveal text-center mb-8 sm:mb-12"
          style={{
            fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
            color: "var(--theme-text-secondary)",
          }}
        >
          เลือกสาขาที่สะดวกแล้วแวะมาชิมกันได้เลย
        </p>

        {/* Branch tabs */}
        <div className="reveal flex flex-wrap items-center justify-center gap-3 mb-8">
          {branches.map((branch, i) => (
            <button
              key={branch.id}
              onClick={() => setActiveIdx(i)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                activeIdx === i
                  ? {
                      background: "color-mix(in srgb, var(--theme-primary) 85%, transparent)",
                      color: "#fff",
                      boxShadow: `0 4px 16px color-mix(in srgb, var(--theme-primary) 25%, transparent)`,
                    }
                  : {
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      color: "var(--theme-primary)",
                    }
              }
            >
              <MapPin size={16} />
              {branch.name}
            </button>
          ))}
        </div>

        {/* Active map */}
        <div
          className="reveal glass-card overflow-hidden"
          style={{ cursor: "default", padding: 0 }}
        >
          {/* Branch name header inside card */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{
              background: "color-mix(in srgb, var(--theme-primary) 6%, transparent)",
              borderBottom: "1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)",
            }}
          >
            <MapPin size={18} style={{ color: "var(--theme-primary)" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {branches[activeIdx].name}
            </span>
          </div>
          <iframe
            key={branches[activeIdx].id}
            src={branches[activeIdx].mapEmbedUrl}
            width="100%"
            height="320"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`แผนที่ ${branches[activeIdx].name}`}
          />
        </div>
      </div>
    </section>
  );
}
