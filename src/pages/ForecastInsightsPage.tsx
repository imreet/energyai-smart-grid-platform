import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { generateDashboardStats } from "@/lib/calculator";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#22D3EE", "#3B82F6", "#8B5CF6", "#F43F5E", "#10B981"];

export default function ForecastInsightsPage() {
  const { reports, activeReportId, profile } = useAppStore();
  const activeReport = reports.find(r => r.id === activeReportId);
  const appliances = activeReport?.appliances || [];
  const stats = activeReport?.stats || generateDashboardStats([], profile);

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl text-slate-300">No Simulation Active</h2>
        <p className="text-slate-500">Please upload a bill to generate forecast insights.</p>
      </div>
    );
  }

  // Generate mock hourly load curve based on appliances
  const hourlyData = useMemo(() => {
    const data = [];
    const baseLoad = stats.currentEstimatedLoadKWh / 30 / 24; // Roughly base load per hour

    for (let i = 0; i < 24; i++) {
      let load = baseLoad * 0.5; // night base load

      // Simulate peak hours
      if (i >= 7 && i <= 10) load += baseLoad * 1.5; // Morning peak
      if (i >= 18 && i <= 22) load += baseLoad * 2.5; // Evening peak

      data.push({
        time: `${i.toString().padStart(2, "0")}:00`,
        Actual: load * 0.9,
        Predicted: load,
      });
    }
    return data;
  }, [stats.currentEstimatedLoadKWh]);

  const applianceDistribution = useMemo(() => {
    return appliances.map(app => ({
      name: app.name,
      value: ((app.wattage * app.hoursPerDay * 30 * app.quantity) / 1000)
    })).sort((a, b) => b.value - a.value);
  }, [appliances]);

  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    return months.map((month, idx) => {
      // Simulate summer peak
      const isSummer = idx >= 3 && idx <= 6; // Apr-Jul
      const multiplier = isSummer ? 1.4 : 1;
      return {
        month,
        Consumption: idx <= currentMonth ? stats.currentEstimatedLoadKWh * multiplier * (0.9 + Math.random() * 0.2) : null,
        Forecast: idx >= currentMonth ? stats.currentEstimatedLoadKWh * multiplier : null,
      }
    });
  }, [stats.currentEstimatedLoadKWh]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-50 mb-6">AI Forecast Insights</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hourly Load Curve */}
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-50">Hourly Load Forecast (Actual vs Predicted)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val.toFixed(1)}kW`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }}
                    itemStyle={{ color: "#E2E8F0" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Predicted" stroke="#22D3EE" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Actual" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appliance Contribution */}
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-50">Appliance Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            {appliances.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">Add appliances to see distribution.</p>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applianceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {applianceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }}
                      itemStyle={{ color: "#E2E8F0" }}
                      formatter={(value: number) => [`${value.toFixed(1)} kWh`, "Consumption"]}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-50">Monthly Trend (Seasonal)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2b4c" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a0f18", border: "1px solid #1a2b4c", borderRadius: "8px" }}
                    cursor={{ fill: '#1a2b4c', opacity: 0.4 }}
                  />
                  <Legend />
                  <Bar dataKey="Consumption" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Forecast" fill="#10B981" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
