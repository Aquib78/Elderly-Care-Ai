import { useState, useRef, useEffect } from "react";
import { Upload, Volume2, VolumeX, FileText, Sparkles, RotateCcw, CheckCircle2, ScanLine, Brain, FileCheck } from "lucide-react";
import Layout from "@/components/Layout";

type Status = "idle" | "loading" | "done" | "error";

const STEPS = [
  { icon: ScanLine,  label: "Reading your report",       sub: "Extracting text from image..."     },
  { icon: FileText,  label: "Processing content",         sub: "Understanding medical terms..."    },
  { icon: Brain,     label: "AI analysis in progress",    sub: "Generating plain-language summary..." },
  { icon: FileCheck, label: "Finalising results",         sub: "Almost done..."                    },
];

export default function Reports() {
  const [status, setStatus]               = useState<Status>("idle");
  const [fileName, setFileName]           = useState("");
  const [text, setText]                   = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [speaking, setSpeaking]           = useState(false);
  const [dragOver, setDragOver]           = useState(false);
  const [stepIndex, setStepIndex]         = useState(0);
  const [stepDone, setStepDone]           = useState<boolean[]>([false, false, false, false]);
  const [progress, setProgress]           = useState(0);

  const inputRef    = useRef<HTMLInputElement>(null);
  const stepTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (stepTimer.current)    { clearInterval(stepTimer.current);   stepTimer.current = null; }
    if (progressRef.current)  { clearInterval(progressRef.current); progressRef.current = null; }
  };

  const startLoadingAnim = () => {
    setStepIndex(0);
    setStepDone([false, false, false, false]);
    setProgress(0);

    // Progress bar — fills to 92% over ~8s, jumps to 100 on done
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) { clearInterval(progressRef.current!); return 92; }
        return p + 1.2;
      });
    }, 100);

    // Step ticker — advance every 2.2s
    let current = 0;
    stepTimer.current = setInterval(() => {
      setStepDone((prev) => {
        const next = [...prev];
        next[current] = true;
        return next;
      });
      current += 1;
      if (current < STEPS.length) {
        setStepIndex(current);
      } else {
        clearInterval(stepTimer.current!);
      }
    }, 2200);
  };

  const finishLoading = () => {
    clearTimers();
    setStepDone([true, true, true, true]);
    setProgress(100);
  };

  useEffect(() => () => clearTimers(), []);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setStatus("loading");
    setText("");
    setSimplifiedText("");
    speechSynthesis.cancel();
    setSpeaking(false);
    startLoadingAnim();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-report/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      finishLoading();
      // Small delay so user sees 100% before results appear
      setTimeout(() => {
        setText(data.text);
        setSimplifiedText(data.simplified);
        setStatus("done");
      }, 600);
    } catch (err: any) {
      console.error(err);
      clearTimers();
      setStatus("error");
    }
  };

  const toggleSpeak = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const u = new SpeechSynthesisUtterance(simplifiedText);
      u.onend = () => setSpeaking(false);
      speechSynthesis.speak(u);
      setSpeaking(true);
    }
  };

  const reset = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
    clearTimers();
    setStatus("idle");
    setText("");
    setSimplifiedText("");
    setFileName("");
    setProgress(0);
    setStepIndex(0);
    setStepDone([false, false, false, false]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .fade-up   { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.22s both; }
        .step-in   { animation: stepIn 0.35s ease both; }
      `}</style>

      <div className="space-y-5 pb-6">

        {/* ── Title ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">Medical Reports</h1>
            <p className="text-base text-muted-foreground mt-1">Upload a report image for instant AI analysis</p>
          </div>
          {status === "done" && (
            <button onClick={reset} className="elder-btn-outline gap-2 text-base" style={{ minHeight: 44 }}>
              <RotateCcw className="w-4 h-4" /> New report
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
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              className="elder-card flex flex-col items-center gap-5 py-12 cursor-pointer transition-all duration-200"
              style={{
                border: dragOver ? "2px solid hsl(var(--primary))" : "2px dashed hsl(var(--primary) / 0.4)",
                background: dragOver ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card))",
              }}
            >
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 72, height: 72, background: "hsl(var(--primary) / 0.1)" }}>
                <Upload className="w-9 h-9" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div className="text-center">
                <p className="text-xl font-extrabold text-foreground">Tap to upload report image</p>
                <p className="text-base text-muted-foreground mt-1">Supports JPG, PNG, PDF images</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl font-bold text-base" style={{ padding: "12px 28px", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                <Upload className="w-5 h-5" /> Choose File
              </div>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {status === "error" && (
              <div className="flex items-center gap-3 rounded-2xl p-4 mt-4"
                style={{ background: "hsl(var(--emergency) / 0.08)", border: "1.5px solid hsl(var(--emergency) / 0.3)" }}>
                <span style={{ color: "hsl(var(--emergency))", fontWeight: 800, fontSize: 16 }}>
                  Could not connect to backend. Make sure the server is running.
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── PROCESSING UI ── */}
        {status === "loading" && (
          <div className="elder-card fade-up" style={{ padding: "32px 28px" }}>

            {/* File name pill */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2 rounded-2xl px-4 py-2"
                style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                <FileText className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{fileName}</span>
              </div>
            </div>

            {/* Animated scanner icon */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
                {/* Pulse rings */}
                {[0, 1].map((i) => (
                  <div key={i} className="absolute inset-0 rounded-full"
                    style={{
                      border: "2px solid hsl(var(--primary) / 0.3)",
                      animation: `pulse-ring 1.6s ease-out ${i * 0.5}s infinite`,
                    }} />
                ))}
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full" style={{
                  border: "3px solid transparent",
                  borderTopColor: "hsl(var(--primary))",
                  animation: "spin-slow 1s linear infinite",
                }} />
                {/* Center icon */}
                <div className="relative z-10 flex items-center justify-center rounded-2xl"
                  style={{ width: 60, height: 60, background: "hsl(var(--primary) / 0.1)" }}>
                  {(() => { const Icon = STEPS[stepIndex]?.icon ?? ScanLine; return <Icon className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />; })()}
                </div>
              </div>
            </div>

            {/* Current step label */}
            <div className="text-center mb-8 step-in" key={stepIndex}>
              <p className="text-xl font-extrabold text-foreground">{STEPS[stepIndex]?.label}</p>
              <p className="text-base text-muted-foreground mt-1">{STEPS[stepIndex]?.sub}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-muted-foreground">Progress</span>
                <span className="text-sm font-extrabold" style={{ color: "hsl(var(--primary))" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: "hsl(var(--border))" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, hsl(var(--primary)), hsl(168 55% 55%))`,
                    backgroundSize: "200% auto",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
              </div>
            </div>

            {/* Step checklist */}
            <div className="space-y-2">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = stepDone[i];
                const active = i === stepIndex && !done;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                    style={{
                      background: done
                        ? "hsl(var(--success) / 0.08)"
                        : active
                        ? "hsl(var(--primary) / 0.06)"
                        : "transparent",
                      opacity: i > stepIndex ? 0.35 : 1,
                    }}
                  >
                    {/* Status dot / icon */}
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: 32, height: 32,
                        background: done
                          ? "hsl(var(--success) / 0.15)"
                          : active
                          ? "hsl(var(--primary) / 0.12)"
                          : "hsl(var(--muted))",
                      }}
                    >
                      {done
                        ? <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--success))" }} />
                        : <Icon className="w-4 h-4" style={{ color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }} />
                      }
                    </div>

                    <span
                      className="text-base font-bold"
                      style={{
                        color: done
                          ? "hsl(var(--success))"
                          : active
                          ? "hsl(var(--foreground))"
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {step.label}
                    </span>

                    {done && (
                      <span className="ml-auto text-xs font-bold" style={{ color: "hsl(var(--success))" }}>Done</span>
                    )}
                    {active && (
                      <span className="ml-auto text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>In progress</span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ── Results ── */}
        {status === "done" && (
          <>
            <div className="flex items-center gap-4 rounded-2xl p-4 fade-up"
              style={{ background: "hsl(var(--success) / 0.08)", border: "1.5px solid hsl(var(--success) / 0.25)" }}>
              <CheckCircle2 className="w-7 h-7 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
              <div>
                <p className="font-extrabold text-lg" style={{ color: "hsl(var(--success))" }}>Report analysed successfully</p>
                <p className="text-base text-muted-foreground">{fileName}</p>
              </div>
            </div>

            {text && (
              <div className="elder-card fade-up-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 40, height: 40, background: "hsl(var(--info) / 0.12)" }}>
                    <FileText className="w-5 h-5" style={{ color: "hsl(var(--info))" }} />
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">Extracted Text</h2>
                </div>
                <div className="rounded-xl p-4 text-base leading-relaxed text-foreground whitespace-pre-wrap"
                  style={{ background: "hsl(var(--muted))", maxHeight: 220, overflowY: "auto" }}>
                  {text}
                </div>
              </div>
            )}

            {simplifiedText && (
              <div className="elder-card fade-up-3"
                style={{ border: "1.5px solid hsl(var(--success) / 0.3)", background: "hsl(var(--success) / 0.03)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: "hsl(var(--success) / 0.12)" }}>
                      <Sparkles className="w-5 h-5" style={{ color: "hsl(var(--success))" }} />
                    </div>
                    <h2 className="text-xl font-extrabold" style={{ color: "hsl(var(--success) / 0.9)" }}>
                      AI Medical Interpretation
                    </h2>
                  </div>
                  <button onClick={toggleSpeak}
                    className="flex items-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95"
                    style={{
                      padding: "10px 18px", minHeight: 44,
                      background: speaking ? "hsl(var(--warning) / 0.15)" : "hsl(var(--success) / 0.12)",
                      color: speaking ? "hsl(var(--warning-foreground))" : "hsl(var(--success))",
                      border: speaking ? "1.5px solid hsl(var(--warning) / 0.4)" : "1.5px solid hsl(var(--success) / 0.3)",
                    }}>
                    {speaking ? <><VolumeX className="w-5 h-5" /> Stop</> : <><Volume2 className="w-5 h-5" /> Listen</>}
                  </button>
                </div>
                <div className="space-y-3">
                  {simplifiedText.split("\n\n").filter(Boolean).map((section, i) => (
                    <div key={i} className="rounded-xl p-4 text-base leading-relaxed text-foreground"
                      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
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