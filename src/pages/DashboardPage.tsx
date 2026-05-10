import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDashboardStats } from "@/lib/calculator";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, IndianRupee, Leaf, Zap } from "lucide-react";

export default function DashboardPage() {
  const { reports, activeReportId, profile } = useAppStore();
  const activeReport = reports.find(r => r.id === activeReportId);
  const appliances = activeReport?.appliances || [];
  const stats = activeReport?.stats || generateDashboardStats([], profile);

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Zap className="w-16 h-16 text-[#1a2b4c]" />
        <h2 className="text-xl text-slate-300">No Simulation Active</h2>
        <p className="text-slate-500">Please upload a bill to generate your household energy dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-cyan-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Est. Monthly Load
            </CardTitle>
            <Zap className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-50">
              {stats.currentEstimatedLoadKWh.toFixed(1)} <span className="text-sm text-cyan-500/70 font-normal">kWh</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Based on {appliances.length} appliances</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Predicted Bill
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-50">
              ₹{stats.predictedMonthlyBill.toFixed(0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tariff: {profile.state}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Carbon Footprint
            </CardTitle>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-50">
              {stats.carbonFootprintKg.toFixed(1)} <span className="text-sm text-emerald-500/70 font-normal">kg CO₂</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Monthly estimation</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-orange-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Peak Load Status
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${stats.peakLoadStatus === 'Critical' ? 'text-red-500' : stats.peakLoadStatus === 'High' ? 'text-orange-500' : stats.peakLoadStatus === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.peakLoadStatus === 'Critical' ? 'text-red-400' : stats.peakLoadStatus === 'High' ? 'text-orange-400' : stats.peakLoadStatus === 'Moderate' ? 'text-yellow-400' : 'text-green-400'}`}>
              {stats.peakLoadStatus}
            </div>
            <p className="text-xs text-slate-500 mt-1">Efficiency Score: {stats.efficiencyScore.toFixed(0)}/100</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Placeholder for Main Chart */}
        <Card className="col-span-4 bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50">Hourly Load Forecast Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-dashed border-[#1a2b4c] rounded-lg">
              <p className="text-slate-500 text-sm">See Forecast Insights for detailed analysis.</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Consuming Appliances */}
        <Card className="col-span-3 bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-50">Top Consuming Appliances</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {appliances.length === 0 ? (
                 <p className="text-slate-500 text-sm">No appliances added yet. Go to Appliance Manager.</p>
               ) : (
                 appliances.slice(0, 5).map((app, index) => (
                   <div key={app.id || index} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Zap className="w-3 h-3 text-blue-400" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-slate-200">{app.name}</p>
                         <p className="text-xs text-slate-500">{app.quantity} unit(s) • {app.hoursPerDay}h/day</p>
                       </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">
                          {((app.wattage * app.hoursPerDay * 30 * app.quantity) / 1000).toFixed(1)} <span className="text-[10px] text-cyan-500/70">kWh</span>
                        </p>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
