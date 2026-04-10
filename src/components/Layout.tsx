import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Pill, Clock, User, Settings, MessageCircle } from "lucide-react";
import EmergencyButton from "./EmergencyButton";

const navItems = [
  { to: "/",          icon: Home,          label: "Home"      },
  { to: "/reports",   icon: FileText,      label: "Reports"   },
  { to: "/medicines", icon: Pill,          label: "Medicines" },
  { to: "/reminders", icon: Clock,         label: "Reminders" },
  { to: "/chat",      icon: MessageCircle, label: "Chat"      },
  { to: "/profile",   icon: User,          label: "Profile"   },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Header ── */}
      <header className="bg-card border-b border-border px-5 py-3 flex items-center justify-between sticky top-0 z-30 shadow-soft">

        <Link to="/" className="flex items-center gap-3 no-underline" style={{ minHeight: "auto" }}>
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-soft flex-shrink-0">
            <span className="text-primary-foreground font-extrabold text-lg leading-none">E</span>
          </div>
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            ElderCare AI
          </span>
        </Link>

        <div className="flex items-center gap-2">

          {/* Font size toggle */}
          <button
            className="bg-muted hover:bg-secondary rounded-xl font-extrabold text-base text-foreground transition-colors"
            style={{ minHeight: 44, minWidth: 44, padding: "0 14px" }}
            aria-label="Increase font size"
          >
            A+
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="rounded-xl bg-muted hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors no-underline"
            style={{ minHeight: 44, minWidth: 44 }}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Emergency — header size */}
          <EmergencyButton size="large" />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 py-6 pb-32 space-y-6 max-w-2xl w-full mx-auto">
        {children}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
        <div className="flex justify-around items-center py-2 max-w-2xl mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="no-underline flex flex-col items-center gap-1 rounded-xl transition-all duration-150"
                style={{
                  minHeight: 56,
                  minWidth: 56,
                  padding: "8px 10px",
                  color:      active ? "hsl(var(--primary))"          : "hsl(var(--muted-foreground))",
                  background: active ? "hsl(var(--primary) / 0.12)"   : "transparent",
                  transform:  active ? "scale(1.08)"                  : "scale(1)",
                }}
              >
                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.8} />
                <span
                  className="font-bold leading-none"
                  style={{ fontSize: 12 }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}