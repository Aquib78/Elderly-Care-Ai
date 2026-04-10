import { useState } from "react";
import { Clock, Plus, Bell, Phone, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";

interface Reminder {
  id: number;
  medicine: string;
  time: string;
  frequency: string;
  sms: boolean;
  call: boolean;
}

const initialReminders: Reminder[] = [
  { id: 1, medicine: "Metformin 500mg", time: "08:00", frequency: "Daily", sms: true, call: false },
  { id: 2, medicine: "Amlodipine 5mg", time: "08:00", frequency: "Daily", sms: false, call: true },
  { id: 3, medicine: "Iron Supplement", time: "13:00", frequency: "Daily", sms: true, call: false },
];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [showForm, setShowForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("08:00");

  const addReminder = () => {
    if (!newMedicine.trim()) return;
    setReminders((r) => [
      ...r,
      { id: Date.now(), medicine: newMedicine, time: newTime, frequency: "Daily", sms: true, call: false },
    ]);
    setNewMedicine("");
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-elder-2xl font-bold">Reminders</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {showForm && (
          <div className="elder-card space-y-4">
            <h3 className="text-elder-lg font-bold">Add New Reminder</h3>
            <input
              value={newMedicine}
              onChange={(e) => setNewMedicine(e.target.value)}
              placeholder="Medicine name..."
              className="w-full bg-muted rounded-xl px-4 py-3 text-elder-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-muted rounded-xl px-4 py-3 text-elder-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button onClick={addReminder} className="elder-btn bg-primary text-primary-foreground w-full">
              Save Reminder
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reminders.map((r) => (
            <div key={r.id} className="elder-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-info/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-7 h-7 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="text-elder-lg font-bold">{r.medicine}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{r.time} • {r.frequency}</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <span className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${r.sms ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                    <MessageSquare className="w-3 h-3" /> SMS
                  </span>
                  <span className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${r.call ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"}`}>
                    <Phone className="w-3 h-3" /> Call
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
