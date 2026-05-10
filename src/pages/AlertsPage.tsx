import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAcknowledgeAlert,
  useAddAlert,
  useAllAlerts,
} from "@/hooks/useQueries";
import { demoAlerts } from "@/lib/dummyData";
import { AlertTriangle, Bell, CheckCircle, Filter, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Severity = "all" | "high" | "medium" | "low";

function severityColor(s: string) {
  if (s === "high")
    return {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.25)",
      text: "#EF4444",
    };
  if (s === "medium")
    return {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      text: "#F59E0B",
    };
  return {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    text: "#22C55E",
  };
}

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useAllAlerts();
  const { mutate: addAlert } = useAddAlert();
  const { mutate: acknowledgeAlert } = useAcknowledgeAlert();
  const [filter, setFilter] = useState<Severity>("all");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!seeded && !isLoading && alerts.length === 0) {
      setSeeded(true);
      for (const a of demoAlerts) {
        addAlert({ severity: a.severity, message: a.message });
      }
    }
  }, [seeded, isLoading, alerts.length, addAlert]);

  const filtered =
    filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const counts = {
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  };

  const handleAck = (id: bigint) => {
    acknowledgeAlert(id, {
      onSuccess: () => toast.success("Alert acknowledged"),
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#E9EEF6" }}>
          Alerts &amp; Notifications
        </h2>
        <p className="text-sm" style={{ color: "#9AA7B6" }}>
          Peak load predictions and system warnings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alert list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter bar */}
          <div
            className="flex items-center gap-2"
            data-ocid="alerts.filter.tab"
          >
            <Filter className="w-4 h-4" style={{ color: "#9AA7B6" }} />
            {(["all", "high", "medium", "low"] as Severity[]).map((f) => (
              <button
                key={f}
                type="button"
                data-ocid={`alerts.filter.${f}.tab`}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background:
                    filter === f
                      ? "rgba(34,211,238,0.15)"
                      : "rgba(255,255,255,0.05)",
                  color: filter === f ? "#22D3EE" : "#9AA7B6",
                  border: `1px solid ${filter === f ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div
              data-ocid="alerts.loading_state"
              className="text-center py-8"
              style={{ color: "#9AA7B6" }}
            >
              Loading alerts...
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="alerts.empty_state"
              className="rounded-xl p-8 text-center"
              style={{
                background: "#151C26",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Bell
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: "rgba(255,255,255,0.15)" }}
              />
              <p style={{ color: "#9AA7B6" }}>No alerts found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((alert, i) => {
                const c = severityColor(alert.severity);
                return (
                  <div
                    key={String(alert.id)}
                    data-ocid={`alerts.item.${i + 1}`}
                    className="rounded-xl p-4 flex items-start justify-between gap-3"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {alert.severity === "low" ? (
                        <Info
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: c.text }}
                        />
                      ) : (
                        <AlertTriangle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: c.text }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className="text-xs capitalize"
                            style={{
                              background: c.bg,
                              color: c.text,
                              border: `1px solid ${c.border}`,
                            }}
                          >
                            {alert.severity}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge
                              className="text-xs"
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                color: "#9AA7B6",
                              }}
                            >
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "#E9EEF6" }}>
                          {alert.message}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#9AA7B6" }}
                        >
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        data-ocid={`alerts.item.${i + 1}.confirm_button`}
                        size="sm"
                        onClick={() => handleAck(alert.id)}
                        className="text-xs h-7 flex-shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          color: "#9AA7B6",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Acknowledge
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary panel */}
        <div
          className="rounded-xl p-5 h-fit"
          style={{
            background: "#151C26",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          data-ocid="alerts.summary.panel"
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#E9EEF6" }}
          >
            Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: "Critical", count: counts.high, color: "#EF4444" },
              { label: "Warning", count: counts.medium, color: "#F59E0B" },
              { label: "Info", count: counts.low, color: "#22C55E" },
              { label: "Total", count: alerts.length, color: "#22D3EE" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm" style={{ color: "#9AA7B6" }}>
                  {item.label}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: item.color }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "#9AA7B6" }}>
              {alerts.filter((a) => a.acknowledged).length} of {alerts.length}{" "}
              acknowledged
            </p>
            <div
              className="h-1.5 rounded-full mt-2"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width:
                    alerts.length > 0
                      ? `${(alerts.filter((a) => a.acknowledged).length / alerts.length) * 100}%`
                      : "0%",
                  background: "#22C55E",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
