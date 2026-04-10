import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Pill, Clock, User, Settings, Heart } from "lucide-react";
import EmergencyButton from "./EmergencyButton";
import ChatbotWidget from "./ChatbotWidget";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/",          icon: Home,     label: "Home"      },
  { to: "/reports",   icon: FileText, label: "Reports"   },
  { to: "/medicines", icon: Pill,     label: "Medicines" },
  { to: "/reminders", icon: Clock,    label: "Reminders" },
  { to: "/heartbeat", icon: Heart,    label: "Heartbeat" },
  { to: "/profile",   icon: User,     label: "Profile"   },
];

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Header ── */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          style={{ minHeight: "auto" }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold text-foreground">ElderCare AI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors no-underline"
            style={{ minHeight: "auto", minWidth: "auto" }}
          >
            <Settings className="w-5 h-5" />
          </Link>
          <EmergencyButton size="header" />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 p-4 pb-24">
        {children}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            const isHeart = to === "/heartbeat";
            return (
              <Link
                key={to}
                to={to}
                className="no-underline flex flex-col items-center gap-0.5"
                style={{
                  minHeight: 52,
                  minWidth: 48,
                  padding: "6px 8px",
                  borderRadius: 12,
                  color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: active ? "hsl(var(--primary) / 0.10)" : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                    strokeWidth: active ? 2.5 : 1.8,
                    fill: active && isHeart ? "hsl(var(--primary))" : "none",
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Chatbot ── */}
      <ChatbotWidget />

    </div>
  );
}