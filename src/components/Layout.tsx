import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Pill, Clock, User, Settings } from "lucide-react";
import EmergencyButton from "./EmergencyButton";
import ChatbotWidget from "./ChatbotWidget";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/medicines", icon: Pill, label: "Medicines" },
  { to: "/reminders", icon: Clock, label: "Reminders" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* 🔝 HEADER (RESTORED) */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="text-xl font-bold">ElderCare AI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <EmergencyButton />
        </div>
      </header>

      {/* 🔽 MAIN CONTENT */}
      <main className="flex-1 p-4 pb-24">
        {children}
      </main>

      {/* 🔻 BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
        <div className="flex justify-around py-2">

          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center text-sm ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            );
          })}

        </div>
      </nav>

      {/* 💬 CHATBOT (RESTORED) */}
      <ChatbotWidget />

    </div>
  );
}