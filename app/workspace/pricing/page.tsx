"use client";

import React from "react";
import { PricingTable } from '@clerk/nextjs';
import { useTheme } from "@/context/ThemeContext";

export default function Pricing() {
    const { theme } = useTheme();
    return (
        <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-start relative pt-16 sm:pt-20">
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
                <p className="text-stone-500 mt-4 text-sm sm:text-base font-sans max-w-md mx-auto leading-relaxed">
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
        </div>
    );
}