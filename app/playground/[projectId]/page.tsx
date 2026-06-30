"use client"

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useContext } from 'react'
import PlaygroundHeader from '../components/playgroundHeaders'
import ChatSection from '../components/ChatSection'
import WebsiteDesign from '../components/WebsiteDesign'
import axios from 'axios'
import { cn } from "../../../lib/utils";
import { toast } from 'sonner'
import { useAuth } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/userDetailContext";
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const SYSTEM_PROMPT = `userInput: {userInput}
Instructions:
1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:
   - Generate a complete HTML Tailwind CSS code using Flowbite UI components.
   - Use a modern design with **blue as the primary color theme**.
   - Only include the <body> content (do not add <head> or <title>).
   - Make it fully responsive for all screen sizes.
   - All primary components must match the theme color.
   - Add proper padding and margin for each element.
   - Components should be independent; do not connect them.
   - Use placeholders for all images:
     - ALWAYS use this exact URL for all image placeholders: https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg
     - Add an alt tag describing the image prompt.
   - Use the following libraries/components where appropriate:
     - FontAwesome icons (fa fa-)
     - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
     - Chart.js for charts & graphs
     - Swiper.js for sliders/carousels
     - Tippy.js for tooltips & popovers
   - Include interactive components like modals, dropdowns, and accordions.
   - Ensure proper spacing, alignment, hierarchy, and theme consistency.
   - Ensure charts are visually appealing and match the theme color.
   - Header menu options should be spread out and not connected.
   - Do not include broken links.
   - CRITICAL: You MUST wrap the generated HTML code in \`\`\`html \`\`\` block. Do not add any extra text before or after the HTML code.

2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:
   - Respond with a simple, friendly text message instead of generating any code.

Example:
- User: "Hi" -> Response: "Hello! How can I help you today?"
- User: "Build a responsive landing page with Tailwind CSS" -> Response: [Generate full HTML code as per instructions above]`;

export type Frame = {
    projectId: string;
    frameId: string;
    designCode: string;
    chatMesaages: Messages[];
}

export type Messages = {
    role: string;
    content: string;
}

