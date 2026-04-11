import { useEffect, useState } from "react";
import { Clock, Plus, Bell, Phone, MessageSquare, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";

interface Reminder {
  _id: string;
  medicine: string;
  time: string;
  frequency: string;
  phone: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [phone, setPhone] = useState("");

  // =========================
  // 🔄 FETCH FROM BACKEND
  // =========================
  const fetchReminders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/get-reminders/");
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // =========================
  // ➕ ADD REMINDER
  // =========================
  const addReminder = async () => {
    if (!newMedicine || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/add-reminder/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicine: newMedicine,
          time: newTime,
          phone: phone,
        }),
      });

      fetchReminders(); // refresh list
    } catch (err) {
      console.error("Add error:", err);
    }

    setNewMedicine("");
    setPhone("");
    setShowForm(false);
  };

  // =========================
  // 🗑 DELETE REMINDER
  // =========================
  const deleteReminder = async (id: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/delete-reminder/${id}`, {
        method: "DELETE",
      });

      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

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
            <div key={r._id} className="elder-card flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-info/15 flex items-center justify-center">
                <Bell className="w-7 h-7 text-info" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold">{r.medicine}</h3>

                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{r.time} • Daily</span>
                </div>

                <div className="flex gap-3 mt-2">
                  <span className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-gray-200">
                    <MessageSquare className="w-3 h-3" /> SMS
                  </span>

                  <span className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-blue-100 text-blue-600">
                    <Phone className="w-3 h-3" /> Call
                  </span>
                </div>
              </div>

              {/* 🗑 DELETE BUTTON */}
              <button
                onClick={() => deleteReminder(r._id)}
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