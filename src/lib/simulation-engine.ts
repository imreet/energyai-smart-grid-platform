import type { Appliance, DashboardStats, ElectricityBill, HistoricalReport, HouseholdProfile, SmartRecommendation } from "../types";
import { generateDashboardStats } from "./calculator";

// Simple uuid generation fallback if needed, or just use crypto
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const BASE_APPLIANCES = [
  { category: "Cooling", name: "Ceiling Fan", wattage: 70, quantity: 2, hoursPerDay: 12, energyRating: 4, isOld: false },
  { category: "Lighting", name: "LED Bulbs", wattage: 9, quantity: 4, hoursPerDay: 6, energyRating: 5, isOld: false },
];

export function generateRealisticAppliances(unitsConsumed: number): Appliance[] {
  let appliances: Appliance[] = BASE_APPLIANCES.map(a => ({ ...a, id: generateId() }));
  
  if (unitsConsumed < 150) {
    // Low consumption: just fans, basic lights, maybe a small TV
    appliances.push({ id: generateId(), category: "Entertainment", name: "Television", wattage: 60, quantity: 1, hoursPerDay: 4, energyRating: 4, isOld: false });
  } else if (unitsConsumed < 400) {
    // Medium consumption: fans, lights, TV, Refrigerator, maybe Washing Machine
    appliances[0].quantity = 3; // More fans
    appliances[1].quantity = 6; // More lights
    appliances.push({ id: generateId(), category: "Kitchen", name: "Refrigerator", wattage: 250, quantity: 1, hoursPerDay: 24, energyRating: 3, isOld: false });
    appliances.push({ id: generateId(), category: "Entertainment", name: "Television", wattage: 100, quantity: 1, hoursPerDay: 5, energyRating: 4, isOld: false });
    appliances.push({ id: generateId(), category: "Laundry", name: "Washing Machine", wattage: 500, quantity: 1, hoursPerDay: 1, energyRating: 4, isOld: false });
  } else if (unitsConsumed < 800) {
    // High consumption: Add ACs, Geyser, Microwave
    appliances[0].quantity = 4;
    appliances[1].quantity = 10;
    appliances.push({ id: generateId(), category: "Kitchen", name: "Refrigerator", wattage: 350, quantity: 1, hoursPerDay: 24, energyRating: 3, isOld: true });
    appliances.push({ id: generateId(), category: "Entertainment", name: "Television", wattage: 150, quantity: 2, hoursPerDay: 6, energyRating: 4, isOld: false });
    appliances.push({ id: generateId(), category: "Cooling", name: "Air Conditioner (1.5 Ton)", wattage: 1500, quantity: 1, hoursPerDay: 6, energyRating: 3, isOld: false });
    appliances.push({ id: generateId(), category: "Heating", name: "Water Geyser", wattage: 2000, quantity: 1, hoursPerDay: 1, energyRating: 4, isOld: false });
    appliances.push({ id: generateId(), category: "Kitchen", name: "Microwave", wattage: 1200, quantity: 1, hoursPerDay: 0.5, energyRating: 5, isOld: false });
  } else {
    // Extreme consumption: Multiple ACs, Heavy appliances, Desktop PCs
    appliances[0].quantity = 6;
    appliances[1].quantity = 15;
    appliances.push({ id: generateId(), category: "Kitchen", name: "Large Refrigerator", wattage: 500, quantity: 1, hoursPerDay: 24, energyRating: 3, isOld: true });
    appliances.push({ id: generateId(), category: "Entertainment", name: "Large TV", wattage: 200, quantity: 2, hoursPerDay: 8, energyRating: 4, isOld: false });
    appliances.push({ id: generateId(), category: "Cooling", name: "Air Conditioner (1.5 Ton)", wattage: 1500, quantity: 3, hoursPerDay: 8, energyRating: 3, isOld: false });
    appliances.push({ id: generateId(), category: "Heating", name: "Water Geyser", wattage: 2000, quantity: 2, hoursPerDay: 1.5, energyRating: 4, isOld: false });
    appliances.push({ id: generateId(), category: "Entertainment", name: "Gaming PC", wattage: 600, quantity: 1, hoursPerDay: 6, energyRating: 3, isOld: false });
  }

  // Adjust usage hours slightly to try and match unitsConsumed more closely
  // (Total kWh = wattage * hoursPerDay * quantity * 30 / 1000)
  let currentEstimated = appliances.reduce((sum, app) => sum + ((app.wattage * app.hoursPerDay * app.quantity * 30) / 1000), 0);
  
  // Scale hours if too far off
  if (currentEstimated > 0) {
    const scaleFactor = unitsConsumed / currentEstimated;
    appliances = appliances.map(app => {
      // Don't scale refrigerator past 24
      if (app.name.includes("Refrigerator")) return app;
      
      let newHours = app.hoursPerDay * scaleFactor;
      // Clamp hours to realistic values
      if (newHours > 16) newHours = 16;
      if (newHours < 0.5) newHours = 0.5;
      
      return { ...app, hoursPerDay: Number(newHours.toFixed(1)) };
    });
  }

  return appliances;
}

