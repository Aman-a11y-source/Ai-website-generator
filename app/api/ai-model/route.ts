import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    
    let response: Response;
    let isGemini = false;

    if (geminiKey) {
      isGemini = true;
      const promptText = messages?.[0]?.content || "";
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
          }),
        }
      );
    } else if (openrouterKey) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "My Next.js App",
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free",
          messages,
          stream: true,
        }),
      });
    } else {
      return NextResponse.json(
        { error: "No API key configured. Please set GEMINI_API_KEY or OPENROUTER_API_KEY in your .env file." },
        { status: 400 }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`${isGemini ? "Gemini" : "OpenRouter"} API Error:`, response.status, errText);
      return NextResponse.json({ error: `${isGemini ? "Gemini" : "OpenRouter"} API Error`, details: errText }, { status: response.status });
    }

    const stream = response.body;
    if (!stream) {
      return NextResponse.json({ error: "No stream from API response" }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        let buffer = "";
        let isClosed = false;

        const closeController = () => {
          if (!isClosed) {
            isClosed = true;
            try { controller.close(); } catch (e) {}
          }
        };

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!isGemini && line.includes("[DONE]")) {
                closeController();
                return;
              }
              if (line.startsWith("data:")) {
                const dataStr = line.replace("data:", "").trim();
                if (!dataStr) continue;
                try {
                  const data = JSON.parse(dataStr);
                  
                  const text = isGemini 
                    ? data.candidates?.[0]?.content?.parts?.[0]?.text
                    : data.choices?.[0]?.delta?.content;

                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                }
              }
            }
          }
          closeController();
        } catch (err) {
          console.error("Stream reading error:", err);
          if (!isClosed) {
            isClosed = true;
            controller.error(err);
          }
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("API error:", error);
    require('fs').appendFileSync('error.log', "Error in /api/ai-model: " + (error?.stack || error) + "\n");
    return NextResponse.json({ error: "Something went wrong", message: error?.message || String(error) }, { status: 500 });
  }
}
