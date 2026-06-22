"use client";

import React from "react";

export default function InteractiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundSize: "80px 80px",
          backgroundImage: `
            linear-gradient(to right, rgba(28, 28, 26, 0.11) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(28, 28, 26, 0.11) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(circle at center, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 85%)",
        }}
      />
    </div>
  );
}
