import { User, Phone, Heart, Shield } from "lucide-react";
import Layout from "@/components/Layout";

const emergencyContacts = [
  { name: "John (Son)", phone: "+1 555-0123" },
  { name: "Dr. Sarah Wilson", phone: "+1 555-0456" },
  { name: "Mary (Neighbor)", phone: "+1 555-0789" },
];

export default function Profile() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">My Profile</h1>

        {/* Profile card */}
        <div className="elder-card flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-elder-xl font-bold">Mary Johnson</h2>
            <p className="text-muted-foreground">Age: 72 • Blood Type: A+</p>
            <p className="text-muted-foreground">ID: EC-2026-0042</p>
          </div>
        </div>

        {/* Health info */}
        <div className="elder-card">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-emergency" />
            <h2 className="text-elder-xl font-bold">Health Info</h2>
          </div>
          <div className="space-y-3">
            {[
              ["Conditions", "Type 2 Diabetes, Hypertension"],
              ["Allergies", "Penicillin"],
              ["Doctor", "Dr. Sarah Wilson"],
              ["Last Checkup", "March 15, 2026"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center bg-muted rounded-xl p-4">
                <span className="font-semibold">{label}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="elder-card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-emergency" />
            <h2 className="text-elder-xl font-bold">Emergency Contacts</h2>
          </div>
          <div className="space-y-3">
            {emergencyContacts.map((c) => (
              <div key={c.name} className="flex items-center justify-between bg-muted rounded-xl p-4">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-muted-foreground text-sm">{c.phone}</p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="w-10 h-10 rounded-xl bg-success text-success-foreground flex items-center justify-center"
                  aria-label={`Call ${c.name}`}
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
