import type { Appliance, DashboardStats, HouseholdProfile } from "../types";

// Energy Calculation (kWh) = (Wattage × Hours × Quantity × Days) / 1000
export const calculateMonthlyApplianceLoad = (appliance: Appliance): number => {
  // Apply a small efficiency factor based on energy rating and age
  // 5 star = 1.0 (baseline for wattage given), 1 star = 1.2 (consumes 20% more than rated if old/inefficient)
  let efficiencyFactor = 1.0;
  if (appliance.energyRating < 5) {
    efficiencyFactor += (5 - appliance.energyRating) * 0.05;
  }
  if (appliance.isOld) {
    efficiencyFactor += 0.1;
  }

  const dailyLoadWh =
    appliance.wattage * appliance.hoursPerDay * appliance.quantity * efficiencyFactor;
  return (dailyLoadWh * 30) / 1000;
};

export const calculateTotalMonthlyLoad = (appliances: Appliance[]): number => {
  return appliances.reduce(
    (total, app) => total + calculateMonthlyApplianceLoad(app),
    0
  );
};

// Simplified Indian State Tariffs (Mock Data for simulation)
// These are approximate slab rates in INR per kWh
const TARIFF_SLABS: Record<string, { limit: number; rate: number }[]> = {
  Maharashtra: [
    { limit: 100, rate: 5.8 },
    { limit: 300, rate: 11.36 },
    { limit: 500, rate: 15.36 },
    { limit: Infinity, rate: 17.36 },
  ],
  Karnataka: [
    { limit: 100, rate: 4.75 },
    { limit: 200, rate: 7.0 },
    { limit: Infinity, rate: 8.96 },
  ],
  Delhi: [
    { limit: 200, rate: 3.0 },
    { limit: 400, rate: 4.5 },
    { limit: 800, rate: 6.5 },
    { limit: Infinity, rate: 7.0 },
  ],
  "Tamil Nadu": [
    { limit: 100, rate: 0 }, // First 100 units free
    { limit: 200, rate: 2.25 },
    { limit: 400, rate: 4.5 },
    { limit: 500, rate: 6.0 },
    { limit: Infinity, rate: 8.0 },
  ],
  Gujarat: [
    { limit: 50, rate: 3.05 },
    { limit: 200, rate: 3.5 },
    { limit: 250, rate: 4.15 },
    { limit: Infinity, rate: 5.2 },
  ],
};

export const calculateEstimatedBill = (
  units: number,
  state: string
): number => {
  const slabs = TARIFF_SLABS[state] || TARIFF_SLABS["Maharashtra"]; // Default to MH if not found
  let remainingUnits = units;
  let totalBill = 0;
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabRange = slab.limit - previousLimit;
    if (remainingUnits > slabRange) {
      totalBill += slabRange * slab.rate;
      remainingUnits -= slabRange;
    } else {
      totalBill += remainingUnits * slab.rate;
      break;
    }
    previousLimit = slab.limit;
  }

  // Add mock fixed charges based on load (~Rs 150 per kW of connected load)
  // Assuming 1 kW connected load for every 100 units as a rough mock
  const connectedLoadKW = Math.max(1, Math.ceil(units / 100));
  const fixedCharges = connectedLoadKW * 150;

  return totalBill + fixedCharges;
};

export const generateDashboardStats = (
  appliances: Appliance[],
  profile: HouseholdProfile
): DashboardStats => {
  const currentEstimatedLoadKWh = calculateTotalMonthlyLoad(appliances);
  const predictedMonthlyBill = calculateEstimatedBill(
    currentEstimatedLoadKWh,
    profile.state
  );

  // Carbon footprint: ~0.82 kg CO2 per kWh in India
  const carbonFootprintKg = currentEstimatedLoadKWh * 0.82;

  let peakLoadStatus: DashboardStats["peakLoadStatus"] = "Low";
  if (currentEstimatedLoadKWh > 800) peakLoadStatus = "Critical";
  else if (currentEstimatedLoadKWh > 500) peakLoadStatus = "High";
  else if (currentEstimatedLoadKWh > 300) peakLoadStatus = "Moderate";

  // Mock Efficiency Score (0-100)
  // Penalize for old appliances and low star ratings
  let score = 100;
  let deduction = 0;
  for (const app of appliances) {
    if (app.isOld) deduction += 5;
    deduction += (5 - app.energyRating) * 2;
  }
  // Penalize high usage per person
  const totalPeople = profile.adults + profile.children + profile.seniors;
  const unitsPerPerson = currentEstimatedLoadKWh / (totalPeople || 1);
  if (unitsPerPerson > 150) deduction += 15;
  else if (unitsPerPerson > 100) deduction += 10;

  const efficiencyScore = Math.max(10, Math.min(100, score - deduction));

  return {
    currentEstimatedLoadKWh,
    predictedMonthlyBill,
    carbonFootprintKg,
    peakLoadStatus,
    efficiencyScore,
  };
};
