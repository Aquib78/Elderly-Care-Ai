import { useState } from "react";
import { Upload, FileText, Sparkles, Volume2 } from "lucide-react";
import Layout from "@/components/Layout";

export default function Reports() {
  const [uploaded, setUploaded] = useState(false);
  const [simplified, setSimplified] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-elder-2xl font-bold">Medical Reports</h1>

        {/* Upload area */}
        <div
          className="elder-card border-2 border-dashed border-primary/40 flex flex-col items-center gap-4 py-12 cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => setUploaded(true)}
        >
          <Upload className="w-16 h-16 text-primary" />
          <p className="text-elder-lg font-semibold text-center">
            Tap here to upload your medical report
          </p>
          <p className="text-muted-foreground text-center">
            PDF, Image, or Photo from camera
          </p>
        </div>

        {uploaded && (
          <>
            {/* Extracted content */}
            <div className="elder-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-elder-xl font-bold">Report Content</h2>
              </div>
              <div className="bg-muted rounded-xl p-4 text-elder-base leading-relaxed">
                <p><strong>Patient:</strong> Mary Johnson</p>
                <p><strong>Date:</strong> April 5, 2026</p>
                <p><strong>Test:</strong> Complete Blood Count (CBC)</p>
                <p className="mt-2">Hemoglobin: 11.2 g/dL (Low) • WBC: 7,500 /μL (Normal) • Platelets: 220,000 /μL (Normal) • Blood Sugar: 145 mg/dL (High)</p>
              </div>
              <button
                onClick={() => setSimplified(true)}
                className="elder-btn bg-primary text-primary-foreground mt-4 flex items-center gap-3 w-full justify-center"
              >
                <Sparkles className="w-6 h-6" />
                Simplify This Report
              </button>
            </div>

            {simplified && (
              <div className="elder-card bg-success/10 border-success/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-elder-xl font-bold text-success">
                    ✅ Simple Explanation
                  </h2>
                  <button className="w-10 h-10 rounded-xl bg-info text-info-foreground flex items-center justify-center" aria-label="Read aloud">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4 text-elder-base">
                  <div className="bg-card rounded-xl p-4">
                    <p className="font-bold text-warning">⚠️ Low Hemoglobin</p>
                    <p className="text-muted-foreground">Your iron levels are slightly low. This might make you feel tired. Eating more green vegetables and iron-rich foods can help.</p>
                  </div>
                  <div className="bg-card rounded-xl p-4">
                    <p className="font-bold text-emergency">🔴 High Blood Sugar</p>
                    <p className="text-muted-foreground">Your blood sugar is above normal. This needs attention. Please discuss with your doctor about managing it.</p>
                  </div>
                  <div className="bg-card rounded-xl p-4">
                    <p className="font-bold text-success">✅ WBC & Platelets Normal</p>
                    <p className="text-muted-foreground">Your white blood cells and platelets are in the healthy range. Your immune system is working well!</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
