"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Folder, 
  PanelLeftClose, 
  PanelLeftOpen 
} from "lucide-react";
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/userDetailContext";
import InteractiveGrid from "../_components/interactive-grid";
import { toast, Toaster } from "sonner";
import AnimeThemeToggle from "../_components/anime-toggle";
import { useTheme } from "@/context/ThemeContext";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const {has}=useAuth();
  
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        GetProjectList();
      } else {
        setIsFetchingProjects(false);
      }
    }
  }, [user, isLoaded]);

  const hasUnlimitedCredit = has && has({ plan: 'unlimited' })

  const GetProjectList = async () => {
    try {
      setIsFetchingProjects(true);
      const result = await axios.get('/api/get-app-projects');
      setProjectList(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const credits = userDetail?.credits ?? 2;
  const creditsPercent = Math.min((credits / 2) * 100, 100);

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

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-heading relative">
      <Toaster 
        position="bottom-right" 
        theme={theme} 
        toastOptions={{
          className: "bg-card border border-border text-foreground rounded-xl shadow-lg font-sans",
        }} 
      />

      {loading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Workspace...</p>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-[#FAF9F5] dark:bg-card border-r border-border transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5.5 border-b border-border select-none">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <svg className="w-7.5 h-7.5 text-primary" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="18" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
              <rect x="12" y="10" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="3.5" />
              <rect x="22" y="2" width="32" height="32" rx="8" fill="currentColor" />
            </svg>
            <span className="text-lg font-bold tracking-[0.14em] text-foreground mt-0.5">
              KAIRO
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={() => {
              setLoading(true);
              createNewProject("");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        </div>

        <div className="flex-1 px-4 py-2 overflow-y-auto space-y-4">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase px-2">
              Projects
            </span>
            <div className="mt-2.5">
              {isFetchingProjects ? (
                <div className="mt-2 space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-9 w-full bg-stone-200/50 dark:bg-stone-850/50 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : projectList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl bg-card text-center">
                  <Folder className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
                  <p className="mt-2.5 text-[13px] text-foreground font-medium">No Projects Found</p>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[160px] leading-relaxed">Create your first project to start compiling layouts.</p>
                </div>
              ) : (
                projectList.map((project: any, index: number) => (
                  <Link 
                    href={`/playground/${project.projectId}?frameId=${project.frameId}`} 
                    key={index} 
                    onClick={() => setLoading(true)}
                    className="block my-2 hover:bg-muted p-3 rounded-lg cursor-pointer transition-all"
                  >
                    <h2 className="line-clamp-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                      {project?.chats?.[0]?.chatMessage?.[0]?.content || "Untitled Project"}
                    </h2>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-card/30 space-y-4">
          {!hasUnlimitedCredit && (
            <div className="p-4 bg-card border border-border rounded-2xl shadow-[0_2px_8px_-2px_rgba(28,28,26,0.03)]">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Remaining Credits</span>
                <span className="text-foreground font-bold">{credits}</span>
              </div>
              
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden border border-border/20">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>

              <button 
                onClick={() => toast.success("Unlimited plan checkout initiated!")}
                className="w-full mt-3.5 py-2 text-xs font-bold text-foreground hover:text-background bg-transparent hover:bg-foreground border border-border hover:border-foreground rounded-xl transition-all duration-200 cursor-pointer text-center"
              >
                <Link href="/workspace/pricing" className="w-full block">
                Upgrade To Unlimited
                </Link>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 border border-border rounded-2xl select-none">
            <UserButton />
            <span className="text-[13px] font-bold text-muted-foreground">
              Settings
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main 
        className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ${
          sidebarOpen ? "md:pl-72" : "md:pl-0"
        }`}
      >
        <InteractiveGrid />

        <header className="flex items-center justify-between px-6 py-4 bg-background/40 border-b border-border/40 backdrop-blur-sm relative">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <AnimeThemeToggle />
          </div>
        </header>

        {children}
      </main>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px] md:hidden"
        />
      )}
    </div>
  );
}
