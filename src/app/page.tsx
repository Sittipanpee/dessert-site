"use client";

import { useContent } from "@/hooks/useContent";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTheme } from "@/hooks/useTheme";
import { PandanBackground } from "@/components/PandanDecor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import BranchesSection from "@/components/BranchesSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import MyQueueFloat from "@/components/MyQueueFloat";

export default function Home() {
  const { content, isLoaded } = useContent();
  useScrollReveal(isLoaded);
  useTheme(); // Apply theme CSS variables

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--theme-bg-main)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--theme-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <>
      <PandanBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <HeroSection content={content} />
        <MenuSection content={content} />
        <AboutSection content={content} />
        <BranchesSection content={content} />
        <CtaSection content={content} />
        <Footer content={content} />
        <MyQueueFloat />
      </div>
    </>
  );
}
