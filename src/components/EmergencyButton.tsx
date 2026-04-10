import { Phone } from "lucide-react";
import { useState } from "react";

interface Props {
  size?: "small" | "large";
}

export default function EmergencyButton({ size = "large" }: Props) {
  const [triggered, setTriggered] = useState(false);

  const handleEmergency = () => {
    setTriggered(true);
    // Placeholder: would send alerts to saved contacts
    setTimeout(() => setTriggered(false), 3000);
  };

  if (size === "small") {
    return (
      <button
        onClick={handleEmergency}
        className="w-10 h-10 rounded-xl bg-emergency text-emergency-foreground flex items-center justify-center shadow-emergency animate-pulse-emergency"
        aria-label="Emergency"
      >
        <Phone className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleEmergency}
      className="w-full elder-btn bg-emergency text-emergency-foreground shadow-emergency animate-pulse-emergency flex items-center justify-center gap-3 text-elder-xl"
    >
      <Phone className="w-7 h-7" />
      {triggered ? "🚨 Alert Sent!" : "Emergency – Call for Help"}
    </button>
  );
}