export default function Playground() {
    const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get("frameId");
    const [frameDetail, setFrameDetail] = useState<Frame>();
    const [chatWidth, setChatWidth] = useState(500);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const { theme, setTheme } = useTheme();
    const isMobile = useIsMobile();
    
    const router = useRouter();
    const { has, isSignedIn } = useAuth();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const hasUnlimitedCredit = has && has({ plan: 'unlimited' });
    
    useEffect(() => {
        if (frameId) {
            setGeneratedCode("");
            setMessages([]);
            setFrameDetail(undefined);
            GetFrameDetails();
        }
    }, [frameId, projectId])  
    
    const GetFrameDetails = async () => {
        const result = await axios.get('/api/frames?frameId=' + frameId + "&projectId=" + projectId)
        setFrameDetail(result.data)
        const designCode = result.data?.designCode;
        if (designCode) {
            let cleanCode = designCode;
            const index = designCode.indexOf("```html");
            if (index !== -1) {
                cleanCode = designCode.slice(index + 7);
            }
            cleanCode = cleanCode.replace(/```$/, '').trim();
            setGeneratedCode(cleanCode);
        }
        const chatMsgs = result.data?.chatMessages;
        if (chatMsgs && chatMsgs.length > 0) {
            setMessages(chatMsgs);
            if (chatMsgs.length === 1 && !designCode) {
                const userMsg = chatMsgs[0].content;
                if (userMsg.trim().length > 0) {
                    SendMessage(userMsg, true);
                }
            }
        }
    }
     
    const SendMessage = async (userInput: string, isInitial: boolean = false) => {
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        if (!hasUnlimitedCredit) {
            const currentCredits = userDetail?.credits ?? 2;
            if (currentCredits <= 0) {
                toast.error("You have run out of credits! Please upgrade to the unlimited plan.");
                router.push('/workspace/pricing');
                return;
            }
        }

        setLoading(true);
        
        if (!isInitial) {
            setMessages((prev) => [...(prev || []), { role: 'user', content: userInput }]);
        }
      
        const finalPrompt = SYSTEM_PROMPT.replace('{userInput}', userInput);

        const result = await fetch('/api/ai-model', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: "user", content: finalPrompt }],
            })
        });

        if (!result.ok) {
            const errorData = await result.json().catch(() => ({}));
            const errorMsg = errorData.error || "Failed to generate design";
            console.error("AI Model generation failed:", errorMsg);
            toast.error(`Generation Failed: ${errorMsg}`);
            setMessages((prev: any) => [
                ...(prev || []),
                { role: 'assistant', content: `Sorry, code generation failed: ${errorMsg}. Please try again.` }
            ]);
            setLoading(false);
            return;
        }

        const reader = result.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";
        let isCode = false;
        let consoleBuffer = "";
      
        console.log("Starting stream from AI model...");

        while (true) {
            //@ts-ignore
            const { done, value } = await reader?.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            aiResponse += chunk;
            
            if (!isCode) {
                let startIndex = aiResponse.indexOf('```html');
                if (startIndex !== -1) {
                    isCode = true;
                    const initialCodeChunk = aiResponse.slice(startIndex + 7);
                    setGeneratedCode(initialCodeChunk);
                    consoleBuffer += initialCodeChunk;
                } else if (aiResponse.includes('<body') || aiResponse.includes('<div ') || aiResponse.includes('<section')) {
                    isCode = true;
                    startIndex = Math.max(0, aiResponse.indexOf('<'));
                    const initialCodeChunk = aiResponse.slice(startIndex);
                    setGeneratedCode(initialCodeChunk);
                    consoleBuffer += initialCodeChunk;
                }
            } else {
                const cleanChunk = chunk.replace(/```$/, '');
                setGeneratedCode((prev) => (prev || "") + cleanChunk);
                consoleBuffer += cleanChunk;
            }

            if (isCode && consoleBuffer.includes("\n")) {
                const lines = consoleBuffer.split("\n");
                consoleBuffer = lines.pop() || "";
                for (const line of lines) {
                    console.log("Code stream:", line);
                }
            }
        }
        await SaveGeneratedCode(aiResponse);
        if (!isCode) {
            setMessages((prev: any) => [
                ...(prev || []),
                { role: 'assistant', content: aiResponse }
            ]);
        } else {
            if (consoleBuffer) {
                console.log("Code stream:", consoleBuffer);
            }

            let finalCode = "";
            let startIndex = aiResponse.indexOf('```html');
            if (startIndex !== -1) {
                finalCode = aiResponse.slice(startIndex + 7).replace(/```$/, '');
            } else {
                startIndex = Math.max(0, aiResponse.indexOf('<'));
                finalCode = aiResponse.slice(startIndex).replace(/```$/, '');
            }
            console.log("=== FINAL GENERATED CODE ===\n", finalCode);

            setMessages((prev: any) => [
                ...(prev || []),
                { role: 'assistant', content: 'Your code is ready!' } 
            ]);
        }
      
        if (!hasUnlimitedCredit) {
            try {
                const response = await axios.put('/api/users');
                if (response.data?.user) {
                    setUserDetail(response.data.user);
                }
            } catch (err) {
                console.error("Failed to deduct credits:", err);
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        if (messages.length > 0 && frameId) {
            SaveMessages();
        }
    }, [messages, frameId])

    const SaveMessages = async () => {
        try {
            const result = await axios.put('/api/chats', {
                messages: messages,
                frameId: frameId
            });
            console.log(result);
        } catch (error: any) {
            toast.error("Failed to save chat: " + (error.response?.data?.message || error.message));
        }
    }

    const SaveGeneratedCode = async (code: string) => {
        try {
            const result = await axios.put('/api/frames', {
                designCode: code,
                frameId: frameId,
                projectId: projectId
            })
            console.log(result.data);
            toast.success('Website is Ready!')
        } catch (error: any) {
            toast.error("Failed to save design code: " + (error.response?.data?.message || error.message));
        }
    }

    return (
        <div className={cn(isMobile ? 'min-h-[100dvh]' : 'h-[100dvh]', 'flex', 'flex-col', 'bg-background', 'font-sans', isMobile ? 'overflow-y-auto' : 'overflow-hidden')}>
            <div className={cn('shrink-0', 'border-b', 'border-border')}>
                <PlaygroundHeader theme={theme} setTheme={setTheme} />
            </div>
            
            <div className={cn('flex-1', 'flex', isMobile ? 'flex-col' : 'flex-row', isMobile ? '' : 'overflow-hidden', 'w-full', 'bg-background')}>
                <div 
                    style={isMobile ? { width: '100%', height: 'calc(100vh - 56px)' } : { width: chatWidth }} 
                    className={cn('shrink-0', isMobile ? 'border-b' : 'border-r', 'border-border', 'overflow-y-auto', 'flex', 'flex-col', 'bg-card')}
                >
                    <ChatSection messages={messages ?? []} onSend={(input: string) => SendMessage(input)} loading={loading} />
                </div>

                {/* Left/Right Resizer bar */}
                {!isMobile && (
                    <div 
                        className="h-full flex-shrink-0 relative z-50 -ml-[3px] hover:bg-primary/20 transition-colors"
                        style={{ cursor: 'col-resize', width: '6px', minWidth: '6px', backgroundColor: 'var(--border)' }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.clientX;
                            const startWidth = chatWidth;
                            const onMouseMove = (moveEvent: MouseEvent) => {
                                const newWidth = startWidth + (moveEvent.clientX - startX);
                                setChatWidth(Math.max(400, Math.min(800, newWidth)));
                            };
                            const onMouseUp = () => {
                                document.removeEventListener('mousemove', onMouseMove);
                                document.removeEventListener('mouseup', onMouseUp);
                            };
                            document.addEventListener('mousemove', onMouseMove);
                            document.addEventListener('mouseup', onMouseUp);
                        }}
                    />
                )}
                
                <div className={cn('flex-1', isMobile ? 'min-h-[100vh]' : 'overflow-hidden', 'relative', 'bg-background')}>
                    <WebsiteDesign generatedCode={generatedCode} />
                </div>
            </div>
        </div>
    );
}
