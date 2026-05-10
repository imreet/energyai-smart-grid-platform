import { CheckCircle } from "lucide-react";

const nodes = [
  {
    id: "kafka",
    label: "Apache Kafka",
    sub: "Message Broker",
    color: "#F59E0B",
    icon: "⚡",
  },
  {
    id: "logstash",
    label: "Logstash",
    sub: "Log Processing",
    color: "#22D3EE",
    icon: "🔄",
  },
  {
    id: "elastic",
    label: "Elasticsearch",
    sub: "Data Storage",
    color: "#3B82F6",
    icon: "🔍",
  },
  {
    id: "ml",
    label: "LSTM + XGBoost",
    sub: "ML Inference",
    color: "#A855F7",
    icon: "🧠",
  },
  {
    id: "api",
    label: "FastAPI",
    sub: "REST Backend",
    color: "#22C55E",
    icon: "⚙️",
  },
  {
    id: "react",
    label: "React Dashboard",
    sub: "Frontend UI",
    color: "#22D3EE",
    icon: "📊",
  },
];

const descriptions = [
  {
    step: "1. Kafka Ingestion",
    text: "Smart meter data is published to Kafka topics in real-time at ~100 messages/sec.",
  },
  {
    step: "2. Logstash Processing",
    text: "Logstash pipelines parse, filter, and enrich raw meter readings before storage.",
  },
  {
    step: "3. Elasticsearch Storage",
    text: "Processed data is indexed in Elasticsearch, enabling sub-millisecond query performance.",
  },
  {
    step: "4. ML Inference",
    text: "The bi-directional LSTM captures temporal dependencies; XGBoost handles peak load variations.",
  },
  {
    step: "5. FastAPI Backend",
    text: "RESTful API serves predictions, historical data, and alert management endpoints.",
  },
  {
    step: "6. React Dashboard",
    text: "Real-time visualization with Recharts, rendering forecasts and anomaly alerts for operators.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#E9EEF6" }}>
          System Architecture
        </h2>
        <p className="text-sm" style={{ color: "#9AA7B6" }}>
          End-to-end data pipeline from ingestion to visualization
        </p>
      </div>

      {/* Pipeline diagram */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        data-ocid="architecture.pipeline.panel"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2">
              <div
                className="flex flex-col items-center p-4 rounded-xl text-center w-32"
                style={{
                  background: `${node.color}12`,
                  border: `1px solid ${node.color}30`,
                }}
                data-ocid={`architecture.${node.id}.card`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2"
                  style={{ background: `${node.color}20` }}
                >
                  {node.icon}
                </div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: node.color }}
                >
                  {node.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#9AA7B6" }}>
                  {node.sub}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle
                    className="w-3 h-3"
                    style={{ color: "#22C55E" }}
                  />
                  <span className="text-xs" style={{ color: "#22C55E" }}>
                    Active
                  </span>
                </div>
              </div>

              {i < nodes.length - 1 && (
                <svg
                  width="28"
                  height="16"
                  viewBox="0 0 28 16"
                  fill="none"
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  <title>Arrow</title>
                  <path
                    d="M0 8 H20 M14 2 L24 8 L14 14"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {[
            "Real-time stream",
            "Pipeline",
            "Index & Query",
            "Inference",
            "REST API",
          ].map((label) => (
            <span
              key={label}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.05)", color: "#9AA7B6" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#E9EEF6" }}>
          Data Flow Description
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {descriptions.map((d) => (
            <div
              key={d.step}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "#22D3EE" }}
              >
                {d.step}
              </p>
              <p className="text-xs" style={{ color: "#9AA7B6" }}>
                {d.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          background: "#151C26",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: "#E9EEF6" }}>
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Python 3.10+", color: "#3B82F6" },
            { name: "PyTorch", color: "#EF4444" },
            { name: "XGBoost", color: "#F59E0B" },
            { name: "FastAPI", color: "#22C55E" },
            { name: "Apache Kafka", color: "#F59E0B" },
            { name: "Elasticsearch", color: "#22D3EE" },
            { name: "Logstash", color: "#3B82F6" },
            { name: "React.js", color: "#22D3EE" },
            { name: "Recharts", color: "#A855F7" },
            { name: "HuggingFace", color: "#F59E0B" },
          ].map((tech) => (
            <span
              key={tech.name}
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{
                background: `${tech.color}15`,
                color: tech.color,
                border: `1px solid ${tech.color}30`,
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
