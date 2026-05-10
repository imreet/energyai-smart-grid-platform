import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, UploadCloud, BrainCircuit, Activity } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartType = "Line" | "Bar" | "Area" | "Scatter";

export default function DatasetAnalyticsLabPage() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  
  const [xAxisCol, setXAxisCol] = useState<string>("");
  const [yAxisCol, setYAxisCol] = useState<string>("");
  const [chartType, setChartType] = useState<ChartType>("Line");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      return;
    }

    setIsParsing(true);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const parsedData = results.data;
        if (parsedData.length === 0) {
          toast.error("CSV is empty");
          return;
        }

        const cols = Object.keys(parsedData[0] as any);
        setColumns(cols);
        setData(parsedData);

        // Detect numeric columns
        const numerics = cols.filter(col => 
          parsedData.some((row: any) => typeof row[col] === 'number')
        );
        setNumericColumns(numerics);

        // Auto-select axes
        if (cols.length > 0) setXAxisCol(cols[0]); // Default X to first column
        if (numerics.length > 0) setYAxisCol(numerics[numerics.length - 1]); // Default Y to last numeric

        toast.success(`Successfully parsed ${parsedData.length} rows`);
      },
      error: (error) => {
        setIsParsing(false);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const insights = useMemo(() => {
    if (!data.length || !yAxisCol) return null;

    let max = -Infinity;
    let min = Infinity;
    let sum = 0;
    let validCount = 0;

    data.forEach((row) => {
      const val = row[yAxisCol];
      if (typeof val === 'number') {
        if (val > max) max = val;
        if (val < min) min = val;
        sum += val;
        validCount++;
      }
    });

    const avg = validCount > 0 ? sum / validCount : 0;

    return { max, min, avg, count: validCount };
  }, [data, yAxisCol]);

  const renderChart = () => {
    if (!data.length || !xAxisCol || !yAxisCol) return null;

    // Limit data for performance rendering if huge (sample up to 1000 points visually)
    const renderData = data.length > 1000 ? data.filter((_, i) => i % Math.ceil(data.length / 1000) === 0) : data;

    const commonProps = {
      data: renderData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case "Bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" vertical={false} />
            <XAxis dataKey={xAxisCol} stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }} />
            <Legend />
            <Bar dataKey={yAxisCol} fill="#22D3EE" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "Area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" vertical={false} />
            <XAxis dataKey={xAxisCol} stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }} />
            <Legend />
            <Area type="monotone" dataKey={yAxisCol} stroke="#3B82F6" fillOpacity={1} fill="url(#colorY)" />
          </AreaChart>
        );
      case "Scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" />
            <XAxis dataKey={xAxisCol} stroke="#64748B" type={typeof renderData[0]?.[xAxisCol] === 'number' ? 'number' : 'category'} />
            <YAxis dataKey={yAxisCol} stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }} cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name={yAxisCol} data={renderData} fill="#10B981" />
          </ScatterChart>
        );
      case "Line":
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" vertical={false} />
            <XAxis dataKey={xAxisCol} stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }} />
            <Legend />
            <Line type="monotone" dataKey={yAxisCol} stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Upload & Config Zone */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <CardHeader>
              <CardTitle className="text-xl text-cyan-50 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Data Ingestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-[#1a2b4c] rounded-xl p-6 text-center flex flex-col items-center justify-center hover:bg-[#1a2b4c]/20 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileSpreadsheet className="w-10 h-10 text-cyan-500 mb-3" />
                <p className="text-slate-200 font-medium mb-1">Click to upload CSV</p>
                <p className="text-xs text-slate-500">Auto-detects schemas and column types</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
              {isParsing && (
                <p className="text-sm text-cyan-400 mt-4 animate-pulse text-center">Parsing dataset...</p>
              )}
            </CardContent>
          </Card>

          {data.length > 0 && (
            <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-50">Graph Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">X-Axis (Time/Category)</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    value={xAxisCol}
                    onChange={(e) => setXAxisCol(e.target.value)}
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Y-Axis (Numeric Value)</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    value={yAxisCol}
                    onChange={(e) => setYAxisCol(e.target.value)}
                  >
                    {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Chart Type</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as ChartType)}
                  >
                    <option value="Line">Line Chart</option>
                    <option value="Bar">Bar Chart</option>
                    <option value="Area">Area Chart</option>
                    <option value="Scatter">Scatter Plot</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {insights && (
            <Card className="bg-gradient-to-b from-[#0a0f18]/80 to-[#121c2e]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_4px_30px_rgba(34,211,238,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-50 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                  AI Insights: {yAxisCol}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                  <span className="text-slate-400 text-sm">Peak Value</span>
                  <span className="text-red-400 font-bold">{insights.max.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                  <span className="text-slate-400 text-sm">Lowest Value</span>
                  <span className="text-emerald-400 font-bold">{insights.min.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#1a2b4c]/50 pb-2">
                  <span className="text-slate-400 text-sm">Average</span>
                  <span className="text-blue-400 font-bold">{insights.avg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 text-sm">Data Points</span>
                  <span className="text-slate-200">{insights.count}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Graph Zone */}
        <div className="w-full md:w-2/3 space-y-6">
          <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-cyan-50 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Interactive Visualization
              </CardTitle>
              {data.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#1a2b4c] text-cyan-400 hover:bg-[#1a2b4c]">
                    <Download className="w-4 h-4 mr-2" /> Graph
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#1a2b4c] text-blue-400 hover:bg-[#1a2b4c]">
                    <Download className="w-4 h-4 mr-2" /> PDF Report
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {data.length === 0 ? (
                <div className="h-[500px] flex items-center justify-center border border-dashed border-[#1a2b4c] rounded-lg">
                  <p className="text-slate-500 text-sm">Upload a CSV dataset to generate visualizations</p>
                </div>
              ) : (
                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart() || <div/>}
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table Preview */}
          {data.length > 0 && (
            <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-50">Dataset Preview (First 15 Rows)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-[#050810]/50 border-b border-[#1a2b4c]">
                      <tr>
                        {columns.slice(0, 8).map(col => (
                          <th key={col} className="px-4 py-3 whitespace-nowrap">{col}</th>
                        ))}
                        {columns.length > 8 && <th className="px-4 py-3">...</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 15).map((row, idx) => (
                        <tr key={idx} className="border-b border-[#1a2b4c]/50 hover:bg-[#1a2b4c]/20">
                          {columns.slice(0, 8).map(col => (
                            <td key={col} className="px-4 py-3 whitespace-nowrap text-slate-300">
                              {typeof row[col] === 'number' ? row[col].toFixed(2) : String(row[col])}
                            </td>
                          ))}
                          {columns.length > 8 && <td className="px-4 py-3 text-slate-500">...</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
