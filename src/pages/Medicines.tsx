import { useState } from "react";
import { Pill, MapPin, Clock, ShoppingCart, Navigation, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/Layout";

const medicines = [
  {
    name: "Metformin 500mg",
    purpose: "Controls blood sugar levels",
    dosage: "1 tablet after breakfast & dinner",
    time: "8:00 AM, 8:00 PM",
    color: { bg: "hsl(var(--success) / 0.1)", icon: "hsl(var(--success))" },
  },
  {
    name: "Amlodipine 5mg",
    purpose: "Lowers blood pressure",
    dosage: "1 tablet in the morning",
    time: "8:00 AM",
    color: { bg: "hsl(var(--info) / 0.1)", icon: "hsl(var(--info))" },
  },
  {
    name: "Iron Supplement",
    purpose: "Increases iron & haemoglobin",
    dosage: "1 tablet after lunch",
    time: "1:00 PM",
    color: { bg: "hsl(var(--warning) / 0.1)", icon: "hsl(var(--warning-foreground))" },
  },
  {
    name: "Vitamin D3",
    purpose: "Strengthens bones & immunity",
    dosage: "1 capsule weekly",
    time: "Sunday morning",
    color: { bg: "hsl(var(--accent) / 0.15)", icon: "hsl(var(--accent-foreground))" },
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

export default function Medicines() {
  const [pharmacies,   setPharmacies]   = useState<any[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [showPharmacy, setShowPharmacy] = useState(false);

  const toggleExpand = (name: string) =>
    setExpanded((prev) => (prev === name ? null : name));

  const findPharmacy = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
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
        } catch {
          alert("Failed to fetch pharmacies");
        }
        setLoading(false);
      },
      () => { alert("Location permission denied"); setLoading(false); }
    );
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes waveBar {
          from { transform: scaleY(0.2); opacity: 0.4; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
        .fade-up   { animation: fadeUp 0.35s ease both; }
        .med-input { transition: box-shadow 0.15s, border-color 0.15s; }
      `}</style>

      <div className="space-y-5 pb-6">

        {/* ── Title ── */}
        <div className="fade-up">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">My Medicines</h1>
          <p className="text-base text-muted-foreground mt-0.5">
            {medicines.length} medicines · tap a card to see where to buy
          </p>
        </div>

        {/* ── Medicine cards ── */}
        <div className="space-y-3">
          {medicines.map((med, i) => {
            const open = expanded === med.name;
            return (
              <div
                key={med.name}
                className="elder-card fade-up"
                style={{ animationDelay: `${i * 0.07}s`, padding: 0, overflow: "hidden" }}
              >
                {/* Main row */}
                <button
                  onClick={() => toggleExpand(med.name)}
                  className="w-full flex items-center gap-4 text-left"
                  style={{ padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer", minHeight: "auto" }}
                >
                  {/* Icon */}
                  <div
                    className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 52, height: 52, background: med.color.bg }}
                  >
                    <Pill className="w-6 h-6" style={{ color: med.color.icon }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-foreground">{med.name}</p>
                    <p className="text-base text-muted-foreground mt-0.5 truncate">{med.purpose}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                      <span className="text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>{med.time}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div
                    className="flex-shrink-0 rounded-xl flex items-center justify-center"
                    style={{ width: 34, height: 34, background: "hsl(var(--muted))", minHeight: "auto", minWidth: "auto" }}
                  >
                    {open
                      ? <ChevronUp  className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </button>

                {/* Expanded section */}
                {open && (
                  <div
                    style={{
                      borderTop: "1px solid hsl(var(--border))",
                      padding: "16px 20px 20px",
                      background: "hsl(var(--muted) / 0.5)",
                    }}
                  >
                    {/* Dosage */}
                    <div
                      className="flex items-start gap-3 rounded-xl p-3 mb-4"
                      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1.3 }}>📋</span>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Dosage</p>
                        <p className="text-base font-bold text-foreground">{med.dosage}</p>
                      </div>
                    </div>

                    {/* Buy online */}
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      Buy Online
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {getMedicineLinks(med.name).map((site) => (
                        <a
                          key={site.name}
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-xl font-bold text-sm no-underline transition-all active:scale-95"
                          style={{
                            padding: "8px 14px",
                            background: "hsl(var(--primary) / 0.1)",
                            color: "hsl(var(--primary))",
                            border: "1px solid hsl(var(--primary) / 0.2)",
                            minHeight: "auto",
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {site.name}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Find pharmacy button ── */}
        <button onClick={findPharmacy} className="elder-btn-primary w-full text-lg gap-3 fade-up">
          <MapPin className="w-6 h-6" />
          Find Nearby Pharmacy
        </button>

        {/* ── Loading ── */}
        {loading && (
          <div className="elder-card flex flex-col items-center gap-5 py-10 fade-up">
            <div className="flex items-end gap-1.5" style={{ height: 48 }}>
              {[0.5, 0.8, 1, 0.65, 0.9, 0.55, 1, 0.75].map((h, i) => (
                <div key={i} className="rounded-full"
                  style={{
                    width: 7, height: `${h * 100}%`,
                    background: "hsl(var(--primary))",
                    animation: `waveBar 0.7s ease-in-out ${i * 0.08}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-foreground">Finding pharmacies near you...</p>
              <p className="text-base text-muted-foreground mt-1">Using your current location</p>
            </div>
          </div>
        )}

        {/* ── Pharmacy results ── */}
        {showPharmacy && !loading && pharmacies.length > 0 && (
          <div className="fade-up">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Nearby Pharmacies
              </p>
              <span
                className="badge"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {pharmacies.slice(0, 5).length} found
              </span>
            </div>

            <div className="space-y-3">
              {pharmacies.slice(0, 5).map((p, i) => (
                <div key={i} className="elder-card flex items-center gap-4">
                  <div
                    className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 48, height: 48, background: "hsl(var(--info) / 0.1)" }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: "hsl(var(--info))" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-foreground truncate">
                      {p.tags?.name || "Pharmacy"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {p.tags?.["addr:street"]
                        ? `${p.tags["addr:street"]}${p.tags?.["addr:city"] ? `, ${p.tags["addr:city"]}` : ""}`
                        : `${p.lat?.toFixed(4)}, ${p.lon?.toFixed(4)}`}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${p.lat},${p.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl font-bold text-sm no-underline flex-shrink-0 transition-all active:scale-95"
                    style={{
                      padding: "10px 14px",
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      minHeight: "auto", minWidth: "auto",
                    }}
                  >
                    <Navigation className="w-4 h-4" />
                    Go
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No pharmacies found */}
        {showPharmacy && !loading && pharmacies.length === 0 && (
          <div className="elder-card flex flex-col items-center gap-3 py-10 fade-up"
            style={{ border: "2px dashed hsl(var(--border))" }}>
            <MapPin className="w-10 h-10" style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-lg font-extrabold text-foreground">No pharmacies found nearby</p>
            <p className="text-base text-muted-foreground text-center">
              Try searching in a wider area or check your location settings
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
}