"use client";

import React, { useState } from "react";
import { Loader2, Send } from "lucide-react";
import Header from "../_components/header";
import InteractiveGrid from "../_components/interactive-grid";
import { toast } from "sonner";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: "1px" }}
  >
    <circle cx="10" cy="10" r="9.5" stroke="var(--primary)" strokeWidth="1.5" />
    <path
      d="M6 10.5L8.5 13L14 7.5"
      stroke="var(--primary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const inputClass =
  "w-full text-sm h-10 px-3 rounded-xl bg-background text-foreground outline-none placeholder:opacity-40 transition-all";

const inputStyle = { border: "1px solid var(--border)" };

function FocusInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "var(--primary)";
  e.target.style.boxShadow = "0 0 0 3px color-mix(in oklch, var(--primary) 14%, transparent)";
}
function BlurInput(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
}

export default function ContactPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/contact", { name, email, company, subject, message });
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
      setName(""); setEmail(""); setCompany(""); setSubject(""); setMessage("");
      setTimeout(() => setSent(false), 5000);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      <InteractiveGrid />

      <main
        className="relative z-10 flex-1 flex items-start justify-center px-6"
        style={{ paddingTop: "110px", paddingBottom: "64px" }}
      >
        <div className="w-full max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-12 items-start">
            <div>
              <h1
                className="text-foreground tracking-tight leading-[1.1] mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.2rem, 3.8vw, 3rem)",
                  fontWeight: 700,
                }}
              >
                Talk to{" "}
                <span
                  className="italic"
                  style={{ color: "var(--primary)", fontFamily: "var(--font-serif)" }}
                >
                  Aman
                </span>
                <br />
                Directly
              </h1>

              <p
                className="text-muted-foreground text-sm leading-relaxed"
                style={{ maxWidth: "320px", marginBottom: "2.25rem" }}
              >
                Got a question about KAIRO AI? Use the form and I&apos;ll get back to you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", marginBottom: "0.35rem" }}>
                    <CheckIcon />
                    <h3 className="text-foreground font-bold text-[15px]">24/7 Email Support</h3>
                  </div>
                  <p
                    className="text-muted-foreground text-[13px] leading-relaxed"
                    style={{ paddingLeft: "1.65rem", maxWidth: "310px" }}
                  >
                    Need help with KAIRO AI, your account, or a feature? Reach out anytime by email and I&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", marginBottom: "0.35rem" }}>
                    <CheckIcon />
                    <h3 className="text-foreground font-bold text-[15px]">Bug Reports &amp; Technical Issues</h3>
                  </div>
                  <p
                    className="text-muted-foreground text-[13px] leading-relaxed"
                    style={{ paddingLeft: "1.65rem", maxWidth: "310px" }}
                  >
                    Ran into a bug, broken generation, or something just acting cursed? Send the details through the form and I&apos;ll look into it.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", marginBottom: "0.35rem" }}>
                    <CheckIcon />
                    <h3 className="text-foreground font-bold text-[15px]">Unlimited ImageKit Access</h3>
                  </div>
                  <p
                    className="text-muted-foreground text-[13px] leading-relaxed"
                    style={{ paddingLeft: "1.65rem", maxWidth: "310px" }}
                  >
                    Unlimited tier users get unrestricted ImageKit usage, along with support for upload, storage, and media-related issues.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 28px rgba(0,0,0,0.05)",
                padding: "2.25rem 2.5rem",
              }}
            >
              <h2
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                }}
              >
                Please enter your information
              </h2>

              {sent ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3.5rem 0",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground" style={{ maxWidth: "220px" }}>
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                        onFocus={FocusInput}
                        onBlur={BlurInput}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                        style={inputStyle}
                        onFocus={FocusInput}
                        onBlur={BlurInput}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="What's this about?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={FocusInput}
                      onBlur={BlurInput}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Message
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Enter your message here ..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl bg-background text-foreground px-3 py-2.5 outline-none resize-none placeholder:opacity-40 transition-all"
                      style={{ ...inputStyle, display: "block" }}
                      onFocus={FocusInput}
                      onBlur={BlurInput}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "linear-gradient(to right, #59A95C, #2D7A31)",
                      border: "none",
                      borderRadius: "9999px",
                      height: "48px",
                      minHeight: "48px",
                      width: "100%",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      marginTop: "0.25rem",
                      transition: "opacity 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer
        className="relative z-10 w-full py-6 px-6"
        style={{ borderTop: "1px solid color-mix(in oklch, var(--border) 60%, transparent)" }}
      >
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-muted-foreground/60"
          style={{ maxWidth: "960px", margin: "0 auto" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted-foreground tracking-wider">Kairo AI</span>
            <span className="opacity-30">|</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 820px) {
          .contact-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
