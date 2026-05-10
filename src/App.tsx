import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { SimulationProvider } from "@/context/SimulationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ApplianceManagerPage from "@/pages/ApplianceManagerPage";
import BillUploadPage from "@/pages/BillUploadPage";
import DashboardPage from "@/pages/DashboardPage";
import DatasetAnalyticsLabPage from "@/pages/DatasetAnalyticsLabPage";
import ForecastInsightsPage from "@/pages/ForecastInsightsPage";
import HistoricalAnalysisPage from "@/pages/HistoricalAnalysisPage";
import OptimizationPage from "@/pages/OptimizationPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import SmartRecommendationsPage from "@/pages/SmartRecommendationsPage";
import { useState } from "react";

export type PageId =
  | "dashboard"
  | "bill-upload"
  | "appliance-manager"
  | "forecast-insights"
  | "dataset-analytics"
  | "energy-optimization"
  | "smart-recommendations"
  | "historical-analysis"
  | "reports"
  | "settings";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "bill-upload":
        return <BillUploadPage />;
      case "appliance-manager":
        return <ApplianceManagerPage />;
      case "forecast-insights":
        return <ForecastInsightsPage />;
      case "dataset-analytics":
        return <DatasetAnalyticsLabPage />;
      case "energy-optimization":
        return <OptimizationPage />;
      case "smart-recommendations":
        return <SmartRecommendationsPage />;
      case "historical-analysis":
        return <HistoricalAnalysisPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={() => setIsLoggedIn(false)}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <AppContent />
        <Toaster />
      </SimulationProvider>
    </ThemeProvider>
  );
}
