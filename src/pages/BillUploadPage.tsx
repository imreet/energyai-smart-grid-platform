import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { generateRandomBillData } from "@/lib/bill-generator";
import { CheckCircle2, FileText, Upload, Zap, Calendar, AlertTriangle, Lightbulb, ScanLine, Tag, Activity } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BillUploadPage() {
  const { reports, activeReportId, generateGlobalSimulation } = useAppStore();
  const bill = reports.find((r) => r.id === activeReportId)?.bill;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMockUpload = (e?: React.DragEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (isUploading) return;

    setIsUploading(true);
    setProgress(0);
    // Removed setBill(null) since we will just generate a new simulation to trigger update

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(currentProgress);
        clearInterval(interval);
        setTimeout(() => {
          const newBillData = generateRandomBillData();
          generateGlobalSimulation(newBillData);
          setIsUploading(false);
          toast.success("Bill data extracted successfully!");
        }, 400);
      } else {
        setProgress(currentProgress);
      }
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] h-fit">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-50">Upload Electricity Bill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`relative border-2 border-dashed ${isUploading ? 'border-cyan-500/50 bg-[#1a2b4c]/30' : 'border-[#1a2b4c] hover:bg-[#1a2b4c]/20'} rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden min-h-[220px]`} 
              onClick={handleMockUpload}
              onDrop={handleMockUpload}
              onDragOver={handleDragOver}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center w-full space-y-4">
                  <div className="relative">
                    <ScanLine className="w-12 h-12 text-cyan-400 animate-pulse" />
                    {/* Scanning laser line effect */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] animate-[scan_1.5s_ease-in-out_infinite]" />
                  </div>
                  <div className="space-y-2 w-full max-w-[80%]">
                    <div className="flex justify-between text-xs text-cyan-400 font-mono">
                      <span>Extracting OCR Data...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-[#0a0f18]" />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-200 font-medium mb-1">Click or drag bill here</p>
                  <p className="text-sm text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
                  <Button variant="outline" className="mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10" onClick={(e) => { e.stopPropagation(); handleMockUpload(e); }}>
                    Simulate Extraction
                  </Button>
                </>
              )}
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#1a2b4c]"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or enter manually</span>
              <div className="flex-grow border-t border-[#1a2b4c]"></div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Total Units Consumed (kWh)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 450"
                  className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
                />
              </div>
              <Button className="w-full bg-[#1a2b4c]/50 hover:bg-[#1a2b4c] text-cyan-50 border border-[#1a2b4c] transition-all">
                Save Manual Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {bill && (
          <Card className="bg-gradient-to-b from-[#0a0f18]/80 to-[#121c2e]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_4px_30px_rgba(34,211,238,0.15)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 p-4">
               <CheckCircle2 className="w-8 h-8 text-cyan-400/30" />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-cyan-50 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Extracted Data
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                 <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                   <span className="text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4" /> Board</span>
                   <span className="text-slate-200 font-medium text-right">{bill.boardName}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                   <span className="text-slate-400">Consumer No.</span>
                   <span className="text-slate-200 font-mono tracking-wider">{bill.consumerNumber}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                   <span className="text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Bill Month</span>
                   <span className="text-slate-200">{bill.billingMonth}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                   <span className="text-slate-400 flex items-center gap-2"><Tag className="w-4 h-4" /> Category</span>
                   <span className="text-slate-200">{bill.tariffCategory}</span>
                 </div>
                 
                 <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2 pt-2">
                   <span className="text-slate-400 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Units Consumed</span>
                   <span className="text-amber-400 font-bold text-xl">{bill.unitsConsumed} <span className="text-sm font-normal text-amber-400/80">kWh</span></span>
                 </div>

                 <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#1a2b4c]/50">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Fixed Charges</p>
                      <p className="text-slate-300">₹{bill.fixedCharges}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Energy Charges</p>
                      <p className="text-slate-300">₹{bill.energyCharges}</p>
                    </div>
                 </div>

                 <div className="flex justify-between items-end pt-2">
                   <div>
                     <span className="text-slate-500 text-xs block mb-1">Due Date</span>
                     <span className="text-rose-400 text-sm font-medium">{bill.dueDate}</span>
                   </div>
                   <div className="text-right">
                     <span className="text-slate-400 text-sm block mb-1">Total Amount</span>
                     <span className="text-cyan-400 font-bold text-3xl">₹{bill.totalAmount}</span>
                   </div>
                 </div>

                 {/* Insights Badges */}
                 {bill.insights && bill.insights.length > 0 && (
                   <div className="pt-4 mt-2 space-y-2 border-t border-[#1a2b4c]/30">
                     <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">AI Insights</p>
                     <div className="flex flex-wrap gap-2">
                       {bill.insights.map((insight, idx) => {
                         const isAlert = insight.includes("Alert") || insight.includes("Peak");
                         const isPositive = insight.includes("Efficient");
                         return (
                           <div 
                             key={idx} 
                             className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border backdrop-blur-sm
                               ${isAlert ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 
                                 isPositive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 
                                 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}
                           >
                             {isAlert && <AlertTriangle className="w-3 h-3" />}
                             {isPositive && <CheckCircle2 className="w-3 h-3" />}
                             {!isAlert && !isPositive && <Lightbulb className="w-3 h-3" />}
                             {insight}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Adding custom keyframes for the scan animation if not in tailwind config */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
