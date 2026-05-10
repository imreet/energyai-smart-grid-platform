import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (username === "admin" && password === "energy2024") {
      toast.success("Welcome back, Alex Thompson!");
      onLogin();
    } else {
      setError("Invalid credentials. Try admin / energy2024");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0B0F14 0%, #0E1520 50%, #0B1120 100%)",
      }}
    >
      {/* Background glow effects */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md mx-4" data-ocid="login.panel">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg, #22D3EE22, #3B82F622)",
              border: "1px solid #22D3EE44",
            }}
          >
            <Zap className="w-8 h-8" style={{ color: "#22D3EE" }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#E9EEF6" }}>
            EnergyAI
          </h1>
          <p
            className="text-sm leading-relaxed px-4"
            style={{ color: "#9AA7B6" }}
          >
            Load Forecasting for Energy Communities
            <br />
            <span className="text-xs">LSTM-XGBoost Hybrid Model</span>
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.05)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "#E9EEF6" }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-sm mb-2 block"
                style={{ color: "#9AA7B6" }}
              >
                Username
              </Label>
              <Input
                id="username"
                data-ocid="login.input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-11"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E9EEF6",
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm mb-2 block"
                style={{ color: "#9AA7B6" }}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-ocid="login.input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-11 pr-10"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#E9EEF6",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ color: "#9AA7B6" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm py-2 px-3 rounded-lg"
                data-ocid="login.error_state"
                style={{
                  color: "#EF4444",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="login.submit_button"
              disabled={loading}
              className="w-full h-11 font-semibold mt-2"
              style={{
                background: "linear-gradient(135deg, #22D3EE, #3B82F6)",
                color: "#0B0F14",
                border: "none",
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 p-3 rounded-lg text-xs"
            style={{
              background: "rgba(34,211,238,0.06)",
              border: "1px solid rgba(34,211,238,0.15)",
            }}
          >
            <p className="font-medium mb-1" style={{ color: "#22D3EE" }}>
              Demo Credentials
            </p>
            <p style={{ color: "#9AA7B6" }}>
              Username: <span style={{ color: "#E9EEF6" }}>admin</span>
            </p>
            <p style={{ color: "#9AA7B6" }}>
              Password: <span style={{ color: "#E9EEF6" }}>energy2024</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
