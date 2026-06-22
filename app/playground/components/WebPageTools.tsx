import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, SquareArrowOutUpRight, Code2Icon, Download } from 'lucide-react';
import { ViewCodeBlock } from './ViewCodeBlock';

type WebPageToolsProps = {
    selectedScreenSize: string;
    setSelectedScreenSize: (size: string) => void;
    generatedCode: string;
};

function WebPageTools({ selectedScreenSize, setSelectedScreenSize, generatedCode }: WebPageToolsProps) {
    const [finalCode, setFinalCode] = useState<string>("");

    useEffect(() => {
        if (generatedCode) {
            const cleanCode = generatedCode
                .replaceAll("```html", '')
                .replace('```', '')
                .replace('html', '');
            setFinalCode(cleanCode);
        }
    }, [generatedCode]);

    const ViewInNewTab = () => {
        if (!finalCode) return;
        
        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder - Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    <style>
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: #ffffff; }
    </style>
</head>
<body>
    ${finalCode}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const DownloadCode = () => {
        if (!finalCode) return;

        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder - Exported Design</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    <style>
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: #ffffff; }
    </style>
</head>
<body>
    ${finalCode}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div 
            style={{ backgroundColor: '#e5dfb8', borderColor: '#316a33' }}
            className="flex items-center justify-between p-3.5 border-x border-b rounded-b-xl"
        >
            {/* Left Side: Viewport Toggles in capsule */}
            <div className="flex items-center gap-1.5 bg-[#fbf7e6]/45 p-1 rounded-xl border border-[#316a33]/20">
                <button 
                    style={{
                        backgroundColor: selectedScreenSize === 'web' ? '#0b3b17' : 'transparent',
                        color: selectedScreenSize === 'web' ? '#fbf7e6' : '#0b3b17'
                    }}
                    className={`p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                        selectedScreenSize !== 'web' ? 'hover:bg-[#fbf7e6]/80' : 'shadow-sm'
                    }`} 
                    onClick={() => setSelectedScreenSize('web')}
                    title="Desktop View"
                >
                    <Monitor className="h-4 w-4" />
                </button>
                <button 
                    style={{
                        backgroundColor: selectedScreenSize === 'mobile' ? '#0b3b17' : 'transparent',
                        color: selectedScreenSize === 'mobile' ? '#fbf7e6' : '#0b3b17'
                    }}
                    className={`p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                        selectedScreenSize !== 'mobile' ? 'hover:bg-[#fbf7e6]/80' : 'shadow-sm'
                    }`} 
                    onClick={() => setSelectedScreenSize('mobile')}
                    title="Mobile View"
                >
                    <Smartphone className="h-4 w-4" />
                </button>
            </div>

            {/* Right Side: Compact Action Buttons */}
            <div className="flex items-center gap-2">
                {/* View Live */}
                <button 
                    style={{ borderColor: '#0b3b17', color: '#0b3b17' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-[#fbf7e6]/65 active:scale-95 transition-all bg-[#fbf7e6]/30 shadow-sm cursor-pointer"
                    onClick={() => ViewInNewTab()}
                >
                    <span>View</span> 
                    <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                </button>

                {/* View Code */}
                <ViewCodeBlock code={finalCode}>
                    <button 
                        style={{ backgroundColor: '#0b3b17', color: '#fbf7e6' }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                        <span>Code</span> 
                        <Code2Icon className="h-3.5 w-3.5" />
                    </button>
                </ViewCodeBlock>

                {/* Download */}
                <button 
                    style={{ borderColor: '#0b3b17', color: '#0b3b17' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-[#fbf7e6]/65 active:scale-95 transition-all bg-[#fbf7e6]/30 shadow-sm cursor-pointer"
                    onClick={() => DownloadCode()}
                >
                    <span>Download</span> 
                    <Download className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

export default WebPageTools;
