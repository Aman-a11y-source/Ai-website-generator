import React, { useState, useEffect, useContext } from 'react'
import WebPageTools from './WebPageTools'
import ElementSettingSection from './ElementSettingSection'
import ImageSettingSection from './ImageSettingSection'
import { OnSaveContext } from '@/context/OnSaveContext'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'

type prop = {
    generatedCode: string
}

declare global {
    interface Window {
        handleElementSelection?: (el: HTMLElement) => void;
    }
}

function WebsiteDesign({ generatedCode }: prop) {
    const [selectedScreenSize, setSelectedScreenSize] = useState('web')
    const [selectedEl,setSelectedEl]=useState<HTMLElement | null>(null)
    const [settingsWidth, setSettingsWidth] = useState(384);
    const {onSaveData,setOnSaveData}=useContext(OnSaveContext);
    const {projectId}=useParams();
    const params=useSearchParams();
    const isMobile = useIsMobile();
    const frameId=params.get("frameId");
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        window.handleElementSelection = (el: HTMLElement) => {
            setSelectedEl(el);
        };
        return () => {
            delete window.handleElementSelection;
        };
    }, []);
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite CSS & JS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZq+Mj7Vp7k8E5x29nLNn6j+CWeN/xg7fGqQpM8R1+a5/fQ1fjDb01Tz2uE5wPyQ5uISuA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Chart.js for charts & graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- AOS (Animate On Scroll) for scroll animations -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- GSAP (GreenSock) for advanced animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie for JSON-based animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper.js for sliders/carousels -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Optional: Tooltip & Popover library (Tippy.js) -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    
    <style>
        body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #ffffff;
        }
    </style>
    
    <script>
        // Intercept clicks on links and form submissions to prevent the iframe from navigating to the parent app
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target) {
                e.preventDefault();
                console.log('Navigation prevented in preview mode:', target.getAttribute('href'));
            }
        });
        document.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission prevented in preview mode');
        });

        // Element selection and editing logic
        (function() {
            let hoverEl = null;
            let selectedEl = null;

            const handleMouseOver = (e) => {
                if (selectedEl) return;
                const target = e.target;
                if (target === document.body || target === document.documentElement) return;
                if (hoverEl && hoverEl !== target) {
                    hoverEl.style.removeProperty('outline');
                    hoverEl.style.removeProperty('outline-offset');
                }
                hoverEl = target;
                hoverEl.style.setProperty('outline', '2px dotted blue', 'important');
                hoverEl.style.setProperty('outline-offset', '-2px', 'important');
            };

            const handleMouseOut = (e) => {
                if (selectedEl) return;
                if (hoverEl) {
                    hoverEl.style.removeProperty('outline');
                    hoverEl.style.removeProperty('outline-offset');
                    hoverEl = null;
                }
            };

            const handleBlur = (e) => {
                if (selectedEl && e.target === selectedEl) {
                    console.log("Final edited element:", selectedEl.outerHTML);
                }
            };

            const handleClick = (e) => {
                const target = e.target;
                if (target === document.body || target === document.documentElement) return;

                e.preventDefault();
                e.stopPropagation();

                if (selectedEl && selectedEl !== target) {
                    selectedEl.style.removeProperty('outline');
                    selectedEl.style.removeProperty('outline-offset');
                    selectedEl.removeAttribute("contenteditable");
                }

                selectedEl = target;
                selectedEl.style.setProperty('outline', '2px solid red', 'important');
                selectedEl.style.setProperty('outline-offset', '-2px', 'important');
                selectedEl.setAttribute("contenteditable", "true");
                
                console.log("Selected element:", selectedEl);
                if (window.parent && window.parent.handleElementSelection) {
                    window.parent.handleElementSelection(selectedEl);
                }
            };

            const handleKeyDown = (e) => {
                if (e.key === "Escape" && selectedEl) {
                    selectedEl.style.removeProperty('outline');
                    selectedEl.style.removeProperty('outline-offset');
                    selectedEl.removeAttribute("contenteditable");
                    selectedEl = null;
                }
            };

            document.addEventListener("mouseover", handleMouseOver);
            document.addEventListener("mouseout", handleMouseOut);
            document.addEventListener("click", handleClick);
            document.addEventListener("blur", handleBlur, true);
            document.addEventListener("keydown", handleKeyDown);
        })();
    </script>
