import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Appliance, ElectricityBill, HistoricalReport, HouseholdProfile } from "../types";
import { createHistoricalReport } from "./simulation-engine";

const defaultProfile: HouseholdProfile = {
  houseType: "2 BHK",
  adults: 2,
  children: 1,
  seniors: 0,
  state: "Maharashtra",
  city: "Pune",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      reports: [],
      activeReportId: null,

      setProfile: (profileUpdate) =>
        set((state) => ({
          profile: { ...state.profile, ...profileUpdate },
        })),

      generateGlobalSimulation: (bill: ElectricityBill) =>
        set((state) => {
          const newReport = createHistoricalReport(bill, state.profile);
          return {
            reports: [newReport, ...state.reports],
            activeReportId: newReport.id,
          };
        }),

      setActiveReport: (id: string) =>
        set(() => ({
          activeReportId: id,
        })),

      deleteReport: (id: string) =>
        set((state) => {
          const remainingReports = state.reports.filter((r) => r.id !== id);
          return {
            reports: remainingReports,
            activeReportId: state.activeReportId === id 
              ? (remainingReports[0]?.id || null) 
              : state.activeReportId,
          };
        }),

      addAppliance: (appliance) =>
        set((state) => {
          if (!state.activeReportId) return state;
          
          return {
            reports: state.reports.map(report => {
              if (report.id === state.activeReportId) {
                return { ...report, appliances: [...report.appliances, appliance] };
              }
              return report;
            })
          };
        }),

      updateAppliance: (id, updates) =>
        set((state) => {
          if (!state.activeReportId) return state;

          return {
            reports: state.reports.map(report => {
              if (report.id === state.activeReportId) {
                return {
                  ...report,
                  appliances: report.appliances.map(app => app.id === id ? { ...app, ...updates } : app)
                };
              }
              return report;
            })
          };
        }),

      removeAppliance: (id) =>
        set((state) => {
          if (!state.activeReportId) return state;

          return {
            reports: state.reports.map(report => {
              if (report.id === state.activeReportId) {
                return {
                  ...report,
                  appliances: report.appliances.filter(app => app.id !== id)
                };
              }
              return report;
            })
          };
        }),
    }),
    {
      name: "energy-ai-storage-v2", // Version bump to clear old state structure
    }
  )
);
