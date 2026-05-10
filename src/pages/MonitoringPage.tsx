import { useSimulation } from "@/context/SimulationContext";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  t: string;
  load: number;
  predicted: number;
}

function generatePoint(): DataPoint {
  const now = new Date();
  const h = now.getHours();
  let base = 400;
  if (h >= 6 && h < 9) base = 450;
  else if (h >= 9 && h < 17) base = 530;
  else if (h >= 17 && h < 21) base = 590;
  else if (h < 6) base = 310;
  const load = Math.round(base + (Math.random() - 0.5) * 40);
  return {
    t: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    load,
    predicted: Math.round(load + (Math.random() - 0.5) * 20),
  };
}

const statuses = [
  { label: "Kafka Stream", status: "Active", color: "#22C55E" },
  { label: "Preprocessing", status: "Processing", color: "#F59E0B" },
  { label: "Model Inference", status: "Active", color: "#22C55E" },
  { label: "API Gateway", status: "Active", color: "#22C55E" },
];

export default function MonitoringPage() {
  const { simulationMode } = useSimulation();
  const [data, setData] = useState<DataPoint[]>(() =>
    Array.from({ length: 20 }, () => generatePoint()),
  );
  const [msgPerSec, setMsgPerSec] = useState(0);
  const [latency, setLatency] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!simulationMode) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setData((prev) => [...prev.slice(-29), generatePoint()]);
      setMsgPerSec(Math.floor(80 + Math.random() * 40));
      setLatency(Math.floor(12 + Math.random() * 8));
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simulationMode]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#E9EEF6" }}>
          Real-Time Monitoring
        </h2>
        <p className="text-sm" style={{ color: "#9AA7B6" }}>
          Live data stream from Kafka ingestion pipeline
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: "#151C26",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            data-ocid="monitor.status.card"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: simulationMode ? s.color : "#9AA7B6",
                boxShadow:
                  simulationMode && s.color === "#22C55E"
                    ? `0 0 6px ${s.color}`
                    : "none",
              }}
            />
            <div>
              <p className="text-xs font-medium" style={{ color: "#E9EEF6" }}>
                {s.label}
              </p>
              <p
                className="text-xs"
                style={{ color: simulationMode ? s.color : "#9AA7B6" }}
              >
                {simulationMode ? s.status : "Paused"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          data-ocid="monitor.metrics.panel"
        >
          <p className="text-xs" style={{ color: "#9AA7B6" }}>
            Messages / sec
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#22D3EE" }}>
            {simulationMode ? msgPerSec : 0}
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-xs" style={{ color: "#9AA7B6" }}>
            Data Latency
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#F59E0B" }}>
            {simulationMode ? latency : 0} ms
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        data-ocid="monitor.chart.panel"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "#E9EEF6" }}>
            Live Load Stream (Last 30 readings)
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: simulationMode ? "#22C55E" : "#9AA7B6" }}
            />
            <span
              className="text-xs"
              style={{ color: simulationMode ? "#22C55E" : "#9AA7B6" }}
            >
              {simulationMode ? "LIVE" : "PAUSED"}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="t"
              tick={{ fill: "#9AA7B6", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: "#9AA7B6", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[200, 700]}
            />
            <Tooltip
              contentStyle={{
                background: "#1A2230",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#E9EEF6",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9AA7B6" }} />
            <Line
              type="monotone"
              dataKey="load"
              name="Actual (MW)"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted (MW)"
              stroke="#22D3EE"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
