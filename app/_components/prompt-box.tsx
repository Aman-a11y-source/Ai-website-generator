"use client";

import React, { useRef, useState } from "react";
import { ArrowUp, ImagePlus, X, Loader2 } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";

interface PromptBoxProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: (prompt: string, image: File | null) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isGenerating?: boolean;
}

export default function PromptBox({
  prompt,
  setPrompt,
  onSubmit,
  textareaRef,
  isGenerating = false,
}: PromptBoxProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() && !selectedImage) return;
    if (isGenerating) return;
    onSubmit(prompt, selectedImage);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const hasContent = prompt.trim().length > 0 || selectedImage !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-border/40 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

        <div className="relative flex flex-col w-full rounded-2xl bg-card border border-border shadow-[0_12px_30px_-5px_rgba(28,28,26,0.04)] focus-within:border-stone-400/80 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300 overflow-hidden">
          
          {imagePreview && (
            <div className="p-4 pb-0 flex">
              <div className="relative group/thumb rounded-xl overflow-hidden border border-border/80 bg-muted p-1">
                <img
                  src={imagePreview}
                  alt="Reference Upload"
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  type="button"
                  className="absolute -top-1.5 -right-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full p-0.5 shadow-md transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your page design... (e.g. A sign up card with social logins)"
            rows={3}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/80 text-base py-4.5 px-5 outline-none resize-none font-heading leading-relaxed"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-t border-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerFileSelect}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                title="Add reference image"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
              {prompt.trim().length > 0 && (
                <span className="text-[11px] text-muted-foreground hidden sm:inline select-none font-medium">
                  {prompt.length} characters
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!hasContent ? (
                <button
                  type="button"
                  disabled={true}
                  className="flex items-center justify-center w-9.5 h-9.5 rounded-xl transition-all bg-muted text-muted-foreground/50 cursor-not-allowed"
                >
                  <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              ) : isSignedIn ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className={`flex items-center justify-center w-9.5 h-9.5 rounded-xl transition-all shadow-sm ${isGenerating ? 'bg-[#0A473B] text-white/80 cursor-wait' : 'bg-primary hover:bg-[#0A473B] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                  )}
                </button>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/workspace">
                  <button
                    type="button"
                    disabled={isGenerating}
                    className={`flex items-center justify-center w-9.5 h-9.5 rounded-xl transition-all shadow-sm ${isGenerating ? 'bg-[#0A473B] text-white/80 cursor-wait' : 'bg-primary hover:bg-[#0A473B] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                    )}
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
