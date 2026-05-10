import type { PageId } from "@/App";
import { useSimulation } from "@/context/SimulationContext";
import { useTheme } from "@/context/ThemeContext";
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  History,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems: {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "bill-upload",
    label: "Bill Upload",
    icon: <Upload className="w-4 h-4" />,
  },
  {
    id: "appliance-manager",
    label: "Appliance Manager",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "forecast-insights",
    label: "Forecast Insights",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "dataset-analytics",
    label: "Dataset Analytics Lab",
    icon: <Database className="w-4 h-4" />,
  },
  {
    id: "energy-optimization",
    label: "Energy Optimization",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "smart-recommendations",
    label: "Smart Recommendations",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  {
    id: "historical-analysis",
    label: "Historical Analysis",
    icon: <History className="w-4 h-4" />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileText className="w-4 h-4" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { simulationMode, setSimulationMode } = useSimulation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles: Record<PageId, string> = {
    dashboard: "Energy Dashboard",
    "bill-upload": "Bill & Consumption Upload",
    "appliance-manager": "Household Appliance Manager",
    "forecast-insights": "AI Forecast Insights",
    "dataset-analytics": "Dataset Analytics Lab",
    "energy-optimization": "Energy Optimization Strategy",
    "smart-recommendations": "Smart Recommendations",
    "historical-analysis": "Historical Analysis",
    reports: "Automated Reports",
    settings: "Household Profile & Settings",
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0f18] border-r border-[#1a2b4c]/30 z-20 relative">
      {/* Brand */}
      <div className="flex items-center gap-3 p-5 border-b border-[#1a2b4c]/30 bg-[#0a0f18]/80 backdrop-blur-md">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-base text-cyan-50">EnergyAI</span>
          <p className="text-xs text-blue-300/70">India Smart Grid</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] border border-cyan-500/20"
                  : "text-slate-400 hover:text-cyan-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <span
                className={`${active ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-500"}`}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-cyan-400" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="p-3 space-y-1 border-t border-[#1a2b4c]/30 bg-[#0a0f18]/80 backdrop-blur-md">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-slate-400 hover:text-cyan-200 hover:bg-slate-800/50"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050810] text-slate-200 font-sans relative">
      {/* Background Image Setup */}
      <div
        className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-[0.15]"
        style={{
          backgroundImage: "url(/bg-futuristic.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Subtle radial gradient to ensure readability */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(5,8,16,0)_0%,rgba(5,8,16,0.9)_100%)]" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full shadow-[4px_0_24px_rgba(0,0,0,0.6)] z-20">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10 relative">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0 bg-[#0a0f18]/80 backdrop-blur-xl border-b border-[#1a2b4c]/40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Open sidebar"
              className="lg:hidden text-slate-400 hover:text-cyan-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-blue-200 tracking-wide">
                {pageTitles[currentPage]}
              </h1>
              <p className="text-xs text-cyan-500/70 font-medium tracking-wider uppercase">
                AI Analytics Platform • Live
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              System Active
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] ring-2 ring-blue-400/20">
              U
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
