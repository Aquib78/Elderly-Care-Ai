import { Link } from "react-router-dom";
import { FileText, Pill, Clock, Mic, Bell } from "lucide-react";
import EmergencyButton from "@/components/EmergencyButton";
import Layout from "@/components/Layout";

const quickActions = [
  { to: "/reports", icon: FileText, label: "Upload Report", color: "bg-primary text-primary-foreground" },
  { to: "/medicines", icon: Pill, label: "My Medicines", color: "bg-success text-success-foreground" },
  { to: "/reminders", icon: Clock, label: "Reminders", color: "bg-info text-info-foreground" },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="elder-card bg-primary/5 border-primary/20">
          <h1 className="text-elder-2xl font-bold text-foreground">
            Good Morning! 👋
          </h1>
          <p className="text-elder-lg text-muted-foreground mt-2">
            How are you feeling today? Let me help you with your health.
          </p>
          <button className="elder-btn bg-primary text-primary-foreground mt-4 flex items-center gap-3">
            <Mic className="w-6 h-6" />
            Talk to me
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className={`elder-card flex flex-col items-center gap-4 py-8 hover:shadow-soft-lg transition-shadow ${color} border-0`}
            >
              <Icon className="w-12 h-12" />
              <span className="text-elder-lg font-bold">{label}</span>
            </Link>
          ))}
        </div>

        {/* Notifications preview */}
        <div className="elder-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-6 h-6 text-warning" />
            <h2 className="text-elder-xl font-bold">Upcoming</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-muted rounded-xl p-4">
              <Clock className="w-6 h-6 text-info" />
              <div>
                <p className="font-semibold text-elder-base">Blood Pressure Medicine</p>
                <p className="text-muted-foreground">Today at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted rounded-xl p-4">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-elder-base">Doctor Appointment</p>
                <p className="text-muted-foreground">Tomorrow at 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency */}
        <EmergencyButton />
      </div>
    </Layout>
  );
}
