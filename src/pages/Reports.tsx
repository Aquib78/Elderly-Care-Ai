import { useState, useRef } from "react";
import { Upload, Volume2, VolumeX, FileText, Sparkles, RotateCcw, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";

type Status = "idle" | "loading" | "done" | "error";

export default function Reports() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setStatus("loading");
    setText("");
    setSimplifiedText("");
    speechSynthesis.cancel();
    setSpeaking(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-report/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setText(data.text);
      setSimplifiedText(data.simplified);
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
    }
  };

  const toggleSpeak = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(simplifiedText);
      utterance.onend = () => setSpeaking(false);
      speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  const reset = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
    setStatus("idle");
    setText("");
    setSimplifiedText("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes waveBar {
          from { transform: scaleY(0.2); opacity: 0.4; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.1s both; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.2s both; }
      `}</style>

      <div className="space-y-5 pb-6">

        {/* ── Page title ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">
              Medical Reports
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Upload a report image for instant AI analysis
            </p>
          </div>
          {status === "done" && (
            <button onClick={reset} className="elder-btn-outline gap-2 text-base" style={{ minHeight: 44 }}>
              <RotateCcw className="w-4 h-4" />
              New report
            </button>
          )}
        </div>

        {/* ── Upload zone ── */}
        {(status === "idle" || status === "error") && (
          <div className="fade-up">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className="elder-card flex flex-col items-center gap-5 py-12 cursor-pointer transition-all duration-200"
              style={{
                border: dragOver
                  ? "2px solid hsl(var(--primary))"
                  : "2px dashed hsl(var(--primary) / 0.4)",
                background: dragOver
                  ? "hsl(var(--primary) / 0.05)"
                  : "hsl(var(--card))",
              }}
            >
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{
                  width: 72, height: 72,
                  background: "hsl(var(--primary) / 0.1)",
                }}
              >
                <Upload className="w-9 h-9" style={{ color: "hsl(var(--primary))" }} />
              </div>

              <div className="text-center">
                <p className="text-xl font-extrabold text-foreground">
                  Tap to upload report image
                </p>
                <p className="text-base text-muted-foreground mt-1">
                  Supports JPG, PNG, PDF images
                </p>
              </div>

              <div
                className="flex items-center gap-2 rounded-xl font-bold text-base"
                style={{
                  padding: "12px 28px",
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                <Upload className="w-5 h-5" />
                Choose File
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {status === "error" && (
              <div
                className="flex items-center gap-3 rounded-2xl p-4 mt-4"
                style={{
                  background: "hsl(var(--emergency) / 0.08)",
                  border: "1.5px solid hsl(var(--emergency) / 0.3)",
                }}
              >
                <span style={{ color: "hsl(var(--emergency))", fontWeight: 800, fontSize: 16 }}>
                  ✕ Could not connect to backend. Make sure the server is running.
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Loading ── */}
        {status === "loading" && (
          <div className="elder-card flex flex-col items-center gap-6 py-12 fade-up">
            <div className="flex items-end gap-1.5" style={{ height: 52 }}>
              {[0.5, 0.8, 1, 0.65, 0.9, 0.55, 1, 0.75, 0.5, 0.85].map((h, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 7,
                    height: `${h * 100}%`,
                    background: "hsl(var(--primary))",
                    animation: `waveBar 0.7s ease-in-out ${i * 0.07}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-foreground">Analysing your report...</p>
              <p className="text-base text-muted-foreground mt-1">
                Reading <span className="font-bold text-foreground">{fileName}</span>
              </p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {status === "done" && (
          <>
            {/* Success banner */}
            <div
              className="flex items-center gap-4 rounded-2xl p-4 fade-up"
              style={{
                background: "hsl(var(--success) / 0.08)",
                border: "1.5px solid hsl(var(--success) / 0.25)",
              }}
            >
              <CheckCircle2 className="w-7 h-7 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
              <div>
                <p className="font-extrabold text-lg" style={{ color: "hsl(var(--success))" }}>
                  Report analysed successfully
                </p>
                <p className="text-base text-muted-foreground">{fileName}</p>
              </div>
            </div>

            {/* Extracted text */}
            {text && (
              <div className="elder-card fade-up-2">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 40, height: 40, background: "hsl(var(--info) / 0.12)" }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "hsl(var(--info))" }} />
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">Extracted Text</h2>
                </div>
                <div
                  className="rounded-xl p-4 text-base leading-relaxed text-foreground whitespace-pre-wrap"
                  style={{ background: "hsl(var(--muted))", maxHeight: 220, overflowY: "auto" }}
                >
                  {text}
                </div>
              </div>
            )}

            {/* AI interpretation */}
            {simplifiedText && (
              <div
                className="elder-card fade-up-3"
                style={{
                  border: "1.5px solid hsl(var(--success) / 0.3)",
                  background: "hsl(var(--success) / 0.03)",
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: "hsl(var(--success) / 0.12)" }}
                    >
                      <Sparkles className="w-5 h-5" style={{ color: "hsl(var(--success))" }} />
                    </div>
                    <h2 className="text-xl font-extrabold" style={{ color: "hsl(var(--success) / 0.9)" }}>
                      AI Medical Interpretation
                    </h2>
                  </div>

                  {/* Listen button */}
                  <button
                    onClick={toggleSpeak}
                    className="flex items-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95"
                    style={{
                      padding: "10px 18px",
                      minHeight: 44,
                      background: speaking
                        ? "hsl(var(--warning) / 0.15)"
                        : "hsl(var(--success) / 0.12)",
                      color: speaking
                        ? "hsl(var(--warning-foreground))"
                        : "hsl(var(--success))",
                      border: speaking
                        ? "1.5px solid hsl(var(--warning) / 0.4)"
                        : "1.5px solid hsl(var(--success) / 0.3)",
                    }}
                  >
                    {speaking
                      ? <><VolumeX className="w-5 h-5" /> Stop</>
                      : <><Volume2 className="w-5 h-5" /> Listen</>
                    }
                  </button>
                </div>

                {/* Sections */}
                <div className="space-y-3">
                  {simplifiedText.split("\n\n").filter(Boolean).map((section, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 text-base leading-relaxed text-foreground"
                      style={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    >
                      {section}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </Layout>
  );
}