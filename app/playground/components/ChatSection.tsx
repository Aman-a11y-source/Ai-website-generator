import { Messages } from '@/app/playground/[projectId]/page'
import React, { useState, useEffect } from 'react'
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from 'lucide-react';

type Props = {
    messages: Messages[],
    onSend:any,
    loading?: boolean
}

const FUNNY_MESSAGES = [
    "generating response...",
    "waiting for approval from bill gates...",
    "testing your patience...",
    "hang on a sec...",
    "go ahead, hold your breath...",
    "this server is powered by a lemon and two electrodes...",
    "are we there yet...",
    "cleaning up after your prompt, respectfully...",
    "making sense of what you meant, not what you said...",
    "finalizing the result before new problems appear...",
    "adding the parts your request assumed were implied...",
    "asking Einstein to review the math...",
    "bending spacetime around your request...",
];
function ChatSection({ messages,onSend,loading }: Props) {

    const [input,setInput]=useState<string>();
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        if (!loading) return;

        const getRandomMessage = () => FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
        setLoadingMessage(getRandomMessage());

        const interval = setInterval(() => {
            setLoadingMessage(getRandomMessage());
        }, 3000);

        return () => clearInterval(interval);
    }, [loading]);

    const handleSend=()=>{
        if(!input?.trim()) return;
        onSend(input);
        setInput('')
    }
    return (
        <div className={cn('w-full', 'h-full', 'flex', 'flex-col', 'bg-card')}>
            {/* Message section */}
            <div className={cn('flex-1', 'overflow-y-auto', 'p-6', 'space-y-6')}>
                {messages?.length === 0 ? (
                    <div className={cn('flex', 'h-full', 'items-center', 'justify-center')}>
                        <p className={cn('text-muted-foreground', 'text-sm')}>No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div key={i} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                                <div 
                                    className={cn(
                                    "px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed overflow-hidden border",
                                    isUser
                                        ? "rounded-br-[2px] bg-primary text-primary-foreground border-primary"
                                        : "rounded-bl-[2px] bg-muted text-foreground border-border"
                                )}>
                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                </div>
                            </div>

                        );
                    })
                )}
                {loading && (
                    <div className='flex justify-center items-center gap-2.5 p-4 bg-muted/30 border border-border/40 rounded-2xl animate-pulse max-w-max mx-auto'>
                        <Loader2 className='animate-spin h-4 w-4 text-primary' />
                        <span className='text-muted-foreground text-xs font-semibold'>{loadingMessage}</span>
                    </div>
                )}
            </div>

            {/* Footer input */}
            <div className={cn('p-4', 'bg-card', 'border-t', 'border-border/50')}>
                <div className={cn('relative', 'border', 'border-border', 'focus-within:border-primary/50', 'rounded-2xl', 'flex', 'items-end', 'p-2', 'bg-background', 'shadow-sm', 'transition-all', 'duration-200')}>
                    <textarea
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        placeholder="Describe your website design idea"
                        rows={1}
                        className={cn('w-full', 'resize-none', 'bg-transparent', 'focus:outline-none', 'text-sm', 'p-2', 'text-foreground', 'placeholder-muted-foreground/60', 'min-h-[40px]', 'max-h-[120px]')}
                    />
                    <button 
                        onClick={handleSend} 
                        className={cn('p-2', 'rounded-xl', 'bg-primary', 'text-primary-foreground', 'hover:opacity-90', 'transition-opacity', 'shrink-0', 'mb-0.5', 'mr-0.5', 'flex', 'items-center', 'justify-center', 'cursor-pointer')}
                    >
                        <ArrowUp className={cn('w-4', 'h-4')} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatSection

function onSend(input: string) {
    throw new Error('Function not implemented.');
}
