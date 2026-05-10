import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Clock, Info, Lightbulb, Zap } from "lucide-react";

export default function OptimizationPage() {
  const { reports, activeReportId, profile } = useAppStore();
  const activeReport = reports.find((r) => r.id === activeReportId);
  const appliances = activeReport?.appliances || [];

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Lightbulb className="w-16 h-16 text-[#1a2b4c]" />
        <h2 className="text-xl text-slate-300">No Simulation Active</h2>
        <p className="text-slate-500">Please upload a bill to generate optimization insights.</p>
      </div>
    );
  }

  const getRecommendations = () => {
    const recommendations = [];
    
    // Example logic based on appliances
    const hasAC = appliances.some(a => a.name.toLowerCase().includes("air conditioner") || a.name.toLowerCase().includes("ac"));
    const hasGeyser = appliances.some(a => a.name.toLowerCase().includes("geyser"));
    const hasWashingMachine = appliances.some(a => a.name.toLowerCase().includes("washing"));
    const hasOldAppliances = appliances.some(a => a.isOld);

    if (hasAC) {
      recommendations.push({
        title: "AC Temperature Optimization",
        desc: "Running your AC at 24°C instead of 18°C can reduce consumption by 10-15%. Consider setting a timer to turn it off 1 hour before waking up.",
        icon: <Zap className="w-5 h-5 text-cyan-400" />,
        type: "high-impact"
      });
    }

    if (hasGeyser) {
      recommendations.push({
        title: "Geyser Usage Timing",
        desc: "Your geyser usage might be during peak morning hours. Try turning it on 30 minutes earlier to avoid peak tariffs and load stress.",
        icon: <Clock className="w-5 h-5 text-orange-400" />,
        type: "scheduling"
      });
    }

    if (hasWashingMachine) {
      recommendations.push({
        title: "Washing Machine Scheduling",
        desc: "Shift washing machine usage to non-peak hours (e.g., between 10 AM - 4 PM) when overall household load is lower.",
        icon: <Clock className="w-5 h-5 text-blue-400" />,
        type: "scheduling"
      });
    }

    if (hasOldAppliances) {
      recommendations.push({
        title: "Appliance Upgrade Alert",
        desc: "You have appliances older than 5 years. Upgrading them to 5-star rated inverter models could save you up to ₹800/month.",
        icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
        type: "upgrade"
      });
    }

    // Location specific
    if (profile.state === "Maharashtra" || profile.state === "Delhi") {
      recommendations.push({
        title: "Peak Hour Avoidance",
        desc: `In ${profile.state}, electricity tariffs or load shedding might be sensitive to peak hours (6 PM - 10 PM). Reduce high-wattage appliance usage during this window.`,
        icon: <Info className="w-5 h-5 text-slate-400" />,
        type: "info"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-50">Smart Energy Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-slate-500 text-sm">Add appliances to your Household Profile to receive tailored recommendations.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-[#1a2b4c]/50 bg-[#121c2e]/50 hover:bg-[#1a2b4c]/40 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {rec.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-medium">{rec.title}</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
