import { useState } from "react";
import { Pill, MapPin, Clock } from "lucide-react";
import Layout from "@/components/Layout";

const medicines = [
  {
    name: "Metformin 500mg",
    purpose: "Controls blood sugar levels",
    dosage: "1 tablet after breakfast & dinner",
    time: "8:00 AM, 8:00 PM",
  },
  {
    name: "Amlodipine 5mg",
    purpose: "Lowers blood pressure",
    dosage: "1 tablet in the morning",
    time: "8:00 AM",
  },
  {
    name: "Iron Supplement",
    purpose: "Increases iron & hemoglobin",
    dosage: "1 tablet after lunch",
    time: "1:00 PM",
  },
  {
    name: "Vitamin D3",
    purpose: "Strengthens bones",
    dosage: "1 capsule weekly",
    time: "Sunday morning",
  },
];

export default function Medicines() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Online links
  const getMedicineLinks = (name: string) => {
    const query = encodeURIComponent(name);

    return [
      {
        name: "PharmEasy",
        url: `https://pharmeasy.in/search/all?name=${query}`,
      },
      {
        name: "Tata 1mg",
        url: `https://www.1mg.com/search/all?name=${query}`,
      },
      {
        name: "Apollo",
        url: `https://www.apollopharmacy.in/search-medicines/${query}`,
      },
    ];
  };

  // 📍 Find nearby pharmacies
  const findPharmacy = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const query = `
            [out:json];
            node["amenity"="pharmacy"](around:1500,${lat},${lon});
            out;
          `;

          const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            query
          )}`;

          const res = await fetch(url);
          const data = await res.json();

          const filtered = (data.elements || []).filter(
            (p: any) => p.tags?.name || p.tags?.["addr:street"]
          );

          setPharmacies(filtered);
        } catch (err) {
          console.error(err);
          alert("Failed to fetch pharmacies");
        }

        setLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">My Medicines</h1>

        {/* Medicines */}
        <div className="space-y-4">
          {medicines.map((med) => (
            <div key={med.name} className="elder-card">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-7 h-7 text-success" />
                </div>

                <div className="flex-1">
                  <h3 className="text-elder-lg font-bold">{med.name}</h3>
                  <p className="text-muted-foreground mt-1">{med.purpose}</p>

                  <p className="text-elder-base font-semibold mt-2">
                    📋 {med.dosage}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{med.time}</span>
                  </div>

                  {/* 🛒 Online availability */}
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      🛒 Available Online:
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {getMedicineLinks(med.name).map((site) => (
                        <a
                          key={site.name}
                          href={site.url}
                          target="_blank"
                          className="text-sm px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20"
                        >
                          {site.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={findPharmacy}
          className="elder-btn bg-primary text-primary-foreground w-full flex items-center justify-center gap-3"
        >
          <MapPin className="w-6 h-6" />
          Find Nearby Pharmacy
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-center text-muted-foreground">
            🔍 Finding nearby pharmacies...
          </p>
        )}

        {/* Results */}
        {pharmacies.length > 0 && (
          <div className="space-y-4 mt-4">
            <h2 className="text-elder-xl font-bold">Nearby Pharmacies</h2>

            {pharmacies.slice(0, 5).map((pharmacy, index) => (
              <div key={index} className="elder-card">
                <p className="text-elder-lg font-bold">
                  {pharmacy.tags?.name || "Pharmacy"}
                </p>

                <p className="text-muted-foreground">
                  📍 {pharmacy.tags?.["addr:street"] || ""}
                  {pharmacy.tags?.["addr:city"]
                    ? `, ${pharmacy.tags["addr:city"]}`
                    : ""}
                </p>

                {!pharmacy.tags?.["addr:street"] && (
                  <p className="text-sm text-muted-foreground">
                    Lat: {pharmacy.lat}, Lon: {pharmacy.lon}
                  </p>
                )}

                <a
                  href={`https://www.google.com/maps?q=${pharmacy.lat},${pharmacy.lon}`}
                  target="_blank"
                  className="mt-2 inline-block text-primary font-semibold"
                >
                  🧭 Open in Maps
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}