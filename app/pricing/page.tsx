"use client";

import React, { useState } from "react";
import { PricingTable } from '@clerk/nextjs';
import Header from "../_components/header";
import InteractiveGrid from "../_components/interactive-grid";
import { useTheme } from "@/context/ThemeContext";

export default function PublicPricing() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-foreground"
    >
      <Header theme={theme} setTheme={setTheme} />
      <InteractiveGrid />

      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-32 pb-16 max-w-5xl mx-auto w-full z-10">
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1C1C1A] dark:text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
            Pricing{" "}
            <span className="relative inline-block whitespace-nowrap">
              <svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                className="text-[#C5E3C6] dark:text-[#123F35]"
                style={{
                  position: "absolute",
                  left: "-8px",
                  bottom: "-2px",
                  width: "calc(100% + 16px)",
                  height: "1.25em",
                  pointerEvents: "none",
                  opacity: 0.85,
                  transform: "rotate(-1.2deg)"
                }}
              >
                <path
                  d="M 4,14 C 27,11 50,8 73,6.5 C 83,6 93,5.5 101,6.5 C 100,8.5 96.5,10.5 91,12.5 C 69,15.5 47,17.5 24,18.5 C 14,19 7,17.5 1,14.5 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[#1C1C1A] dark:text-[#C5E3C6]" style={{ position: 'relative', paddingLeft: '8px', paddingRight: '8px' }}>Plans</span>
            </span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-4 text-sm sm:text-base font-sans max-w-md mx-auto leading-relaxed">
                ‎ 
          </p>
        </div>

        <div className="w-full max-w-5xl flex justify-center mt-8">
          <PricingTable 
            appearance={{
              elements: {
                rootBox: "relative z-[99999]",
                card: "rounded-none",
                button: "rounded-none"
              },
              variables: {
                colorPrimary: '#2D7A31', 
                colorBackground: theme === 'dark' ? '#1C1C1A' : '#F4F3ED',
                colorForeground: theme === 'dark' ? '#FAF9F5' : '#1C1C1A',
                colorMutedForeground: theme === 'dark' ? '#A3A39E' : '#75746E',
                colorSuccess: theme === 'dark' ? '#C5E3C6' : '#2D7A31',
                colorBorder: theme === 'dark' ? '#2D2D2A' : '#E6E5DF',
                borderRadius: '0px',
              }
            }}
          />
        </div>
      </main>

      <footer className="w-full py-8 border-t border-border/60 bg-transparent text-center px-6 relative z-10 select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted-foreground font-heading tracking-wider">Kairo AI</span>
            <span className="text-[10px] text-border/40">|</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
