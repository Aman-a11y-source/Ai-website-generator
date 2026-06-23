"use client";

import React, { useContext } from 'react';
import { OnSaveContext } from '@/context/OnSaveContext';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserButton, useAuth } from '@clerk/nextjs';
import AnimeThemeToggle from '@/app/_components/anime-toggle';

interface PlaygroundHeaderProps {
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

function PlaygroundHeader({ theme = "light", setTheme }: PlaygroundHeaderProps) {
  const { onSaveData, setOnSaveData } = useContext(OnSaveContext);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <header
      className="w-full bg-background border-b border-border shadow-sm relative z-50 transition-colors duration-300"
      style={{ height: '56px' }}
    >
      <div className="flex items-center justify-between px-5 h-full">
        {/* Left: Logo + Back to workspace */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 select-none cursor-pointer group"
            onClick={() => router.push('/')}
          >
              <svg
              className="w-6 h-6 text-[#2D7A31] transition-transform duration-300 group-hover:rotate-3"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="18" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
              <rect x="12" y="10" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
              <rect x="22" y="2" width="32" height="32" rx="8" fill="currentColor" />
            </svg>
            <span className="text-sm font-bold tracking-[0.14em] text-foreground mt-0.5 font-heading">
              KAIRO
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-border" />

          {/* Back button */}
          <button
            onClick={() => router.push('/workspace')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Workspace
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {setTheme && (
            <AnimeThemeToggle theme={theme} setTheme={setTheme} />
          )}

          {/* Save Button */}
          <button
            className="inline-flex items-center justify-center gap-2 px-5.5 py-2 text-xs font-bold text-white rounded-xl bg-primary hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-md shadow-primary/20 cursor-pointer"
            onClick={() => setOnSaveData(Date.now())}
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>

          {/* User Button */}
          <div className="ml-0.5 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 rounded-xl border border-border shadow-sm',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default PlaygroundHeader;
