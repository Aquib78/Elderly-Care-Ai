import { useRef, useState } from "react";
import { Mic, Square, RotateCcw, Heart } from "lucide-react";

type Status = "idle" | "recording" | "uploading" | "success" | "error";

export default function HeartbeatAnalysis() {
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<any>(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // =========================
  // 🎤 START RECORDING (FIXED)
  // =========================
  const startRecording = async () => {
    try {
      console.log("🎤 Requesting microphone...");

      setAnalysis(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log("✅ Mic access granted");

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        console.log("🛑 Recording stopped");
        stream.getTracks().forEach((t) => t.stop());
        uploadRecording();
      };

      recorder.start();

      console.log("🔴 Recording started");

      setStatus("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

    } catch (err) {
      console.error("❌ Mic error:", err);
      alert("Microphone access denied. Please allow mic and reload.");
      setStatus("error");
    }
  };

  // =========================
  // ⛔ STOP RECORDING
  // =========================
  const stopRecording = () => {
    clearInterval(timerRef.current);
    setStatus("uploading");
    mediaRecorderRef.current?.stop();
  };

  // =========================
  // 📤 UPLOAD
  // =========================
  const uploadRecording = async () => {
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", blob, "heartbeat.webm");

      const res = await fetch("http://127.0.0.1:8000/upload-audio/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD:", data);

      fetchResult(data.audio_id);

    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // =========================
  // 🔁 FETCH RESULT
  // =========================
  const fetchResult = async (audioId: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/get-audio-result/${audioId}`
      );

      const data = await res.json();

      if (data.disease) {
        setAnalysis(data);
        setStatus("success");
      } else {
        setTimeout(() => fetchResult(audioId), 2000);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🧭 GAUGE
  // =========================
  const Gauge = ({ value }: { value: string }) => {
    const num = parseFloat(value);
    const angle = (num / 100) * 180;

    const color =
      num > 85 ? "#22c55e" :
      num > 60 ? "#f59e0b" :
      "#ef4444";

    return (
      <div className="flex flex-col items-center mt-6">
        <div className="relative w-56 h-28">

          <div className="absolute w-full h-full rounded-t-full bg-gray-200" />

          <div
            className="absolute w-full h-full rounded-t-full"
            style={{
              background: `conic-gradient(from 180deg, ${color} 0deg ${angle}deg, transparent ${angle}deg 180deg)`,
              mask: "radial-gradient(circle at center, transparent 55%, black 56%)",
              WebkitMask:
                "radial-gradient(circle at center, transparent 55%, black 56%)",
              transition: "1s ease",
            }}
          />

          <div
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              transform: `rotate(${angle - 90}deg)`,
              transition: "1s ease",
            }}
          >
            <div className="w-1 h-24" style={{ background: color }} />
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border rounded-full" />
        </div>

        <p className="text-xl font-bold mt-2" style={{ color }}>
          {value}
        </p>
      </div>
    );
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="elder-card space-y-6 text-center">

      {/* HEADER */}
      <div className="flex items-center justify-center gap-2">
        <Heart className="text-primary" />
        <h2 className="text-xl font-bold">Heartbeat AI Analysis</h2>
      </div>

      {/* IDLE */}
      {status === "idle" && (
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={startRecording}
            className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-105 transition"
          >
            <Mic size={36} />
          </button>
          <p className="text-muted-foreground">
            Tap to record your heartbeat
          </p>
        </div>
      )}

      {/* RECORDING */}
      {status === "recording" && (
        <div className="flex flex-col items-center gap-6">

          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white animate-pulse">
            <Mic />
          </div>

          <p className="text-3xl font-bold">{seconds}s</p>

          <button onClick={stopRecording} className="elder-btn-danger w-full">
            <Square /> Stop
          </button>
        </div>
      )}

      {/* LOADING */}
      {status === "uploading" && (
        <p className="animate-pulse">Analyzing heartbeat...</p>
      )}

      {/* RESULT */}
      {status === "success" && analysis && (
        <div className="space-y-4">

          <div className="bg-primary/10 p-4 rounded-xl">
            <p className="font-bold text-lg">Diagnosis</p>
            <p className="text-2xl font-extrabold">
              {analysis.disease}
            </p>
          </div>

          <Gauge value={analysis.accuracy} />

          <button
            onClick={() => setStatus("idle")}
            className="elder-btn-outline w-full"
          >
            <RotateCcw /> Record Again
          </button>
        </div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div className="text-red-500">
          Error accessing microphone
        </div>
      )}
    </div>
  );
}