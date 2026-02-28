"use client";

import { useState, useEffect, useCallback } from "react";
import { defaultContent, SiteContent, MenuItem, OptionGroup } from "@/data/defaultContent";

const STORAGE_KEY = "dessert-site-content";

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults so new fields always exist
        const merged: SiteContent = {
          ...defaultContent,
          ...parsed,
          hero: { ...defaultContent.hero, ...parsed.hero },
          about: { ...defaultContent.about, ...parsed.about },
          cta: { ...defaultContent.cta, ...parsed.cta },
          footer: { ...defaultContent.footer, ...parsed.footer },
          menu: (parsed.menu ?? defaultContent.menu).map((item: Record<string, unknown>) => {
            const base = { imageUrl: "", ...item } as MenuItem;
            // Migration: convert old variations → optionGroups
            if (base.variations && base.variations.length > 0 && !base.optionGroups) {
              const migrated: OptionGroup = {
                id: "migrated-" + (base.id || Date.now()),
                name: "ตัวเลือก",
                pricingType: "fixed",
                selectionType: "single",
                choices: base.variations.map((v) => ({
                  id: v.id,
                  name: v.name,
                  price: v.price,
                })),
              };
              base.optionGroups = [migrated];
            }
            return base;
          }),
          branches: parsed.branches ?? defaultContent.branches,
        };
        setContent(merged);
      }
    } catch {
      // Fall back to defaults
    }
    setIsLoaded(true);
  }, []);

  const saveContent = useCallback((newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch {
      // Storage full or unavailable
    }
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { content, saveContent, resetContent, isLoaded };
}
