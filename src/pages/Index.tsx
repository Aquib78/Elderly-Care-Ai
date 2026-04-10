import { Link } from "react-router-dom";
import { FileText, Pill, Clock, Mic, Bell } from "lucide-react";
import EmergencyButton from "@/components/EmergencyButton";
import Layout from "@/components/Layout";

const quickActions = [
  {
    to: "/reports",
    icon: FileText,
    label: "Upload Report",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    to: "/medicines",
    icon: Pill,
    label: "My Medicines",
    bg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    to: "/reminders",
    icon: Clock,
    label: "Reminders",
    bg: "bg-info/10",
    iconColor: "text-info",
  },
];

export default function Index() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning! 👋" : hour < 17 ? "Good Afternoon! 👋" : "Good Evening! 👋";

  return (
    <Layout>
      <div className="space-y-6 pb-6">

        {/* ── Welcome card ── */}
        <div
          className="elder-card border-primary/20"
          style={{
            background: "linear-gradient(135deg, hsl(168 55% 95%) 0%, hsl(180 20% 97%) 100%)",
          }}
        >
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">
            {greeting}
          </h1>
          <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
            How are you feeling today? Let me help you with your health.
          </p>
          <button className="elder-btn-primary mt-5">
            <Mic className="w-5 h-5" />
            Talk to me
          </button>
        </div>

        {/* ── Quick actions ── */}
        <div className="cards-grid-3">
          {quickActions.map(({ to, icon: Icon, label, bg, iconColor }) => (
            <Link
              key={to}
              to={to}
              className="elder-card flex flex-col items-center gap-4 py-10 no-underline hover:no-underline"
            >
              <div className={`${bg} rounded-2xl p-4`}>
                <Icon className={`w-10 h-10 ${iconColor}`} />
              </div>
              <span className="text-xl font-bold text-foreground text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Upcoming ── */}
        <div className="elder-card">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-6 h-6 text-warning" />
            <h2 className="text-2xl font-extrabold">Upcoming</h2>
          </div>

          <div className="space-y-3">
            <div className="schedule-row">
              <div className="bg-info/10 rounded-xl p-2.5">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-foreground leading-snug">
                  Blood Pressure Medicine
                </p>
                <p className="text-base text-muted-foreground">Today at 2:00 PM</p>
              </div>
              <span className="badge badge-warning">Soon</span>
            </div>

            <div className="schedule-row">
              <div className="bg-primary/10 rounded-xl p-2.5">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-foreground leading-snug">
                  Doctor Appointment
                </p>
                <p className="text-base text-muted-foreground">Tomorrow at 10:00 AM</p>
              </div>
              <span className="badge badge-info">Upcoming</span>
            </div>
          </div>
        </div>

        {/* ── Emergency ── */}
        <EmergencyButton />

      </div>
    </Layout>
  );
}