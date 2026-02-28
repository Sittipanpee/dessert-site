"use client";

import { useState, useEffect, useCallback } from "react";

export interface ThemePalette {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  bgMain: string;
  bgWarm: string;
  bgGradientFrom: string;
  bgGradientMid: string;
  bgGradientTo: string;
  textPrimary: string;
  textSecondary: string;
  footerBg: string;
}

export const themes: ThemePalette[] = [
  {
    id: "pandan",
    name: "ใบเตย",
    primary: "#2D8F5E",
    primaryDark: "#1A6B42",
    primaryLight: "#5ABD8C",
    accent: "#34D399",
    bgMain: "#F7FBF8",
    bgWarm: "#FFF8E7",
    bgGradientFrom: "#F7FBF8",
    bgGradientMid: "#E8F5EC",
    bgGradientTo: "#D1FAE5",
    textPrimary: "#0F1F17",
    textSecondary: "#5B6B62",
    footerBg: "#1A2E23",
  },
  {
    id: "sakura",
    name: "ซากุระ",
    primary: "#C75B7A",
    primaryDark: "#A3445E",
    primaryLight: "#E8899F",
    accent: "#F2A7B8",
    bgMain: "#FFF8F9",
    bgWarm: "#FFF0F3",
    bgGradientFrom: "#FFF8F9",
    bgGradientMid: "#FCE4EC",
    bgGradientTo: "#F8BBD0",
    textPrimary: "#2E1118",
    textSecondary: "#7A5A63",
    footerBg: "#2E1118",
  },
  {
    id: "ocean",
    name: "มหาสมุทร",
    primary: "#2E86AB",
    primaryDark: "#1C6886",
    primaryLight: "#5CB8D6",
    accent: "#36C5F0",
    bgMain: "#F6FBFE",
    bgWarm: "#E8F4F8",
    bgGradientFrom: "#F6FBFE",
    bgGradientMid: "#DCF0F9",
    bgGradientTo: "#B3E0F2",
    textPrimary: "#0C1E27",
    textSecondary: "#557A88",
    footerBg: "#0C1E27",
  },
  {
    id: "taro",
    name: "เผือก",
    primary: "#7B5EA7",
    primaryDark: "#5D4487",
    primaryLight: "#A78BCA",
    accent: "#C5A3E0",
    bgMain: "#FAF8FD",
    bgWarm: "#F3EDFA",
    bgGradientFrom: "#FAF8FD",
    bgGradientMid: "#EDE4F5",
    bgGradientTo: "#D7C4EA",
    textPrimary: "#1B1226",
    textSecondary: "#6E5F7A",
    footerBg: "#1B1226",
  },
  {
    id: "mango",
    name: "มะม่วง",
    primary: "#D4873A",
    primaryDark: "#B06A24",
    primaryLight: "#E8A962",
    accent: "#F0C674",
    bgMain: "#FFFBF5",
    bgWarm: "#FFF4E6",
    bgGradientFrom: "#FFFBF5",
    bgGradientMid: "#FEECD2",
    bgGradientTo: "#FDDAAF",
    textPrimary: "#261A0A",
    textSecondary: "#7A6650",
    footerBg: "#261A0A",
  },
];

const STORAGE_KEY = "dessert-site-theme";

export function useTheme() {
  const [themeId, setThemeId] = useState("pandan");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && themes.find((t) => t.id === stored)) {
        setThemeId(stored);
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    if (!isLoaded) return;
    const theme = themes.find((t) => t.id === themeId) || themes[0];
    const root = document.documentElement;

    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-primary-dark", theme.primaryDark);
    root.style.setProperty("--theme-primary-light", theme.primaryLight);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-bg-main", theme.bgMain);
    root.style.setProperty("--theme-bg-warm", theme.bgWarm);
    root.style.setProperty("--theme-bg-gradient-from", theme.bgGradientFrom);
    root.style.setProperty("--theme-bg-gradient-mid", theme.bgGradientMid);
    root.style.setProperty("--theme-bg-gradient-to", theme.bgGradientTo);
    root.style.setProperty("--theme-text-primary", theme.textPrimary);
    root.style.setProperty("--theme-text-secondary", theme.textSecondary);
    root.style.setProperty("--theme-footer-bg", theme.footerBg);
  }, [themeId, isLoaded]);

  const setTheme = useCallback((id: string) => {
    setThemeId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const currentTheme = themes.find((t) => t.id === themeId) || themes[0];

  return { themeId, setTheme, currentTheme, themes, isLoaded };
}
