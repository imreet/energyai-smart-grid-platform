import { ElectricityBill } from "../types";

const ELECTRICITY_BOARDS = [
  "MSEDCL",
  "BESCOM",
  "TANGEDCO",
  "Adani Electricity",
  "Tata Power",
  "BSES Rajdhani",
  "Torrent Power",
];

const TARIFF_CATEGORIES = [
  "LT-1 Residential",
  "Domestic LT",
  "LT-I(A)",
  "LT-I(B)",
  "Residential-Normal",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomBillData(): ElectricityBill {
  const unitsConsumed = getRandomInt(100, 1200);
  const fixedCharges = getRandomInt(100, 800);
  
  // Realistically calculate energy charges to make sense with units
  let energyRate = 5;
  if (unitsConsumed > 300) energyRate = 7;
  if (unitsConsumed > 600) energyRate = 9;
  if (unitsConsumed > 900) energyRate = 12;

  const energyCharges = unitsConsumed * energyRate;
  const totalAmount = fixedCharges + energyCharges;

  const boardName = ELECTRICITY_BOARDS[getRandomInt(0, ELECTRICITY_BOARDS.length - 1)];
  const tariffCategory = TARIFF_CATEGORIES[getRandomInt(0, TARIFF_CATEGORIES.length - 1)];
  
  const consumerNumber = Array.from({ length: 10 }, () => getRandomInt(0, 9)).join("");
  
  const currentYear = new Date().getFullYear();
  const billingMonth = `${MONTHS[getRandomInt(0, MONTHS.length - 1)]} ${currentYear}`;
  
  // Due date typically 15-20 days from billing date
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + getRandomInt(5, 15));
  const dueDate = dueDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  let peakUsageStatus = "Normal";
  if (unitsConsumed > 800) peakUsageStatus = "High";
  else if (unitsConsumed > 500) peakUsageStatus = "Moderate";
  else if (unitsConsumed < 250) peakUsageStatus = "Low";

  const insights: string[] = [];
  if (unitsConsumed > 800) {
    insights.push("High Consumption Alert");
    insights.push("Solar Recommendation Eligible");
  } else if (unitsConsumed > 500) {
    insights.push("Peak Usage Detected");
  } else if (unitsConsumed < 300) {
    insights.push("Efficient Consumption");
  }

  return {
    consumerNumber,
    billingMonth,
    unitsConsumed,
    totalAmount,
    fixedCharges,
    energyCharges,
    boardName,
    dueDate,
    tariffCategory,
    peakUsageStatus,
    insights,
  };
}
