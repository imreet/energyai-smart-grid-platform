import { featureImportance, lossData, modelComparison } from "@/lib/dummyData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const explanations = [
  {
    reason: "Hour of Day (18:00) matches historical evening peak pattern",
    weight: "High",
  },
  {
    reason: "Previous hour load was already elevated at 597 MW",
    weight: "High",
  },
  {
    reason: "Temperature forecast: 32\u00b0C \u2014 above seasonal average",
    weight: "Medium",
  },
  {
    reason: "Tuesday workday \u2014 historically 8% above weekend baseline",
    weight: "Medium",
  },
  { reason: "No holiday flag detected for this date", weight: "Low" },
];

export default function ModelInsightsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#E9EEF6" }}>
          Model Insights
        </h2>
        <p className="text-sm" style={{ color: "#9AA7B6" }}>
          LSTM-XGBoost hybrid model analysis and explainability
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div
          className="rounded-xl p-5"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          data-ocid="insights.features.panel"
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#E9EEF6" }}
          >
            XGBoost Feature Importance
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={featureImportance}
              layout="vertical"
              margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#9AA7B6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              />
              <YAxis
                dataKey="feature"
                type="category"
                tick={{ fill: "#9AA7B6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A2230",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#E9EEF6",
                }}
                formatter={(v: number) => [
                  `${(v * 100).toFixed(1)}%`,
                  "Importance",
                ]}
              />
              <Bar dataKey="importance" fill="#22D3EE" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          data-ocid="insights.loss.panel"
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#E9EEF6" }}
          >
            LSTM Training Loss
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={lossData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="epoch"
                tick={{ fill: "#9AA7B6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#9AA7B6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
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
                dataKey="trainLoss"
                name="Train Loss"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="valLoss"
                name="Val Loss"
                stroke="#22D3EE"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        data-ocid="insights.explain.panel"
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: "#E9EEF6" }}>
          Why was Peak Load Predicted?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-3" style={{ color: "#9AA7B6" }}>
              The hybrid model predicted a peak of{" "}
              <span style={{ color: "#EF4444" }}>621 MW at 18:00</span> based
              on:
            </p>
            <ul className="space-y-2">
              {explanations.map((item) => (
                <li
                  key={item.reason}
                  className="flex items-start gap-2 text-xs"
                >
                  <span
                    className="mt-0.5 px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0"
                    style={{
                      background:
                        item.weight === "High"
                          ? "rgba(239,68,68,0.15)"
                          : item.weight === "Medium"
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(34,197,94,0.15)",
                      color:
                        item.weight === "High"
                          ? "#EF4444"
                          : item.weight === "Medium"
                            ? "#F59E0B"
                            : "#22C55E",
                    }}
                  >
                    {item.weight}
                  </span>
                  <span style={{ color: "#9AA7B6" }}>{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="flex flex-col items-center justify-center rounded-xl p-6"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="text-xs mb-3" style={{ color: "#9AA7B6" }}>
              Model Confidence Score
            </p>
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background:
                  "conic-gradient(#22D3EE 0deg, #22D3EE 320deg, rgba(255,255,255,0.08) 320deg)",
                boxShadow: "0 0 24px rgba(34,211,238,0.2)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                style={{ background: "#151C26" }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#22D3EE" }}
                >
                  89%
                </span>
                <span className="text-xs" style={{ color: "#9AA7B6" }}>
                  confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        data-ocid="insights.comparison.table"
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#E9EEF6" }}>
          Model Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Model", "MAE (MW)", "RMSE (MW)", "R\u00b2"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-6 text-xs font-medium"
                    style={{ color: "#9AA7B6" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelComparison.map((row, i) => (
                <tr
                  key={row.model}
                  data-ocid={`insights.comparison.row.${i + 1}`}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="py-3 pr-6">
                    <span
                      className="font-medium text-xs"
                      style={{
                        color: row.model.includes("Hybrid")
                          ? "#22D3EE"
                          : "#E9EEF6",
                      }}
                    >
                      {row.model}
                    </span>
                    {row.model.includes("Hybrid") && (
                      <span
                        className="ml-2 text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(34,211,238,0.15)",
                          color: "#22D3EE",
                        }}
                      >
                        Best
                      </span>
                    )}
                  </td>
                  <td
                    className="py-3 pr-6 text-xs"
                    style={{ color: row.mae < 13 ? "#22C55E" : "#E9EEF6" }}
                  >
                    {row.mae}
                  </td>
                  <td
                    className="py-3 pr-6 text-xs"
                    style={{ color: row.rmse < 19 ? "#22C55E" : "#E9EEF6" }}
                  >
                    {row.rmse}
                  </td>
                  <td
                    className="py-3 text-xs"
                    style={{ color: row.r2 > 0.95 ? "#22C55E" : "#E9EEF6" }}
                  >
                    {row.r2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
