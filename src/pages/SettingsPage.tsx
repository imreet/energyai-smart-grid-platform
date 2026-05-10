import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATES = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
];

const HOUSE_TYPES = ["1 BHK", "2 BHK", "3 BHK", "Villa", "Apartment"];

export default function SettingsPage() {
  const { profile, setProfile } = useAppStore();
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    toast.success("Profile settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="bg-[#0a0f18]/80 border-[#1a2b4c]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-50">Household Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-400">House Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm ring-offset-background text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.houseType}
                onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}
              >
                {HOUSE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">State (For Tariff Calculation)</Label>
              <select
                className="flex h-10 w-full rounded-md border border-[#1a2b4c] bg-[#050810] px-3 py-2 text-sm ring-offset-background text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
              />
            </div>
          </div>

          <div className="border-t border-[#1a2b4c]/50 pt-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Number of Residents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-400">Adults</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                  className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Children</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                  className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Seniors</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.seniors}
                  onChange={(e) => setFormData({ ...formData, seniors: Number(e.target.value) })}
                  className="border-[#1a2b4c] bg-[#050810] text-slate-200 focus-visible:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
            >
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
