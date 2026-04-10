import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Pill, Clock, User, Settings, MessageCircle } from "lucide-react";
import EmergencyButton from "./EmergencyButton";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/medicines", icon: Pill, label: "Medicines" },
  { to: "/reminders", icon: Clock, label: "Reminders" },
  { to: "/chat", icon: MessageCircle, label: "Chat" }, // ✅ NEW
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col text-lg">

      {/* 🔷 HEADER */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between sticky top-0 z-30">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>

          <span className="text-2xl font-bold text-foreground tracking-wide">
            ElderCare AI
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Accessibility */}
          <button className="bg-muted px-3 py-1 rounded-lg text-sm font-semibold">
            A+
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-6 h-6" />
          </Link>

          {/* 🚨 Emergency (NO ANIMATION) */}
          <EmergencyButton size="large" />

        </div>
      </header>

      {/* 🔽 MAIN */}
      <main className="flex-1 container py-6 pb-28 px-4 space-y-6">
        {children}
      </main>

      {/* 🔻 BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 safe-area-bottom">
        <div className="flex justify-around items-center py-3 max-w-lg mx-auto">

          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${
                  active
                    ? "text-primary bg-primary/20 scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-7 h-7" />
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            );
          })}

        </div>
      </nav>

    </div>
  );
}