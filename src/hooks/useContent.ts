"use client";

import { useState, useEffect, useCallback } from "react";
import { defaultContent, SiteContent, MenuItem, OptionGroup } from "@/data/defaultContent";

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => res.json())
      .then((data: SiteContent) => {
        // Migration: convert old variations → optionGroups
        const migrated: SiteContent = {
          ...data,
          menu: (data.menu ?? []).map((item: MenuItem) => {
            if (item.variations && item.variations.length > 0 && !item.optionGroups) {
              const group: OptionGroup = {
                id: "migrated-" + (item.id || Date.now()),
                name: "ตัวเลือก",
                pricingType: "fixed",
                selectionType: "single",
                choices: item.variations.map((v) => ({
                  id: v.id,
                  name: v.name,
                  price: v.price,
                })),
              };
              return { ...item, optionGroups: [group] };
            }
            return item;
          }),
        };
        setContent(migrated);
      })
      .catch(() => {
        // Fall back to defaults
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const saveContent = useCallback(async (newContent: SiteContent) => {
    setContent(newContent);
    setIsSaving(true);
    try {
      await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
    } catch {
      // Silent fail — content is still updated locally
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetContent = useCallback(async () => {
    setContent(defaultContent);
    setIsSaving(true);
    try {
      await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultContent),
      });
    } catch {
      // Silent fail
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { content, saveContent, resetContent, isLoaded, isSaving };
}
