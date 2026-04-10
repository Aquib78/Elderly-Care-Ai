import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Pill, Clock, User, Settings } from "lucide-react";
import EmergencyButton from "./EmergencyButton";
import ChatbotWidget from "./ChatbotWidget";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/medicines", icon: Pill, label: "Medicines" },
  { to: "/reminders", icon: Clock, label: "Reminders" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-elder-lg">E</span>
          </div>
          <span className="text-elder-xl font-bold text-foreground">ElderCare AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <EmergencyButton size="small" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6 pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 safe-area-bottom">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
