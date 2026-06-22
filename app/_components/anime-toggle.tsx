"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AnimeThemeToggleProps {
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

export default function AnimeThemeToggle({ theme, setTheme }: AnimeThemeToggleProps) {
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme();
  const currentTheme = theme || globalTheme;
  const changeTheme = setTheme || setGlobalTheme;

  const handleToggle = () => {
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    changeTheme(targetTheme);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="inline-flex items-center justify-center p-2.5 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all shadow-[0_1.5px_2.5px_rgba(28,28,26,0.015)] active:scale-[0.95] cursor-pointer"
        title={`Toggle to ${currentTheme === "light" ? "dark" : "light"} theme`}
        id="theme-toggle-button"
      >
        {currentTheme === "light" ? (
          <Moon className="w-4.5 h-4.5 stroke-[2.2]" />
        ) : (
          <Sun className="w-4.5 h-4.5 stroke-[2.2]" />
        )}
      </button>
    </div>
  );
}
