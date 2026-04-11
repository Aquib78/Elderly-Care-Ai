import { useState } from "react";
import { Upload, Volume2 } from "lucide-react";
import Layout from "@/components/Layout";

export default function Reports() {
  const [text, setText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    console.log("📂 Selected:", file.name);

    setLoading(true);
    setText("");
    setSimplifiedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-report/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🔥 RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Upload failed");
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
  <div className="elder-card border border-green-300 bg-green-50 p-5 space-y-4">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <h2 className="font-bold text-green-700 text-lg">
        🧠 AI Medical Interpretation
      </h2>

      <button
        onClick={() => {
          const speech = new SpeechSynthesisUtterance(simplifiedText);
          speechSynthesis.speak(speech);
        }}
        className="p-2 rounded-lg hover:bg-green-200"
      >
        <Volume2 />
      </button>
    </div>

    {/* CONTENT */}
    <div className="space-y-4 text-sm leading-relaxed text-gray-800">

      {simplifiedText.split("\n\n").map((section, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border">
          {section}
        </div>
      ))}

    </div>

  </div>
)}
      </div>
    </Layout>
  );
}