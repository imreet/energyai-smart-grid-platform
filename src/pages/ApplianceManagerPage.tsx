import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import type { Appliance } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const APPLIANCE_PRESETS = [
  { category: "Cooling", name: "Air Conditioner (1.5 Ton)", wattage: 1500 },
  { category: "Cooling", name: "Ceiling Fan", wattage: 70 },
  { category: "Kitchen", name: "Refrigerator", wattage: 250 },
  { category: "Kitchen", name: "Microwave", wattage: 1200 },
  { category: "Laundry", name: "Washing Machine", wattage: 500 },
  { category: "Entertainment", name: "Television", wattage: 100 },
];

export default function ApplianceManagerPage() {
  const { reports, activeReportId, addAppliance, removeAppliance } = useAppStore();
  const activeReport = reports.find(r => r.id === activeReportId);
  const appliances = activeReport?.appliances || [];
  const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({
    category: "Cooling",
    name: "Air Conditioner (1.5 Ton)",
    wattage: 1500,
    quantity: 1,
    hoursPerDay: 8,
    energyRating: 5,
    isOld: false,
  });

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = APPLIANCE_PRESETS.find((p) => p.name === e.target.value);
    if (preset) {
      setNewAppliance({
        ...newAppliance,
        category: preset.category,
        name: preset.name,
        wattage: preset.wattage,
      });
    }
  };

  const handleAdd = () => {
    addAppliance({
      id: Date.now().toString(),
      ...(newAppliance as Appliance),
    });
  };

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl text-slate-300">No Simulation Active</h2>
        <p className="text-slate-500">Please upload a bill to manage appliances for the current household simulation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-50">Add New Appliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-400">Preset Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm ring-offset-background text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={newAppliance.name}
                onChange={handlePresetChange}
              >
                {APPLIANCE_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Wattage (W)</Label>
              <Input
                type="number"
                value={newAppliance.wattage}
                onChange={(e) => setNewAppliance({ ...newAppliance, wattage: Number(e.target.value) })}
                className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Quantity</Label>
              <Input
                type="number"
                value={newAppliance.quantity}
                onChange={(e) => setNewAppliance({ ...newAppliance, quantity: Number(e.target.value) })}
                className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Hours / Day</Label>
              <Input
                type="number"
                value={newAppliance.hoursPerDay}
                onChange={(e) => setNewAppliance({ ...newAppliance, hoursPerDay: Number(e.target.value) })}
                className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Energy Rating (Stars)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={newAppliance.energyRating}
                onChange={(e) => setNewAppliance({ ...newAppliance, energyRating: Number(e.target.value) })}
                className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="space-y-2 flex items-center h-full pt-6">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAppliance.isOld}
                  onChange={(e) => setNewAppliance({ ...newAppliance, isOld: e.target.checked })}
                  className="rounded border-[#1a2b4c] bg-[#050810] text-cyan-500 focus:ring-cyan-500"
                />
                Is it an old appliance? (&gt;5 years)
              </label>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={handleAdd}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Appliance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-50">Configured Appliances ({appliances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {appliances.length === 0 ? (
            <p className="text-slate-500 text-sm">No appliances added yet. Add your appliances above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-[#050810]/50 border-b border-[#1a2b4c]">
                  <tr>
                    <th className="px-4 py-3">Appliance</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Wattage</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Usage</th>
                    <th className="px-4 py-3">Est. Monthly KWh</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appliances.map((app) => (
                    <tr key={app.id} className="border-b border-[#1a2b4c]/50 hover:bg-[#1a2b4c]/20">
                      <td className="px-4 py-4 font-medium text-slate-200">{app.name}</td>
                      <td className="px-4 py-4 text-slate-400">{app.category}</td>
                      <td className="px-4 py-4 text-slate-400">{app.wattage}W</td>
                      <td className="px-4 py-4 text-slate-400">{app.quantity}</td>
                      <td className="px-4 py-4 text-slate-400">{app.hoursPerDay} hrs/day</td>
                      <td className="px-4 py-4 text-cyan-400 font-bold">
                        {((app.wattage * app.hoursPerDay * 30 * app.quantity) / 1000).toFixed(1)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAppliance(app.id)}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
