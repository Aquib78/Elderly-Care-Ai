import { useState } from "react";
import {
  Pill, MapPin, Clock, ShoppingCart, Navigation, ExternalLink,
  ChevronDown, ChevronUp, Bell, BellOff, CheckCircle2, Phone, X
} from "lucide-react";
import Layout from "@/components/Layout";

const medicines = [
  {
    name: "Metformin 500mg",
    purpose: "Controls blood sugar levels",
    dosage: "1 tablet after breakfast & dinner",
    time: "8:00 AM, 8:00 PM",
    defaultTime: "08:00",
    sideEffects: "Nausea, stomach upset, diarrhoea (usually improves after a few weeks)",
    warnings: "Do not skip meals. Avoid alcohol while taking this medicine.",
    category: "Diabetes",
    color: { bg: "hsl(var(--success) / 0.1)", icon: "hsl(var(--success))", badge: "hsl(var(--success) / 0.15)", badgeText: "hsl(145 58% 28%)" },
  },
  {
    name: "Amlodipine 5mg",
    purpose: "Lowers blood pressure",
    dosage: "1 tablet in the morning",
    time: "8:00 AM",
    defaultTime: "08:00",
    sideEffects: "Swollen ankles, flushing, headache, dizziness",
    warnings: "Do not stop suddenly without consulting your doctor.",
    category: "Blood Pressure",
    color: { bg: "hsl(var(--info) / 0.1)", icon: "hsl(var(--info))", badge: "hsl(var(--info) / 0.15)", badgeText: "hsl(200 78% 30%)" },
  },
  {
    name: "Iron Supplement",
    purpose: "Increases iron & haemoglobin",
    dosage: "1 tablet after lunch",
    time: "1:00 PM",
    defaultTime: "13:00",
    sideEffects: "Dark stools, constipation, stomach cramps",
    warnings: "Take with vitamin C juice for better absorption. Avoid tea/coffee 1 hour before and after.",
    category: "Supplement",
    color: { bg: "hsl(var(--warning) / 0.12)", icon: "hsl(45 80% 35%)", badge: "hsl(var(--warning) / 0.18)", badgeText: "hsl(45 80% 25%)" },
  },
  {
    name: "Vitamin D3",
    purpose: "Strengthens bones & immunity",
    dosage: "1 capsule weekly",
    time: "Sunday morning",
    defaultTime: "09:00",
    sideEffects: "Rare — nausea or weakness if taken in excess",
    warnings: "Take with a fatty meal for best absorption.",
    category: "Supplement",
    color: { bg: "hsl(45 88% 52% / 0.12)", icon: "hsl(35 70% 35%)", badge: "hsl(45 88% 52% / 0.18)", badgeText: "hsl(35 70% 25%)" },
  },
];

const getMedicineLinks = (name: string) => {
  const q = encodeURIComponent(name);
  return [
    { name: "PharmEasy", url: `https://pharmeasy.in/search/all?name=${q}` },
    { name: "Tata 1mg",  url: `https://www.1mg.com/search/all?name=${q}` },
    { name: "Apollo",    url: `https://www.apollopharmacy.in/search-medicines/${q}` },
  ];
};

interface ReminderState {
  [medName: string]: { time: string; phone: string; saved: boolean; };
}

