"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import AnimeThemeToggle from "./anime-toggle";
import Link from "next/link";

interface HeaderProps {
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

export default function Header({ theme = "light", setTheme = () => {} }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60 py-3.5 shadow-sm"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="w-full px-6 sm:px-12">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 flex justify-start">
            <Link 
              href={isSignedIn ? "/workspace" : "/"} 
              className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01] select-none group"
            >
              <svg className="w-8 h-8 text-[#2D7A31] transition-transform duration-300 group-hover:rotate-3" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="18" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
                <rect x="12" y="10" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
                <rect x="22" y="2" width="32" height="32" rx="8" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold tracking-[0.16em] text-foreground font-heading select-none mt-0.5">
                KAIRO
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-10">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Contact us
            </Link>
          </nav>

          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              <AnimeThemeToggle theme={theme} setTheme={setTheme} />
              {!isSignedIn ? (
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-background bg-foreground hover:bg-primary hover:text-white rounded-xl transition-all duration-250 shadow-sm active:scale-[0.97] cursor-pointer">
                    Get Started
                  </button>
                </SignInButton>
              ) : (
                <>
                  <a
                    href="/workspace"
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-background bg-foreground hover:bg-primary hover:text-white rounded-xl transition-all duration-250 shadow-sm active:scale-[0.97]"
                  >
                    Go to Workspace
                  </a>
                  <UserButton />
                </>
              )}
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <AnimeThemeToggle theme={theme} setTheme={setTheme} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 border-b border-border/80 backdrop-blur-lg animate-fade-in">
          <div className="px-6 pt-3 pb-6 space-y-2.5">
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Contact us
            </Link>
            <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
              {!isSignedIn ? (
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-foreground hover:bg-primary text-background hover:text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Get Started
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </SignInButton>
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-xl mb-1">
                    <span className="text-sm font-semibold text-muted-foreground">Account</span>
                    <UserButton />
                  </div>
                  <a
                    href="/workspace"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-foreground hover:bg-primary text-background hover:text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Go to Workspace
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
