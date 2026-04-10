import { useState } from "react";
import { Upload, FileText, Sparkles, Volume2 } from "lucide-react";
import Layout from "@/components/Layout";

export default function Reports() {
  const [uploaded, setUploaded] = useState(false);
  const [text, setText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 API CALL
  const simplifyReport = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/simplify-report/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setSimplifiedText(data.simplified);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">Medical Reports</h1>

        {/* Upload */}
        <div
          className="elder-card border-2 border-dashed border-primary/40 flex flex-col items-center gap-4 py-12 cursor-pointer hover:bg-primary/5 transition"
          onClick={() => {
            setUploaded(true);

            // TEMP TEXT (replace with OCR later)
            setText(`
              Hemoglobin: 11.2 g/dL (Low)
              WBC: 7500 (Normal)
              Platelets: 220000 (Normal)
              Blood Sugar: 145 mg/dL (High)
            `);
          }}
        >
          <Upload className="w-16 h-16 text-primary" />
          <p className="text-elder-lg font-semibold text-center">
            Tap here to upload your medical report
          </p>
          <p className="text-muted-foreground text-center">
            PDF, Image, or Photo
          </p>
        </div>

        {uploaded && (
          <>
            {/* 🧾 Extracted Text */}
            <div className="elder-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-elder-xl font-bold">Report Content</h2>
              </div>

              <div className="bg-muted rounded-xl p-4 whitespace-pre-wrap text-elder-base">
                {text}
              </div>

              <button
                onClick={simplifyReport}
                className="elder-btn bg-primary text-primary-foreground mt-4 flex items-center gap-3 w-full justify-center"
              >
                <Sparkles className="w-6 h-6" />
                {loading ? "Processing..." : "Simplify This Report"}
              </button>
            </div>

            {/* 🤖 AI OUTPUT */}
            {simplifiedText && (
              <div className="elder-card bg-success/10 border-success/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-elder-xl font-bold text-success">
                    ✅ Simple Explanation
                  </h2>

                  {/* 🔊 TTS Button */}
                  <button
                    onClick={() => {
                      const speech = new SpeechSynthesisUtterance(
                        simplifiedText
                      );
                      speechSynthesis.speak(speech);
                    }}
                    className="w-10 h-10 rounded-xl bg-info text-info-foreground flex items-center justify-center"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-card rounded-xl p-4 text-elder-base leading-relaxed whitespace-pre-wrap">
                  {simplifiedText}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}