export default function Medicines() {
  const [pharmacies,   setPharmacies]   = useState<any[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [reminders,    setReminders]    = useState<ReminderState>({});
  const [reminderForm, setReminderForm] = useState<string | null>(null); // which med has form open

  const toggleExpand = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
    setReminderForm(null);
  };

  const openReminderForm = (e: React.MouseEvent, medName: string, defaultTime: string) => {
    e.stopPropagation();
    setReminderForm((prev) => (prev === medName ? null : medName));
    if (!reminders[medName]) {
      setReminders((prev) => ({ ...prev, [medName]: { time: defaultTime, phone: "", saved: false } }));
    }
  };

  const saveReminder = (medName: string) => {
    const r = reminders[medName];
    if (!r?.phone.trim()) return;

    // Save to localStorage alongside existing reminders
    const existing = JSON.parse(localStorage.getItem("reminders") || "[]");
    const newReminder = {
      id: Date.now(),
      medicine: medName,
      time: r.time,
      phone: r.phone.trim(),
      called: false,
    };
    localStorage.setItem("reminders", JSON.stringify([...existing, newReminder]));

    setReminders((prev) => ({ ...prev, [medName]: { ...r, saved: true } }));
    setReminderForm(null);
  };

  const removeReminder = (medName: string) => {
    const existing = JSON.parse(localStorage.getItem("reminders") || "[]");
    localStorage.setItem("reminders", JSON.stringify(existing.filter((r: any) => r.medicine !== medName)));
    setReminders((prev) => {
      const next = { ...prev };
      delete next[medName];
      return next;
    });
  };

  const findPharmacy = async () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setLoading(true);
    setShowPharmacy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const query = `[out:json];node["amenity"="pharmacy"](around:1500,${lat},${lon});out;`;
          const res  = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
          const data = await res.json();
          setPharmacies((data.elements || []).filter((p: any) => p.tags?.name || p.tags?.["addr:street"]));
        } catch { alert("Failed to fetch pharmacies"); }
        setLoading(false);
      },
      () => { alert("Location permission denied"); setLoading(false); }
    );
  };

  const fmt12 = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes waveBar {
          from { transform: scaleY(0.2); opacity: 0.4; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
        .fade-up    { animation: fadeUp    0.35s ease both; }
        .slide-down { animation: slideDown 0.25s ease both; }
        .rem-input {
          width: 100%;
          background: hsl(var(--card));
          border: 1.5px solid hsl(var(--border));
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 16px;
          font-family: inherit;
          font-weight: 600;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .rem-input:focus { border-color: hsl(var(--primary)); }
        .rem-input::placeholder { color: hsl(var(--muted-foreground)); font-weight: 500; }
      `}</style>

      <div className="space-y-5 pb-6">

        {/* ── Title ── */}
        <div className="fade-up">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">My Medicines</h1>
          <p className="text-base text-muted-foreground mt-0.5">
            {medicines.length} medicines · tap a card to view details & set reminders
          </p>
        </div>

        {/* ── Medicine cards ── */}
        <div className="space-y-3">
          {medicines.map((med, i) => {
            const open       = expanded === med.name;
            const remSaved   = reminders[med.name]?.saved;
            const formOpen   = reminderForm === med.name;
            const remData    = reminders[med.name];

            return (
              <div
                key={med.name}
                className="elder-card fade-up"
                style={{ animationDelay: `${i * 0.07}s`, padding: 0, overflow: "hidden" }}
              >
                {/* ── Main row (always visible) ── */}
                <button
                  onClick={() => toggleExpand(med.name)}
                  className="w-full flex items-center gap-4 text-left"
                  style={{ padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer", minHeight: "auto" }}
                >
                  {/* Pill icon */}
                  <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 52, height: 52, background: med.color.bg }}>
                    <Pill className="w-6 h-6" style={{ color: med.color.icon }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-lg font-extrabold text-foreground">{med.name}</p>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ background: med.color.badge, color: med.color.badgeText }}
                      >
                        {med.category}
                      </span>
                      {remSaved && (
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}>
                          ✓ Reminder set
                        </span>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground mt-0.5 truncate">{med.purpose}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                      <span className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{med.time}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0 rounded-xl flex items-center justify-center"
                    style={{ width: 34, height: 34, background: "hsl(var(--muted))", minHeight: "auto", minWidth: "auto" }}>
                    {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {/* ── Expanded section ── */}
                {open && (
                  <div style={{ borderTop: "1px solid hsl(var(--border))", background: "hsl(var(--muted) / 0.4)" }}>

                    {/* Dosage + side effects + warnings */}
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>

                      {/* Dosage */}
                      <div className="rounded-xl p-4 flex items-start gap-3"
                        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                        <span style={{ fontSize: 20 }}>📋</span>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Dosage</p>
                          <p className="text-base font-bold text-foreground">{med.dosage}</p>
                        </div>
                      </div>

                      {/* Side effects */}
                      <div className="rounded-xl p-4 flex items-start gap-3"
                        style={{ background: "hsl(var(--info) / 0.06)", border: "1px solid hsl(var(--info) / 0.2)" }}>
                        <span style={{ fontSize: 20 }}>ℹ️</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "hsl(var(--info))" }}>
                            Possible Side Effects
                          </p>
                          <p className="text-base text-foreground">{med.sideEffects}</p>
                        </div>
                      </div>

                      {/* Warnings */}
                      <div className="rounded-xl p-4 flex items-start gap-3"
                        style={{ background: "hsl(var(--warning) / 0.08)", border: "1px solid hsl(var(--warning) / 0.25)" }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "hsl(45 80% 30%)" }}>
                            Important
                          </p>
                          <p className="text-base text-foreground">{med.warnings}</p>
                        </div>
                      </div>

                      {/* Buy online */}
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Buy Online</p>
                        <div className="flex gap-2 flex-wrap">
                          {getMedicineLinks(med.name).map((site) => (
                            <a key={site.name} href={site.url} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 rounded-xl font-bold text-sm no-underline transition-all active:scale-95"
                              style={{
                                padding: "8px 14px",
                                background: "hsl(var(--primary) / 0.1)",
                                color: "hsl(var(--primary))",
                                border: "1px solid hsl(var(--primary) / 0.2)",
                                minHeight: "auto",
                              }}>
                              <ShoppingCart className="w-4 h-4" />
                              {site.name}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Reminder section ── */}
                    <div style={{ borderTop: "1px solid hsl(var(--border))", padding: "14px 20px 18px" }}>

                      {/* If reminder already saved */}
                      {remSaved ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl flex items-center justify-center"
                              style={{ width: 38, height: 38, background: "hsl(var(--success) / 0.12)", minHeight: "auto", minWidth: "auto" }}>
                              <CheckCircle2 className="w-5 h-5" style={{ color: "hsl(var(--success))" }} />
                            </div>
                            <div>
                              <p className="text-base font-extrabold" style={{ color: "hsl(var(--success))" }}>
                                Reminder active
                              </p>
                              <p className="text-sm text-muted-foreground font-semibold">
                                {fmt12(remData.time)} · {remData.phone}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeReminder(med.name)}
                            className="flex items-center gap-1.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                            style={{
                              padding: "8px 14px", minHeight: "auto", minWidth: "auto",
                              background: "hsl(var(--emergency) / 0.08)",
                              color: "hsl(var(--emergency))",
                              border: "1px solid hsl(var(--emergency) / 0.25)",
                            }}
                          >
                            <BellOff className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Set reminder button */}
                          {!formOpen && (
                            <button
                              onClick={(e) => openReminderForm(e, med.name, med.defaultTime)}
                              className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all active:scale-95"
                              style={{
                                minHeight: 48,
                                background: "hsl(var(--primary) / 0.08)",
                                color: "hsl(var(--primary))",
                                border: "1.5px dashed hsl(var(--primary) / 0.3)",
                              }}
                            >
                              <Bell className="w-5 h-5" />
                              Set Reminder for {med.name}
                            </button>
                          )}

                          {/* Reminder form */}
                          {formOpen && (
                            <div className="slide-down space-y-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-base font-extrabold text-foreground flex items-center gap-2">
                                  <Bell className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                                  Set Reminder
                                </p>
                                <button
                                  onClick={() => setReminderForm(null)}
                                  style={{ minHeight: "auto", minWidth: "auto", background: "none", border: "none", cursor: "pointer", padding: 4 }}
                                >
                                  <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                              </div>

                              {/* Time */}
                              <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                                  Reminder Time
                                </label>
                                <input
                                  type="time"
                                  className="rem-input"
                                  value={remData?.time || med.defaultTime}
                                  onChange={(e) => setReminders((prev) => ({
                                    ...prev,
                                    [med.name]: { ...prev[med.name], time: e.target.value }
                                  }))}
                                />
                              </div>

                              {/* Phone */}
                              <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                                  Phone Number
                                </label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <input
                                    type="tel"
                                    className="rem-input"
                                    style={{ paddingLeft: 36 }}
                                    placeholder="+91 99999 00000"
                                    value={remData?.phone || ""}
                                    onChange={(e) => setReminders((prev) => ({
                                      ...prev,
                                      [med.name]: { ...prev[med.name], phone: e.target.value }
                                    }))}
                                  />
                                </div>
                              </div>

                              {/* Save */}
                              <button
                                onClick={() => saveReminder(med.name)}
                                className="elder-btn-primary w-full gap-2"
                                style={{ fontSize: 16 }}
                              >
                                <Bell className="w-5 h-5" />
                                Save Reminder
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Find pharmacy ── */}
        <button onClick={findPharmacy} className="elder-btn-primary w-full text-lg gap-3 fade-up">
          <MapPin className="w-6 h-6" /> Find Nearby Pharmacy
        </button>

        {/* Loading */}
        {loading && (
          <div className="elder-card flex flex-col items-center gap-5 py-10 fade-up">
            <div className="flex items-end gap-1.5" style={{ height: 48 }}>
              {[0.5, 0.8, 1, 0.65, 0.9, 0.55, 1, 0.75].map((h, i) => (
                <div key={i} className="rounded-full"
                  style={{ width: 7, height: `${h * 100}%`, background: "hsl(var(--primary))", animation: `waveBar 0.7s ease-in-out ${i * 0.08}s infinite alternate` }} />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-foreground">Finding pharmacies near you...</p>
              <p className="text-base text-muted-foreground mt-1">Using your current location</p>
            </div>
          </div>
        )}

        {/* Pharmacy results */}
        {showPharmacy && !loading && pharmacies.length > 0 && (
          <div className="fade-up">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nearby Pharmacies</p>
              <span className="badge" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                {pharmacies.slice(0, 5).length} found
              </span>
            </div>
            <div className="space-y-3">
              {pharmacies.slice(0, 5).map((p, i) => (
                <div key={i} className="elder-card flex items-center gap-4">
                  <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 48, height: 48, background: "hsl(var(--info) / 0.1)" }}>
                    <MapPin className="w-5 h-5" style={{ color: "hsl(var(--info))" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-foreground truncate">{p.tags?.name || "Pharmacy"}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {p.tags?.["addr:street"]
                        ? `${p.tags["addr:street"]}${p.tags?.["addr:city"] ? `, ${p.tags["addr:city"]}` : ""}`
                        : `${p.lat?.toFixed(4)}, ${p.lon?.toFixed(4)}`}
                    </p>
                  </div>
                  <a href={`https://www.google.com/maps?q=${p.lat},${p.lon}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl font-bold text-sm no-underline flex-shrink-0 transition-all active:scale-95"
                    style={{ padding: "10px 14px", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", minHeight: "auto", minWidth: "auto" }}>
                    <Navigation className="w-4 h-4" /> Go
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPharmacy && !loading && pharmacies.length === 0 && (
          <div className="elder-card flex flex-col items-center gap-3 py-10 fade-up"
            style={{ border: "2px dashed hsl(var(--border))" }}>
            <MapPin className="w-10 h-10" style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-lg font-extrabold text-foreground">No pharmacies found nearby</p>
            <p className="text-base text-muted-foreground text-center">Try searching in a wider area</p>
          </div>
        )}

      </div>
    </Layout>
  );
}