export function generateRecommendations(appliances: Appliance[], stats: DashboardStats): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];

  const hasAC = appliances.some(a => a.name.includes("Air Conditioner") || a.category === "Cooling" && a.wattage > 1000);
  const totalACHours = appliances.filter(a => a.name.includes("Air Conditioner")).reduce((sum, a) => sum + (a.hoursPerDay * a.quantity), 0);
  
  if (hasAC && totalACHours > 10) {
    recommendations.push({
      id: generateId(),
      title: "Optimize AC Temperature",
      description: "Set your AC to 24°C instead of lower temperatures. Every degree higher saves about 6% on cooling costs.",
      type: "Optimization",
      impact: "Save ~₹350/month"
    });
  }

  if (stats.currentEstimatedLoadKWh > 800) {
    recommendations.push({
      id: generateId(),
      title: "Rooftop Solar Viability",
      description: "Your household consumes significant energy. Installing a 3kW-5kW solar setup could drastically reduce your bills.",
      type: "Insight",
      impact: "Save up to 80% on bills"
    });
  }

  if (stats.currentEstimatedLoadKWh < 300) {
    recommendations.push({
      id: generateId(),
      title: "Excellent Efficiency",
      description: "Your household is performing better than 85% of similar households in your area. Keep up the good habits!",
      type: "Insight",
      impact: "Maintaining low carbon footprint"
    });
  }

  const hasOldAppliances = appliances.some(a => a.isOld);
  if (hasOldAppliances) {
    recommendations.push({
      id: generateId(),
      title: "Replace Aging Appliances",
      description: "You have appliances older than 5 years. Modern 5-star rated appliances consume up to 40% less energy.",
      type: "Optimization",
      impact: "Save ~₹200/month per device"
    });
  }

  const tvAndPC = appliances.filter(a => ["Television", "Gaming PC"].includes(a.name));
  if (tvAndPC.length > 0) {
    recommendations.push({
      id: generateId(),
      title: "Reduce Standby Power",
      description: "Several entertainment devices may be consuming phantom power overnight. Use smart plugs to cut power completely.",
      type: "Alert",
      impact: "Save ~₹100/month"
    });
  }

  return recommendations;
}

export function createHistoricalReport(bill: ElectricityBill, profile: HouseholdProfile): HistoricalReport {
  const appliances = generateRealisticAppliances(bill.unitsConsumed);
  
  // Create stats based on generated appliances
  let stats = generateDashboardStats(appliances, profile);
  
  // Overwrite the predicted bill to match the actual uploaded bill's amount
  // and load to match units consumed so Dashboard matches Bill precisely
  stats = {
    ...stats,
    predictedMonthlyBill: bill.totalAmount,
    currentEstimatedLoadKWh: bill.unitsConsumed,
  };

  const recommendations = generateRecommendations(appliances, stats);

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    bill,
    appliances,
    stats,
    recommendations
  };
}
