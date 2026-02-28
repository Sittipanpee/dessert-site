"use client";

import { Star } from "lucide-react";
import { SiteContent } from "@/data/defaultContent";

const imgClasses = [
  "menu-img-1",
  "menu-img-2",
  "menu-img-3",
  "menu-img-4",
  "menu-img-5",
  "menu-img-6",
];

export default function MenuSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="menu"
      className="py-12 sm:py-20 px-5"
      style={{ background: "var(--theme-bg-main)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <h2
          className="reveal font-bold text-center mb-10 sm:mb-14 flex items-center justify-center gap-2"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            lineHeight: 1.2,
            color: "var(--theme-text-primary)",
          }}
        >
          เมนูยอดนิยม
          <Star
            size={24}
            className="inline-block"
            style={{ color: "#F0A500", fill: "#F0A500" }}
          />
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {content.menu.map((item, i) => (
            <div
              key={item.id}
              className="reveal glass-card overflow-hidden flex flex-col"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image or placeholder */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full object-cover"
                  style={{
                    aspectRatio: "4 / 3",
                    borderRadius: "16px 16px 0 0",
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  className={`${imgClasses[i % imgClasses.length]} w-full`}
                  style={{
                    aspectRatio: "4 / 3",
                    borderRadius: "16px 16px 0 0",
                  }}
                />
              )}

              {/* Card content */}
              <div className="p-4 lg:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                      lineHeight: 1.3,
                      color: "var(--theme-text-primary)",
                    }}
                  >
                    {item.name}
                  </h3>
                  {item.isPopular && (
                    <span
                      className="shrink-0 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#E8668B" }}
                    >
                      ยอดนิยม
                    </span>
                  )}
                </div>
                <p
                  className="mb-3 line-clamp-2"
                  style={{
                    fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)",
                    lineHeight: 1.5,
                    color: "var(--theme-text-secondary)",
                  }}
                >
                  {item.description}
                </p>
                <div className="mt-auto text-right">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                      lineHeight: 1.2,
                      color: "var(--theme-primary)",
                    }}
                  >
                    {item.price}&#3647;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
