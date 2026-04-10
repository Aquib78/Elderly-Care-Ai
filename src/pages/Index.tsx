import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Pill, Clock, Mic, Bell, MessageCircle } from "lucide-react";
import EmergencyButton from "@/components/EmergencyButton";
import Layout from "@/components/Layout";

const quickActions = [
  {
    to: "/reports",
    icon: FileText,
    label: "Upload Report",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    to: "/medicines",
    icon: Pill,
    label: "My Medicines",
    bg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    to: "/reminders",
    icon: Clock,
    label: "Reminders",
    bg: "bg-info/10",
    iconColor: "text-info",
  },
];

export default function Index() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning! 👋"
      : hour < 17
      ? "Good Afternoon! 👋"
      : "Good Evening! 👋";

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessages = [...messages, { type: "user", text: message }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { type: "bot", text: data.reply },
      ]);

    } catch (err) {
      setMessages([
        ...newMessages,
        { type: "bot", text: "❌ Error connecting to AI" },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-6">

        {/* ── Welcome ── */}
        <div
          className="elder-card border-primary/20"
          style={{
            background:
              "linear-gradient(135deg, hsl(168 55% 95%) 0%, hsl(180 20% 97%) 100%)",
          }}
        >
          <h1 className="text-3xl font-extrabold">{greeting}</h1>
          <p className="text-lg text-muted-foreground mt-2">
            How are you feeling today? Let me help you with your health.
          </p>

          <button className="elder-btn-primary mt-5 flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Talk to me
          </button>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ to, icon: Icon, label, bg, iconColor }) => (
            <Link
              key={to}
              to={to}
              className="elder-card flex flex-col items-center gap-4 py-10"
            >
              <div className={`${bg} rounded-2xl p-4`}>
                <Icon className={`w-10 h-10 ${iconColor}`} />
              </div>
              <span className="text-xl font-bold text-center">{label}</span>
            </Link>
          ))}
        </div>

        {/* ── Upcoming ── */}
        <div className="elder-card">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-6 h-6 text-warning" />
            <h2 className="text-2xl font-bold">Upcoming</h2>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground">
              No upcoming reminders yet.
            </p>
          </div>
        </div>

        {/* ── Emergency ── */}
        <EmergencyButton />

      </div>

      {/* 💬 Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* 💬 Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col">

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.type === "user"
                    ? "bg-primary text-white text-right"
                    : "bg-muted text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <p className="text-sm text-muted-foreground">Typing...</p>
            )}
          </div>

          <div className="p-2 border-t flex">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-primary text-white px-3 rounded"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </Layout>
  );
}