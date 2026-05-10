import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Activity, Calendar, Eye, History, IndianRupee, Trash2, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function HistoricalAnalysisPage() {
  const { reports, activeReportId, setActiveReport, deleteReport } = useAppStore();
  const navigate = useNavigate();

  const handleViewReport = (id: string) => {
    setActiveReport(id);
    navigate({ to: "/dashboard" });
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <History className="w-16 h-16 text-[#1a2b4c]" />
        <h2 className="text-xl text-slate-300">No Historical Data</h2>
        <p className="text-slate-500">Upload electricity bills to start building your household energy history.</p>
        <Button onClick={() => navigate({ to: "/upload" })} variant="outline" className="mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          Upload a Bill <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-2xl font-bold text-cyan-50 mb-6 flex items-center gap-2">
        <History className="w-6 h-6 text-cyan-400" />
        Historical Analysis Archive
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const isActive = report.id === activeReportId;
          const { bill, stats } = report;

          return (
            <Card 
              key={report.id} 
              className={`bg-[#0a0f18]/80 border ${isActive ? 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-[#1a2b4c]/50 hover:border-cyan-500/30'} backdrop-blur-md transition-all duration-300 flex flex-col`}
            >
              <CardHeader className="pb-3 border-b border-[#1a2b4c]/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-cyan-50">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{bill.billingMonth}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                      Active
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-grow flex flex-col">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Units</span>
                    <span className="text-slate-200 font-bold">{bill.unitsConsumed} <span className="text-xs font-normal text-slate-500">kWh</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Amount</span>
                    <span className="text-slate-200 font-bold">₹{bill.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-400" /> Efficiency</span>
                    <span className="text-slate-200 font-bold">{stats.efficiencyScore.toFixed(0)}<span className="text-xs font-normal text-slate-500">/100</span></span>
                  </div>
                  
                  <div className="pt-2">
                     <span className={`text-xs px-2 py-1 rounded-md border 
                        ${stats.peakLoadStatus === 'Critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                          stats.peakLoadStatus === 'High' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 
                          stats.peakLoadStatus === 'Moderate' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                          'bg-green-500/10 border-green-500/30 text-green-400'}`}
                     >
                       {stats.peakLoadStatus} Peak Load
                     </span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-[#1a2b4c]/30">
                  <Button 
                    variant={isActive ? "secondary" : "default"}
                    className={`flex-1 ${isActive ? 'bg-[#1a2b4c] text-slate-300 hover:bg-[#1a2b4c]/80' : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/30'}`}
                    onClick={() => handleViewReport(report.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isActive ? "Viewing" : "Analyze"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="px-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                    onClick={() => deleteReport(report.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}