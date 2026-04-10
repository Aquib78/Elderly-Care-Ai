import { useState } from "react";
import { Sun, Moon, Type } from "lucide-react";
import Layout from "@/components/Layout";

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">("normal");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const changeFontSize = (size: typeof fontSize) => {
    setFontSize(size);
    const root = document.documentElement;
    root.style.fontSize = size === "normal" ? "18px" : size === "large" ? "22px" : "26px";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">Accessibility Settings</h1>

        {/* Dark mode */}
        <div className="elder-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-6 h-6 text-info" /> : <Sun className="w-6 h-6 text-warning" />}
              <div>
                <p className="text-elder-lg font-bold">Dark Mode</p>
                <p className="text-muted-foreground">Easier on the eyes at night</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`w-16 h-9 rounded-full transition-colors flex items-center px-1 ${
                darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-card shadow transition-transform ${
                  darkMode ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Font size */}
        <div className="elder-card">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-6 h-6 text-primary" />
            <div>
              <p className="text-elder-lg font-bold">Text Size</p>
              <p className="text-muted-foreground">Choose a comfortable reading size</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["normal", "large", "extra-large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => changeFontSize(size)}
                className={`rounded-xl py-4 font-semibold transition-colors ${
                  fontSize === size
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
