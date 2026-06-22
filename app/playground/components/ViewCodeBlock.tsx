import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-ignore
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

export const ViewCodeBlock = ({ children, code }: any) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code: ", err);
        }
    };

    return (
        <Dialog>
            <DialogTrigger render={children} />
            <DialogContent 
                style={{ 
                    backgroundColor: '#fbf7e6', 
                    borderColor: '#316a33',
                    height: '80vh',
                    maxHeight: '80vh',
                    width: '90vw',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                className="!max-w-[1000px] border text-[#0b3b17] rounded-2xl p-6 shadow-xl overflow-hidden"
            >
                {/* Fully isolated flex column inside the popup */}
                <div className="w-full h-full flex flex-col overflow-hidden">
                    
                    {/* Header - Fixed to top */}
                    <div className="flex flex-row items-center justify-between border-b border-[#316a33]/25 pb-4 pr-10 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-[#0b3b17] font-sans">Source Code</h2>
                            <p className="text-stone-600 text-xs mt-1 font-medium">
                                Review and copy the compiled HTML/Tailwind CSS source code.
                            </p>
                        </div>
                        <button 
                            onClick={handleCopy}
                            style={{ backgroundColor: '#0b3b17', color: '#fbf7e6' }}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Code</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Code viewport - Scrollable in both directions */}
                    <div 
                        style={{ borderColor: '#316a33' }}
                        className="flex-1 w-full overflow-auto rounded-xl border mt-4 bg-white p-2 shadow-inner min-h-0"
                    >
                        <div style={{ minWidth: '800px' }}>
                            <SyntaxHighlighter
                                language="html"
                                style={prism}
                                customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    background: 'transparent',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace'
                                }}
                            >
                                {code || ''}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
