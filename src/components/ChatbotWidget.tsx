import { useState } from "react";
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

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "bot", text: "Thank you for your question! This feature will be connected to an AI assistant soon. 🤖" },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-soft-lg flex items-center justify-center animate-float"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-[340px] max-h-[480px] bg-card rounded-2xl shadow-soft-lg border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <span className="font-bold text-elder-base">Care Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-elder-sm ${
                  m.role === "bot"
                    ? "bg-muted text-foreground self-start"
                    : "bg-primary text-primary-foreground ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" aria-label="Voice input">
              <Mic className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask me anything..."
              className="flex-1 bg-muted rounded-xl px-4 py-2 text-elder-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button
              onClick={() => send(input)}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
