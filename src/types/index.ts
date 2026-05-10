export interface HouseholdProfile {
  houseType: string;
  adults: number;
  children: number;
  seniors: number;
  state: string;
  city: string;
}

export interface Appliance {
  id: string;
  category: string;
  name: string;
  quantity: number;
  wattage: number; // in Watts
  hoursPerDay: number;
  energyRating: number; // 1-5 stars
  isOld: boolean;
}

export interface ElectricityBill {
  consumerNumber: string;
  billingMonth: string;
  unitsConsumed: number;
  totalAmount: number;
  fixedCharges: number;
  energyCharges: number;
  boardName: string;
  dueDate: string;
  tariffCategory: string;
  peakUsageStatus: string;
  insights: string[];
}

export interface DashboardStats {
  currentEstimatedLoadKWh: number; // Monthly
  predictedMonthlyBill: number;
  carbonFootprintKg: number;
  peakLoadStatus: "Low" | "Moderate" | "High" | "Critical";
  efficiencyScore: number; // 0-100
}

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  type: "Optimization" | "Alert" | "Insight";
  impact: string; // e.g., "Save ₹200/month"
}

export interface HistoricalReport {
  id: string;
  timestamp: string;
  bill: ElectricityBill;
  appliances: Appliance[];
  stats: DashboardStats;
  recommendations: SmartRecommendation[];
}

export interface AppState {
  profile: HouseholdProfile;
  reports: HistoricalReport[];
  activeReportId: string | null;
  
  // Actions
  setProfile: (profile: Partial<HouseholdProfile>) => void;
  generateGlobalSimulation: (bill: ElectricityBill) => void;
  setActiveReport: (id: string) => void;
  deleteReport: (id: string) => void;
  
  // Appliance Actions (acts on activeReport)
  addAppliance: (appliance: Appliance) => void;
  updateAppliance: (id: string, updates: Partial<Appliance>) => void;
  removeAppliance: (id: string) => void;
}
