import { useEffect, useState } from "react";
import { Clock, Plus, Bell, Trash2, Phone, X, CheckCircle2, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";

interface Reminder {
  id: number;
  medicine: string;
  time: string;
  phone: string;
  called?: boolean;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("reminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const saveToStorage = (data: Reminder[]) => {
    localStorage.setItem("reminders", JSON.stringify(data));
  };

  const addReminder = () => {
    if (!newMedicine.trim() || !phone.trim()) {
      setError("Please fill in both medicine name and phone number.");
      return;
    }
    setError("");
    const updated = [...reminders, {
      id: Date.now(),
      medicine: newMedicine.trim(),
      time: newTime,
      phone: phone.trim(),
      called: false,
    }];
    setReminders(updated);
    saveToStorage(updated);
    setNewMedicine("");
    setPhone("");
    setNewTime("08:00");
    setShowForm(false);
  };

  const deleteReminder = (id: number) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveToStorage(updated);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0");

      reminders.forEach(async (r) => {
        if (r.time === currentTime && !r.called) {
          try {
            await fetch("http://localhost:5000/call-reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: r.phone, medicine: r.medicine }),
            });
            const updated = reminders.map((item) =>
              item.id === r.id ? { ...item, called: true } : item
            );
            setReminders(updated);
            saveToStorage(updated);
          } catch (err) {
            console.error("Call failed:", err);
          }
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [reminders]);

  const pending = reminders.filter((r) => !r.called);
  const called  = reminders.filter((r) => r.called);

  const fmt12 = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    const ampm = hh >= 12 ? "PM" : "AM";
    const h = hh % 12 || 12;
    return `${h}:${mm.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up    { animation: fadeUp   0.35s ease both; }
        .slide-down { animation: slideDown 0.3s ease both; }

        .reminder-input {
          width: 100%;
          background: hsl(var(--muted));
          border: 1.5px solid hsl(var(--border));
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 17px;
          font-family: inherit;
          font-weight: 600;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .reminder-input:focus {
          border-color: hsl(var(--primary));
          background: hsl(var(--card));
        }
        .reminder-input::placeholder {
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }
      `}</style>

      <div className="space-y-5 pb-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">Reminders</h1>
            <p className="text-base text-muted-foreground mt-0.5">
              {reminders.length === 0
                ? "No reminders yet"
                : `${pending.length} pending · ${called.length} completed`}
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            className="flex items-center gap-2 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{
              minHeight: 48,
              padding: "0 20px",
              background: showForm ? "hsl(var(--muted))" : "hsl(var(--primary))",
              color: showForm ? "hsl(var(--foreground))" : "hsl(var(--primary-foreground))",
            }}
          >
            {showForm
              ? <><X className="w-5 h-5" /> Cancel</>
              : <><Plus className="w-5 h-5" /> Add</>
            }
          </button>
        </div>

        {/* ── Add form ── */}
        {showForm && (
          <div className="elder-card slide-down space-y-4"
            style={{ border: "1.5px solid hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.03)" }}>

            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: 40, height: 40, background: "hsl(var(--primary) / 0.12)" }}>
                <Bell className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">New Reminder</h3>
            </div>

            {/* Medicine */}
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Medicine Name
              </label>
              <input
                className="reminder-input"
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
                placeholder="e.g. Lisinopril 10mg"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Reminder Time
              </label>
              <input
                type="time"
                className="reminder-input"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                className="reminder-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 00000"
                type="tel"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "hsl(var(--emergency) / 0.08)", border: "1px solid hsl(var(--emergency) / 0.3)" }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "hsl(var(--emergency))" }} />
                <span className="text-base font-semibold" style={{ color: "hsl(var(--emergency))" }}>{error}</span>
              </div>
            )}

            <button onClick={addReminder} className="elder-btn-primary w-full text-lg gap-2">
              <Bell className="w-5 h-5" />
              Save Reminder
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {reminders.length === 0 && !showForm && (
          <div className="elder-card flex flex-col items-center gap-5 py-14 fade-up"
            style={{ border: "2px dashed hsl(var(--border))" }}>
            <div className="rounded-2xl flex items-center justify-center"
              style={{ width: 72, height: 72, background: "hsl(var(--primary) / 0.1)" }}>
              <Bell className="w-9 h-9" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-foreground">No reminders yet</p>
              <p className="text-base text-muted-foreground mt-1">
                Tap "Add" to set your first medicine reminder
              </p>
            </div>
            <button onClick={() => setShowForm(true)} className="elder-btn-primary gap-2">
              <Plus className="w-5 h-5" /> Add Reminder
            </button>
          </div>
        )}

        {/* ── Pending reminders ── */}
        {pending.length > 0 && (
          <div className="fade-up">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upcoming
            </p>
            <div className="space-y-3">
              {pending.map((r, i) => (
                <div
                  key={r.id}
                  className="elder-card flex items-center gap-4"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Icon */}
                  <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 52, height: 52, background: "hsl(var(--primary) / 0.1)" }}>
                    <Bell className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-foreground truncate">{r.medicine}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                        <span className="text-base font-bold" style={{ color: "hsl(var(--primary))" }}>
                          {fmt12(r.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-semibold">{r.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status + delete */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="badge badge-warning">Pending</span>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="flex items-center justify-center rounded-xl transition-all active:scale-95"
                      style={{
                        width: 36, height: 36,
                        background: "hsl(var(--emergency) / 0.08)",
                        color: "hsl(var(--emergency))",
                        minHeight: "auto", minWidth: "auto",
                      }}
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Completed reminders ── */}
        {called.length > 0 && (
          <div className="fade-up">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Completed
            </p>
            <div className="space-y-3">
              {called.map((r) => (
                <div
                  key={r.id}
                  className="elder-card flex items-center gap-4"
                  style={{ opacity: 0.7 }}
                >
                  <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 52, height: 52, background: "hsl(var(--success) / 0.1)" }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: "hsl(var(--success))" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-foreground truncate">{r.medicine}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-base text-muted-foreground font-semibold">{fmt12(r.time)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="badge badge-success">Called</span>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="flex items-center justify-center rounded-xl transition-all active:scale-95"
                      style={{
                        width: 36, height: 36,
                        background: "hsl(var(--muted))",
                        color: "hsl(var(--muted-foreground))",
                        minHeight: "auto", minWidth: "auto",
                      }}
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}