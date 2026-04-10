import Layout from "@/components/Layout";
import HeartbeatAnalysis from "@/components/HeartbeatAnalysis";

export default function HeartbeatPage() {
  return (
    <Layout>
      <div className="space-y-6 pb-6">
        <HeartbeatAnalysis />
      </div>
    </Layout>
  );
}