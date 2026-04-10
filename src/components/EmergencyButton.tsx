import { Phone } from "lucide-react";
import { useState } from "react";

interface Props {
  size?: "small" | "header" | "large";
}

export default function EmergencyButton({ size = "large" }: Props) {
  const [triggered, setTriggered] = useState(false);

  const handleEmergency = () => {
    setTriggered(true);
    setTimeout(() => setTriggered(false), 3000);
  };

  /* ── Small icon-only (for tight spaces) ── */
  if (size === "small") {
    return (
      <button
        onClick={handleEmergency}
        aria-label="Emergency"
        className="rounded-xl flex items-center justify-center transition-all active:scale-95"
        style={{
          minHeight: 44,
          minWidth: 44,
          background: "hsl(var(--emergency))",
          color: "hsl(var(--emergency-foreground))",
        }}
      >
        <Phone className="w-5 h-5" />
      </button>
    );
  }

  /* ── Header size (pill with label) ── */
  if (size === "header") {
    return (
      <button
        onClick={handleEmergency}
        aria-label="Emergency – Call for Help"
        className="flex items-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95 hover:brightness-105"
        style={{
          minHeight: 44,
          padding: "0 18px",
          background: "hsl(var(--emergency))",
          color: "hsl(var(--emergency-foreground))",
        }}
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline">
          {triggered ? "🚨 Alert Sent!" : "Emergency – Call for Help"}
        </span>
        <span className="sm:hidden">
          {triggered ? "🚨" : "SOS"}
        </span>
      </button>
    );
  }

  /* ── Large full-width (for bottom of page) ── */
  return (
    <button
      onClick={handleEmergency}
      aria-label="Emergency – Call for Help"
      className="elder-btn-danger w-full text-xl gap-3"
    >
      <Phone className="w-7 h-7" />
      {triggered ? "🚨 Alert Sent!" : "Emergency – Call for Help"}
    </button>
  );
}