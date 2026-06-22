"use client";

import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { 
  Layout, 
  FileText, 
  Sparkles, 
  Layers
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Header from "./_components/header";
import PromptBox from "./_components/prompt-box";
import InteractiveGrid from "./_components/interactive-grid";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const SUGGESTIONS = [
  {
    label: "Dashboard",
    icon: Layout,
    text: "A clean modern dashboard with left sidebar navigation, activity analytics charts, and recent activity list",
  },
  {
    label: "SignUp Form",
    icon: FileText,
    text: "An elegant sign-up modal card with validation, google OAuth integration, and minimal visual illustrations",
  },
  {
    label: "Hero",
    icon: Sparkles,
    text: "A high-fidelity landing page hero layout with bold typography, dynamic CTAs, and structural grid mockups",
  },
  {
    label: "User Profile Card",
    icon: Layers,
    text: "A responsive contact profile card displaying statistics, follow actions, bios, and refined hover borders",
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateRandomFrameNumbers = () => {
    return Math.floor(Math.random() * 10000);
  };

  const createNewProject = async (userInput: string) => {
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumbers();
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      await axios.post("/api/project", {
        projectId,
        frameId,
        messages,
      });
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Internal Server Error", {
        description: "Failed to create project. Please try again.",
      });
    }
  };

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    toast.success("Design prompt filled!", {
      description: "Click the arrow to initiate layout compilation.",
      duration: 3000,
    });
  };

  const handlePromptSubmit = async (submittedPrompt: string, image: File | null) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);

    await createNewProject(submittedPrompt);
    setIsGenerating(false);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-foreground">
      <Toaster 
        position="bottom-right" 
        theme={theme} 
        toastOptions={{
          className: "bg-card border border-border text-foreground rounded-xl shadow-lg font-sans",
        }} 
      />
      
      <Header theme={theme} setTheme={setTheme} />
      <InteractiveGrid />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-10">
        <div 
          style={{ WebkitTextStroke: theme === "dark" ? "1.5px rgba(250, 250, 245, 0.035)" : "1.5px rgba(28, 28, 26, 0.035)" }}
          className="watermark-text animate-watermark-float"
        >
          KAIRO
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16 max-w-5xl mx-auto w-full">
        <div className="w-full text-center space-y-6 animate-text-reveal">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium leading-[1.15] tracking-tight max-w-3xl mx-auto">
            What should we <span className="font-heading italic text-primary font-semibold">design</span>?
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-heading tracking-wide">
            Generate, edit and explore designs with AI. Export to production-ready code.
          </p>
        </div>

        <div className="w-full mt-10 animate-fade-in-up z-20">
          <PromptBox 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onSubmit={handlePromptSubmit} 
            textareaRef={textareaRef}
            isGenerating={isGenerating}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full mt-6 max-w-2xl mx-auto animate-fade-in-up">
          {SUGGESTIONS.map((item) => {
            return (
              <button
                key={item.label}
                onClick={() => handleSuggestionClick(item.text)}
                className="inline-flex items-center px-4.5 py-1.5 rounded-full border border-border/80 bg-card hover:bg-primary/5 hover:border-primary/30 text-muted-foreground hover:text-primary shadow-[0_1.5px_2.5px_rgba(28,28,26,0.015)] text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer active:scale-[0.97]"
              >
                {item.label}
              </button>
            );
          })}
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
      </footer >
    </div>
  );
}
