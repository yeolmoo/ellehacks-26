import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RedFlag = {
  title: string;
  severity: "low" | "medium" | "high";
  description: string;
  evidence: string[];
};

type Inconsistency = {
  type: "identity" | "job" | "location" | "payment" | "timeline" | "other";
  description: string;
  why_it_matters: string;
  suggested_questions: string[];
};

type NextStep = {
  category:
    | "verify_identity"
    | "payment_safety"
    | "safe_meeting"
    | "official_verification"
    | "stop_contact"
    | "reporting";
  steps: string[];
};

export type AnalysisReport = {
  scenario: "romance" | "marketplace" | "cra_tax" | "highway407_toll" | "pig_butchering" | "unknown";
  confidence: number;
  risk_level: "low" | "medium" | "high";
  summary: string;
  red_flags: RedFlag[];
  inconsistencies: Inconsistency[];
  next_steps: NextStep[];
  safety_notes: string[];
};

function labelScenario(s: AnalysisReport["scenario"]) {
  switch (s) {
    case "romance":
      return "Romance scam";
    case "marketplace":
      return "Marketplace scam (Kijiji/FB etc.)";
    case "cra_tax":
      return "CRA tax scam";
    case "highway407_toll":
      return "Highway 407 toll scam";
    case "pig_butchering":
      return "Investment scam (pig butchering)";
    default:
      return "Unknown / unclear";
  }
}

function labelCategory(c: NextStep["category"]) {
  switch (c) {
    case "verify_identity":
      return "Verify identity";
    case "payment_safety":
      return "Payment safety";
    case "safe_meeting":
      return "Safe meeting";
    case "official_verification":
      return "Official verification";
    case "stop_contact":
      return "Stop contact";
    case "reporting":
      return "Reporting";
    default:
      return c;
  }
}

function pillStyle(bg: string) {
  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    background: bg,
    border: "1px solid rgba(0,0,0,0.08)",
  } as const;
}

function severityColor(s: "low" | "medium" | "high") {
  if (s === "high") return "rgba(255, 0, 0, 0.10)";
  if (s === "medium") return "rgba(255, 165, 0, 0.12)";
  return "rgba(0, 128, 0, 0.10)";
}

function riskColor(s: "low" | "medium" | "high") {
  if (s === "high") return "rgba(255, 0, 0, 0.14)";
  if (s === "medium") return "rgba(255, 165, 0, 0.16)";
  return "rgba(0, 128, 0, 0.14)";
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function ReportPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const report = (loc.state as any)?.report as AnalysisReport | undefined;

  if (!report) {
    return (
      <div style={{ maxWidth: 880, margin: "24px auto", padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>No report found</h2>
        <p style={{ marginBottom: 16 }}>
          This page needs analysis results passed via navigation state.
        </p>
        <button onClick={() => nav("/")} style={{ padding: "10px 14px" }}>
          Back to analyzer
        </button>
      </div>
    );
  }

  const confidencePct = Math.round(clampPct(report.confidence) * 100);

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0 }}>Safety Analysis Report</h2>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={pillStyle(riskColor(report.risk_level))}>
              Risk: {report.risk_level.toUpperCase()}
            </span>
            <span style={pillStyle("rgba(0,0,0,0.06)")}>
              Scenario: {labelScenario(report.scenario)}
            </span>
            <span style={pillStyle("rgba(0,0,0,0.06)")}>
              Confidence: {confidencePct}%
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => nav("/")} style={{ padding: "10px 14px" }}>
            New check
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
            }}
            style={{ padding: "10px 14px" }}
          >
            Copy JSON
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        <p style={{ marginBottom: 0, lineHeight: 1.5 }}>{report.summary || "No summary provided."}</p>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Red flags</h3>

          {report.red_flags?.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {report.red_flags.map((rf, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 10, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 700 }}>{rf.title}</div>
                    <span style={pillStyle(severityColor(rf.severity))}>
                      {rf.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, lineHeight: 1.5 }}>{rf.description}</div>

                  {rf.evidence?.length ? (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Evidence</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {rf.evidence.map((e, i) => (
                          <li key={i} style={{ marginBottom: 6, lineHeight: 1.4 }}>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginBottom: 0, opacity: 0.8 }}>No red flags detected from the provided info.</p>
          )}
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Inconsistencies to check</h3>

          {report.inconsistencies?.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {report.inconsistencies.map((inc, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 10, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{inc.type}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>What seems off</div>
                    <div style={{ lineHeight: 1.5 }}>{inc.description}</div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>Why it matters</div>
                    <div style={{ lineHeight: 1.5 }}>{inc.why_it_matters}</div>
                  </div>

                  {inc.suggested_questions?.length ? (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Suggested questions</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {inc.suggested_questions.map((q, i) => (
                          <li key={i} style={{ marginBottom: 6, lineHeight: 1.4 }}>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginBottom: 0, opacity: 0.8 }}>No inconsistencies listed.</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Next steps</h3>

        {report.next_steps?.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {report.next_steps.map((ns, idx) => (
              <div key={idx} style={{ padding: 12, borderRadius: 10, border: "1px solid #eee" }}>
                <div style={{ fontWeight: 800 }}>{labelCategory(ns.category)}</div>
                <ol style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
                  {(ns.steps || []).map((s, i) => (
                    <li key={i} style={{ marginBottom: 6, lineHeight: 1.4 }}>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginBottom: 0, opacity: 0.8 }}>No next steps provided.</p>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Safety notes</h3>
        {report.safety_notes?.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {report.safety_notes.map((s, i) => (
              <li key={i} style={{ marginBottom: 6, lineHeight: 1.4 }}>
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginBottom: 0, opacity: 0.8 }}>No safety notes.</p>
        )}
      </div>
    </div>
  );
}
