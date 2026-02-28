"use client";

import { SiteContent } from "@/data/defaultContent";

export default function AboutSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="about"
      className="py-12 sm:py-20 px-5"
      style={{ background: "var(--theme-bg-warm)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Image or placeholder */}
        <div className="reveal w-full lg:w-[45%] shrink-0">
          {content.about.imageUrl ? (
            <img
              src={content.about.imageUrl}
              alt={content.about.heading}
              className="w-full rounded-3xl object-cover"
              style={{
                aspectRatio: "4 / 3",
                boxShadow: `0 12px 40px color-mix(in srgb, var(--theme-primary) 15%, transparent)`,
              }}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full rounded-3xl"
              style={{
                aspectRatio: "4 / 3",
                background:
                  `linear-gradient(135deg, var(--theme-bg-gradient-to) 0%, var(--theme-primary-light) 40%, var(--theme-primary) 70%, var(--theme-primary-dark) 100%)`,
                boxShadow: `0 12px 40px color-mix(in srgb, var(--theme-primary) 15%, transparent)`,
              }}
            />
          )}
        </div>

        {/* Text */}
        <div className="reveal w-full lg:w-[55%]" style={{ transitionDelay: "150ms" }}>
          {/* Decorative line */}
          <div
            className="w-12 h-1 rounded-full mb-6"
            style={{ background: "var(--theme-primary)" }}
          />
          <h2
            className="font-bold mb-6"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.2,
              color: "var(--theme-text-primary)",
            }}
          >
            {content.about.heading}
          </h2>
          <div className="flex flex-col gap-4">
            {content.about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.125rem)",
                  lineHeight: 1.7,
                  color: "var(--theme-text-primary)",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
