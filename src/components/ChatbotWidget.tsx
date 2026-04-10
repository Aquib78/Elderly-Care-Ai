import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Mic } from "lucide-react";

const quickReplies = [
  "How do I upload a report?",
  "What medicines should I take?",
  "Set a reminder for me",
  "Call my doctor",
];

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! 👋 I'm your ElderCare assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const emergencyWords = ["chest pain", "can't breathe", "help me", "emergency", "heart attack", "stroke"];
    if (emergencyWords.some(word => text.toLowerCase().includes(word))) {
      setMessages(prev => [
        ...prev,
        { role: "user", text },
        { role: "bot", text: "🚨 This sounds serious. Please call emergency services or your doctor immediately!" }
      ]);
      setInput("");
      return;
    }

    setMessages(prev => [...prev, { role: "user" as const, text }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error("API key not found. Check your .env file.");
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "ElderCare AI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful healthcare assistant for elderly people. Use simple, warm, clear language. Be concise. If someone describes a medical emergency, urge immediate help.",
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || `API error ${res.status}`);
      }

      const reply = data.choices?.[0]?.message?.content || "⚠️ No response from AI";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);

    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: `❌ Error: ${error.message || "Could not connect to AI"}` },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-soft-lg flex items-center justify-center"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-[340px] max-h-[480px] bg-card rounded-2xl shadow-soft-lg border flex flex-col overflow-hidden">

          <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center">
            <span className="font-bold">Care Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === "bot"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-white ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-muted-foreground animate-pulse">
                Bot is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs bg-secondary px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="border-t p-3 flex gap-2">
            <button className="w-10 h-10 bg-muted flex items-center justify-center rounded-xl">
              <Mic className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask me anything..."
              className="flex-1 bg-muted rounded-xl px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={loading}
              className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}