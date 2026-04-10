import { Pill, MapPin, Clock } from "lucide-react";
import Layout from "@/components/Layout";

const medicines = [
  { name: "Metformin 500mg", purpose: "Controls blood sugar levels", dosage: "1 tablet after breakfast & dinner", time: "8:00 AM, 8:00 PM" },
  { name: "Amlodipine 5mg", purpose: "Lowers blood pressure", dosage: "1 tablet in the morning", time: "8:00 AM" },
  { name: "Iron Supplement", purpose: "Increases iron & hemoglobin", dosage: "1 tablet after lunch", time: "1:00 PM" },
  { name: "Vitamin D3", purpose: "Strengthens bones", dosage: "1 capsule weekly", time: "Sunday morning" },
];

export default function Medicines() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">My Medicines</h1>

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
                  <p className="text-elder-base font-semibold mt-2">📋 {med.dosage}</p>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{med.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="elder-btn bg-primary text-primary-foreground w-full flex items-center justify-center gap-3">
          <MapPin className="w-6 h-6" />
          Find Nearby Pharmacy
        </button>
      </div>
    </Layout>
  );
}
