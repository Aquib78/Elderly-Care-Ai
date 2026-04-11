import { useEffect, useState } from "react";
import { Clock, Plus, Bell, Phone, MessageSquare, Trash2 } from "lucide-react";
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

  // =========================
  // LOAD FROM STORAGE
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem("reminders");
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  // =========================
  // SAVE TO STORAGE
  // =========================
  const saveToStorage = (data: Reminder[]) => {
    localStorage.setItem("reminders", JSON.stringify(data));
  };

  // =========================
  // ADD REMINDER
  // =========================
  const addReminder = () => {
    if (!newMedicine || !phone) {
      alert("Please fill all fields");
      return;
    }

    const newReminder: Reminder = {
      id: Date.now(),
      medicine: newMedicine,
      time: newTime,
      phone: phone,
      called: false,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveToStorage(updated);

    setNewMedicine("");
    setPhone("");
    setShowForm(false);
  };

  // =========================
  // DELETE
  // =========================
  const deleteReminder = (id: number) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveToStorage(updated);
  };

  // =========================
  // 🔥 AUTO CALL CHECKER
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      reminders.forEach(async (r) => {
        if (r.time === currentTime && !r.called) {
          console.log("📞 Calling for:", r.medicine);

          try {
            await fetch("http://localhost:5000/call-reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: r.phone,
                medicine: r.medicine,
              }),
            });

            // mark as called
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
    }, 5000); // check every 5 sec

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-elder-2xl font-bold">Reminders</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="elder-card space-y-4">
            <h3 className="text-elder-lg font-bold">Add New Reminder</h3>

            <input
              value={newMedicine}
              onChange={(e) => setNewMedicine(e.target.value)}
              placeholder="Medicine name..."
              className="w-full bg-muted rounded-xl px-4 py-3"
            />

            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-muted rounded-xl px-4 py-3"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (+91...)"
              className="w-full bg-muted rounded-xl px-4 py-3"
            />

            <button
              onClick={addReminder}
              className="w-full bg-primary text-white py-3 rounded-xl"
            >
              Save Reminder
            </button>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {reminders.map((r) => (
            <div key={r.id} className="elder-card flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-info/15 flex items-center justify-center">
                <Bell className="w-7 h-7 text-info" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold">{r.medicine}</h3>

                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{r.time}</span>
                </div>

                <div className="text-sm mt-1">
                  {r.called ? "✅ Called" : "⏳ Pending"}
                </div>
              </div>

              <button
                onClick={() => deleteReminder(r.id)}
                className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}