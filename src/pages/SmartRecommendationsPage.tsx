import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, CheckCircle2, Lightbulb, TrendingDown } from "lucide-react";

export default function SmartRecommendationsPage() {
  const { reports, activeReportId } = useAppStore();
  const activeReport = reports.find(r => r.id === activeReportId);

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Lightbulb className="w-16 h-16 text-[#1a2b4c]" />
        <h2 className="text-xl text-slate-300">No Recommendations Available</h2>
        <p className="text-slate-500">Please upload a bill to generate AI-powered smart recommendations.</p>
      </div>
    );
  }

  const recommendations = activeReport.recommendations || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-2xl font-bold text-cyan-50 mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        Smart AI Recommendations
      </h2>

      {recommendations.length === 0 ? (
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4 opacity-50" />
            <p className="text-slate-300">Your household is highly optimized!</p>
            <p className="text-slate-500 text-sm">No new recommendations at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            let Icon = Lightbulb;
            let iconColor = "text-yellow-400";
            let borderColor = "border-yellow-500/30";
            let bgColor = "bg-yellow-500/10";

            if (rec.type === "Alert") {
              Icon = AlertTriangle;
              iconColor = "text-rose-400";
              borderColor = "border-rose-500/30";
              bgColor = "bg-rose-500/10";
            } else if (rec.type === "Optimization") {
              Icon = TrendingDown;
              iconColor = "text-emerald-400";
              borderColor = "border-emerald-500/30";
              bgColor = "bg-emerald-500/10";
            }

            return (
              <Card key={rec.id} className={`bg-[#0a0f18]/80 border ${borderColor} backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_30px_rgba(34,211,238,0.1)] transition-all duration-300`}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className={`p-3 rounded-xl ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-slate-200">{rec.title}</CardTitle>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{rec.type}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="inline-flex items-center rounded-full border border-[#1a2b4c] px-3 py-1 text-xs font-medium text-cyan-400 bg-[#050810]">
                    {rec.impact}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}