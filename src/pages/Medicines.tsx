import { useState } from "react";
import { Upload, Volume2 } from "lucide-react";
import Layout from "@/components/Layout";

// ✅ API BASE (DEPLOY SAFE)
const API_BASE = import.meta.env.VITE_API_URL || null;

export default function Reports() {
  const [text, setText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    console.log("📂 Selected:", file.name);

    setLoading(true);
    setText("");
    setSimplifiedText("");

    // =========================
    // 🔥 DEMO MODE (NO BACKEND)
    // =========================
    if (!API_BASE) {
      const fakeText = `
Hemoglobin: 10.5 g/dL (Low)
Glucose: 145 mg/dL (High)
RBC Count: Normal
`;

      const fakeSimplified = `
Summary:
The report indicates mild abnormalities.

Key Findings:
- Hemoglobin is slightly low
- Glucose levels are elevated

Explanation:
Low hemoglobin may indicate mild anemia.
Elevated glucose levels may suggest a risk of blood sugar imbalance.

Conclusion:
Further medical consultation is recommended for accurate diagnosis.
`;

      setTimeout(() => {
        setText(fakeText);
        setSimplifiedText(fakeSimplified);
        setLoading(false);
      }, 1500);

      return;
    }

    // =========================
    // ✅ REAL BACKEND MODE
    // =========================
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/analyze-report/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🔥 RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Upload failed");
        setLoading(false);
        return;
      }

      setText(data.text);
      setSimplifiedText(data.simplified);

    } catch (err) {
      console.error(err);
      alert("❌ Cannot connect to backend");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">Medical Reports</h1>

        {/* Upload */}
        <label className="elder-card border-2 border-dashed border-primary/40 flex flex-col items-center gap-4 py-12 cursor-pointer hover:bg-primary/5 transition">
          <Upload className="w-16 h-16 text-primary" />

          <p className="text-elder-lg font-semibold text-center">
            Click to upload report image
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </label>

        {/* Loading */}
        {loading && (
          <p className="text-center">🔄 Processing report...</p>
        )}

        {/* Extracted Text */}
        {text && (
          <div className="elder-card">
            <h2 className="font-bold mb-2">📄 Extracted Text</h2>
            <div className="bg-muted p-4 whitespace-pre-wrap">
              {text}
            </div>
          </div>
        )}

        {/* AI Output */}
        {simplifiedText && (
          <div className="elder-card bg-green-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-green-700">
                🤖 Simple Explanation
              </h2>

              <button
                onClick={() => {
                  const speech = new SpeechSynthesisUtterance(
                    simplifiedText
                  );
                  speechSynthesis.speak(speech);
                }}
              >
                <Volume2 />
              </button>
            </div>

            <div className="whitespace-pre-wrap">
              {simplifiedText}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}