</head>
<body>
    ${generatedCode || '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #a8a29e; font-family: sans-serif; font-size: 14px;">Your generated website preview will appear here...</div>'}
</body>
</html>
    `;

    useEffect(()=>{
        if(onSaveData) {
            onSaveCode();
        }
    },[onSaveData])

    const onSaveCode=async ()=>{
        if(iframeRef.current){
            try{
                const iframeDoc=iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                if(iframeDoc){
                    const cloneDoc=iframeDoc.documentElement.cloneNode(true) as HTMLElement;
                    //remove outlines
                    const AllEls=cloneDoc.querySelectorAll<HTMLElement>('*');
                    AllEls.forEach(el=>{
                        el.style.removeProperty('outline');
                        el.style.removeProperty('outline-offset');
                        el.style.cursor='';

                        
                    })
                    
                    const html=cloneDoc.querySelector('body')?.innerHTML || '';

                    try {
                        const result=await axios.put('/api/frames',{
                            designCode:html,
                            frameId:frameId,
                            projectId:projectId
                        })
                        console.log(result.data);
                        toast.success('Saved!')
                    } catch (error: any) {
                        toast.error("Failed to save design code: " + (error.response?.data?.message || error.message));
                    }
                }
            }
            catch(err){

            }
        }
    }

    return (
        <div className={isMobile ? 'flex flex-col h-auto bg-background' : 'flex h-full overflow-hidden bg-background'}>
            <div className={isMobile ? 'w-full h-[calc(100vh-56px)] flex flex-col p-4' : 'flex-1 h-full flex flex-col p-4 pb-6'}>
                <div 
                    className="flex-1 flex items-center justify-center overflow-hidden min-h-0 border border-border rounded-t-xl bg-card shadow-sm relative"
                >
                    <iframe
                        ref={iframeRef}
                        srcDoc={htmlContent}
                        title="Website Design Preview"
                        className={`h-full border border-border shadow-sm transition-all duration-300 bg-white ${
                            selectedScreenSize === 'mobile' 
                                ? 'w-[375px] rounded-2xl max-w-full shadow-md' 
                                : 'w-full rounded-lg'
                        }`}
                    />
                </div>
                <WebPageTools 
                    selectedScreenSize={selectedScreenSize}
                    setSelectedScreenSize={setSelectedScreenSize}
                    generatedCode={generatedCode}
                />
            </div>

            {/* Settings Resizer */}
            {!isMobile && (
                <div 
                    className="h-full flex-shrink-0 relative z-50 hover:bg-primary/20 transition-colors"
                    style={{ cursor: 'col-resize', width: '6px', minWidth: '6px', backgroundColor: 'var(--border)' }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startWidth = settingsWidth;
                        const onMouseMove = (moveEvent: MouseEvent) => {
                            const newWidth = startWidth - (moveEvent.clientX - startX);
                            setSettingsWidth(Math.max(250, Math.min(600, newWidth)));
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

            {/* Settings Section */}
            {(selectedEl && (selectedEl?.tagName === 'IMG' || selectedEl)) && (
                <div 
                    style={isMobile ? { width: '100%', minHeight: '350px' } : { width: settingsWidth }} 
                    className={isMobile ? "shrink-0 h-auto overflow-y-auto bg-card border-t border-border shadow-sm" : "shrink-0 h-full overflow-y-auto bg-card border-l border-border shadow-sm"}
                >
                    {selectedEl?.tagName === 'IMG' ? (
                        // @ts-ignore
                        <ImageSettingSection selectedEl={selectedEl} />
                    ) : selectedEl ? (
                        <ElementSettingSection selectedEl={selectedEl} clearSelection={() => setSelectedEl(null)} />
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default WebsiteDesign
