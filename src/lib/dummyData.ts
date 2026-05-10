export interface LoadDataPoint {
  time: string;
  actual: number;
  predicted: number;
}

function generateLoad(hourOfDay: number): number {
  const h = hourOfDay % 24;
  let base: number;
  if (h >= 0 && h < 6) {
    base = 280 + Math.random() * 60;
  } else if (h >= 6 && h < 9) {
    base = 340 + (h - 6) * 58 + Math.random() * 30;
  } else if (h >= 9 && h < 17) {
    base = 480 + Math.random() * 100;
  } else if (h >= 17 && h < 21) {
    base = 560 + Math.random() * 70;
  } else {
    base = 500 - (h - 21) * 55 + Math.random() * 30;
  }
  return Math.round(base);
}

const now = new Date();
now.setMinutes(0, 0, 0);

export const forecastData: LoadDataPoint[] = Array.from(
  { length: 48 },
  (_, i) => {
    const d = new Date(now.getTime() - (24 - i) * 3600000);
    const actual = generateLoad(d.getHours());
    const noise = Math.round((Math.random() - 0.5) * 30);
    return {
      time: `${String(d.getHours()).padStart(2, "0")}:00`,
      actual,
      predicted: actual + noise,
    };
  },
);

export const featureImportance = [
  { feature: "Hour of Day", importance: 0.31 },
  { feature: "Prev Hour Load", importance: 0.27 },
  { feature: "Day of Week", importance: 0.18 },
  { feature: "Temperature", importance: 0.12 },
  { feature: "Holiday Flag", importance: 0.07 },
  { feature: "Month", importance: 0.03 },
  { feature: "Humidity", importance: 0.02 },
];

export const lossData = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  trainLoss: Number.parseFloat(
    (0.45 * Math.exp(-i * 0.07) + 0.02 + Math.random() * 0.01).toFixed(4),
  ),
  valLoss: Number.parseFloat(
    (0.52 * Math.exp(-i * 0.065) + 0.03 + Math.random() * 0.015).toFixed(4),
  ),
}));

export const consumptionBreakdown = [
  { name: "Residential", value: 42 },
  { name: "Commercial", value: 28 },
  { name: "Industrial", value: 19 },
  { name: "Public", value: 11 },
];

export const topConsumers = [
  { name: "District A", load: 94 },
  { name: "District B", load: 78 },
  { name: "Industrial Zone", load: 65 },
  { name: "Commercial Hub", load: 54 },
  { name: "District C", load: 41 },
];

export const communityPerformance = [
  { name: "Northside", efficiency: 92 },
  { name: "Westgate", efficiency: 87 },
  { name: "Central", efficiency: 83 },
  { name: "Eastview", efficiency: 78 },
  { name: "Southpark", efficiency: 71 },
];

export const modelComparison = [
  { model: "LSTM", mae: 15.2, rmse: 22.1, r2: 0.91 },
  { model: "XGBoost", mae: 13.8, rmse: 20.4, r2: 0.93 },
  { model: "Hybrid (LSTM+XGBoost)", mae: 12.4, rmse: 18.7, r2: 0.97 },
];

export const demoAlerts = [
  {
    severity: "high",
    message: "Peak overload predicted: 621 MW at 18:00",
    timestamp: "2026-03-30T15:30:00Z",
  },
  {
    severity: "high",
    message: "Critical threshold exceeded: 608 MW at 19:00",
    timestamp: "2026-03-30T14:00:00Z",
  },
  {
    severity: "medium",
    message: "Elevated load forecast: 587 MW at 17:30",
    timestamp: "2026-03-30T12:00:00Z",
  },
  {
    severity: "medium",
    message: "Unusual consumption spike in District A",
    timestamp: "2026-03-30T10:00:00Z",
  },
  {
    severity: "low",
    message: "Minor deviation from baseline: +3.2% at 14:00",
    timestamp: "2026-03-30T08:00:00Z",
  },
];
