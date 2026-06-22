"use client";

import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PromptBox from "../_components/prompt-box";
import { toast } from "sonner";

const SUGGESTIONS = [
  {
    label: "Dashboard",
    text: "A clean modern dashboard with left sidebar navigation, activity analytics charts, and recent activity list",
  },
  {
    label: "SignUp Form",
    text: "An elegant sign-up modal card with validation, google OAuth integration, and minimal visual illustrations",
  },
  {
    label: "Hero",
    text: "A high-fidelity landing page hero layout with bold typography, dynamic CTAs, and structural grid mockups",
  },
  {
    label: "User Profile Card",
    text: "A responsive contact profile card displaying statistics, follow actions, bios, and refined hover borders",
  },
];

export default function WorkspacePage() {
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    toast.success("Design prompt filled!", {
      description: "Click the arrow to launch workspace compilation.",
      duration: 2500,
    });
  };

  const generateRandomFrameNumbers = () => {
    return Math.floor(Math.random() * 10000);
  };

  const createNewProject = async (userInput: string) => {
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumbers();
    const messages = userInput.trim().length > 0 ? [
      {
        role: "user",
        content: userInput,
      },
    ] : [];

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

  const handlePromptSubmit = async (submittedPrompt: string, image: File | null) => {
    if (isGenerating) return;
    setIsGenerating(true);
    await createNewProject(submittedPrompt);
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center relative z-10">
      <div className="w-full max-w-4xl text-center space-y-6 mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight text-foreground">
          Welcome, <span className="font-semibold text-primary">{user?.firstName || "Guest"}</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed tracking-wide">
          Generate, edit and explore designs with AI. Export to production-ready code.
        </p>
      </div>

      <div className="w-full mt-2">
        <PromptBox 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onSubmit={handlePromptSubmit} 
          textareaRef={textareaRef}
          isGenerating={isGenerating}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 w-full mt-6 max-w-2xl mx-auto">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleSuggestionClick(item.text)}
            className="inline-flex items-center px-4.5 py-1.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/30 text-muted-foreground hover:text-primary shadow-sm text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.97]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
