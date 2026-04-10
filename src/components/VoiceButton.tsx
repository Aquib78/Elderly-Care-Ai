import { Mic, Volume2 } from "lucide-react";

interface Props {
  mode?: "listen" | "speak";
  label?: string;
  onClick?: () => void;
}

export default function VoiceButton({ mode = "listen", label, onClick }: Props) {
  const Icon = mode === "listen" ? Mic : Volume2;
  return (
    <button
      onClick={onClick}
      className="elder-btn bg-info text-info-foreground flex items-center gap-3"
      aria-label={label ?? (mode === "listen" ? "Voice input" : "Read aloud")}
    >
      <Icon className="w-6 h-6" />
      {label && <span>{label}</span>}
    </button>
  );
}
