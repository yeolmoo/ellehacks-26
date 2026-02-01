import React from "react";

type AnalysisResult = {
  summary: string;
  risk_level: "low" | "medium" | "high";
  confidence: number; // 0 ~ 1
  red_flags: string[];
  inconsistencies: string[];
  next_steps: string[];
};

function confidenceLabel(c: number) {
  if (c >= 0.8) return "High confidence in this assessment.";
  if (c >= 0.5) return "Moderate confidence based on available information.";
  if (c > 0) return "Low confidence due to limited information.";
  return "No confidence. Insufficient data was provided.";
}

function riskColor(level: AnalysisResult["risk_level"]) {
  if (level === "high") return "#dc2626";   // red
  if (level === "medium") return "#f59e0b"; // orange
  return "#16a34a";                         // green
}

export default function ReportPage({ result }: { result: AnalysisResult }) {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Safety Analysis Report</h1>

      {/* Risk Level */}
      <section style={styles.section}>
        <h2>Risk Level</h2>
        <span
          style={{
            ...styles.badge,
            backgroundColor: riskColor(result.risk_level),
          }}
        >
          {result.risk_level.toUpperCase()}
        </span>
      </section>

      {/* Confidence */}
      <section style={styles.section}>
        <h2>Confidence Level</h2>

        <strong>{confidencePercent}%</strong>

        <div style={styles.confidenceBar}>
          <div
            style={{
              ...styles.confidenceFill,
              width: `${confidencePercent}%`,
            }}
          />
        </div>

        <p style={styles.muted}>
          {confidenceLabel(result.confidence)}
        </p>
      </section>

      {/* Summary */}
      <section style={styles.section}>
        <h2>Summary</h2>
        <p>{result.summary}</p>
      </section>

      {/* Red Flags */}
      <section style={styles.section}>
        <h2>Red Flags</h2>
        {result.red_flags.length === 0 ? (
          <p style={styles.muted}>No red flags detected.</p>
        ) : (
          <ul>
            {result.red_flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Inconsistencies */}
      <section style={styles.section}>
        <h2>Inconsistencies</h2>
        {result.inconsistencies.length === 0 ? (
          <p style={styles.muted}>No inconsistencies found.</p>
        ) : (
          <ul>
            {result.inconsistencies.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Next Steps */}
      <section style={styles.section}>
        <h2>Recommended Next Steps</h2>
        <ol>
          {result.next_steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------- styles ---------- */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 720,
    margin: "40px auto",
    padding: 24,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: 1.6,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
  },
  confidenceBar: {
    width: "100%",
    height: 10,
    background: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 6,
  },
  confidenceFill: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    transition: "width 0.4s ease",
  },
  muted: {
    color: "#6b7280",
    fontSize: 14,
  },
};
