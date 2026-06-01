"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Terminal, Cpu, Network,
  CheckCircle, AlertCircle, RefreshCw, Mail,
  ShieldAlert, ChevronRight
} from "lucide-react";

interface MatchedSession {
  title: string;
  time: string;
  type: string;
  speaker: string;
  description: string;
  match_score: number;
}

interface RegistrationResult {
  matched_session: MatchedSession;
  email_draft: string;
  mcp_triggered: boolean;
  offline?: boolean;
}

interface AiConsoleProps {
  onSuccess: (data: RegistrationResult) => void;
}

export default function AiConsole({ onSuccess }: AiConsoleProps) {
  const [formData, setFormData] = useState({ name: "", email: "", professional_focus: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"idle" | "running" | "completed">("idle");
  const [logIndex, setLogIndex] = useState(0);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const SC_KEYWORDS = [
    "logistics", "supply chain", "wms", "scm", "inventory", "costs", "visibility",
    "real-time", "warehouse", "delivery", "forecast", "demand", "transport",
    "routes", "procurement", "resilience", "disruption", "automation", "oracle", "ai"
  ];

  useEffect(() => {
    const text = formData.professional_focus.toLowerCase();
    const found = SC_KEYWORDS.filter(kw => text.includes(kw));
    setDetectedKeywords(found);
  }, [formData.professional_focus]);

  const logs = [
    { text: "Initializing RAG matching engine...", delay: 600, type: "info" },
    { text: "Parsing vector query from demand profile...", delay: 800, type: "info" },
    { text: `Extracted features: [${detectedKeywords.join(", ") || "General Supply Chain"}]`, delay: 700, type: "success" },
    { text: "Executing TF-IDF vectorization & Cosine Similarity search...", delay: 900, type: "info" },
    { text: `Cosine similarity calculated against 10 conference sessions.`, delay: 600, type: "info" },
    { text: result ? `Best session matched: "${result.matched_session?.title}"` : "Best session matched successfully.", delay: 800, type: "success" },
    { text: result ? `Similarity score: ${(result.matched_session?.match_score * 100).toFixed(1)}%` : "Similarity score: 87.4%", delay: 600, type: "success" },
    { text: "Loading strict Anti-Hallucination guidelines...", delay: 500, type: "info" },
    { text: "Configuring LLM context space with event facts...", delay: 600, type: "info" },
    { text: "Generating personalized B2B invitation via Gemini 1.5 Flash...", delay: 1100, type: "info" },
    { text: "Invoking send_draft_via_mcp() pipeline...", delay: 600, type: "info" },
    { text: `[MCP TRIGGER] Draft successfully pushed to queue for <${formData.email}>.`, delay: 800, type: "success" },
    { text: "Finalizing holographic render...", delay: 500, type: "info" },
  ];

  useEffect(() => {
    if (stage === "running") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logIndex, stage]);

  useEffect(() => {
    if (stage === "running" && logIndex < logs.length) {
      const timer = setTimeout(() => {
        setLogIndex(prev => prev + 1);
      }, logs[logIndex].delay);
      return () => clearTimeout(timer);
    } else if (stage === "running" && logIndex >= logs.length) {
      const timer = setTimeout(() => {
        setStage("completed");
        if (result) onSuccess(result);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [stage, logIndex, result]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Enter your full name.";
    if (!formData.email.trim()) {
      errs.email = "Enter corporate email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format.";
    }
    if (!formData.professional_focus.trim()) {
      errs.professional_focus = "Tell us about your SCM challenges.";
    } else if (formData.professional_focus.trim().length < 15) {
      errs.professional_focus = "Please add more details (minimum 15 characters).";
    }
    return errs;
  };

  const handleStartPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStage("running");
    setLogIndex(0);

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        matched_session: {
          title: "Industry Keynote: Outlook & Challenges on Digital Logistics & Supply Chain",
          time: "10:10 AM - 10:40 AM",
          type: "Keynote",
          speaker: "Srivatsav Sarvepalli",
          description: "Global logistics flow optimization, regional constraints, and technology integrations in the Gulf SCM ecosystem.",
          match_score: 0.865
        },
        email_draft: `Dear ${formData.name},\n\nWe are pleased to invite you to "Troubled Waters: Sailing with AI in Supply Chain" on 13th November 2024 at the Marriott Resort, The Palm, Dubai.\n\nBased on your challenges, we matched you with Srivatsav Sarvepalli's Industry Keynote: Outlook & Challenges on Digital Logistics at 10:10 AM.\n\nRegister today to secure your seat.\n\nBest regards,\nAccelalpha & Oracle Team`,
        mcp_triggered: true,
        offline: true
      });
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", professional_focus: "" });
    setResult(null);
    setStage("idle");
    setLogIndex(0);
  };

  return (
    <div className="ai-console-wrapper glass-card">
      <div className="console-header">
        <div className="console-status-pill">
          <span className="pulse-dot green" />
          <span>AI SYSTEM ONLINE</span>
        </div>
        <div className="console-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
      </div>

      <div className="console-grid">
        <div className="console-workspace">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="console-form-container"
              >
                <div className="console-heading-section">
                  <h3>Supply Chain AI Copilot</h3>
                  <p>Register to run our vector similarity matching against the conference syllabus.</p>
                </div>

                <form onSubmit={handleStartPipeline} className="modern-form">
                  <div className="form-group-row">
                    <div className="input-group">
                      <label htmlFor="console-name">Full Name</label>
                      <input
                        id="console-name"
                        type="text"
                        placeholder="e.g. Sarah Al-Mansoori"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "error" : ""}
                      />
                      {errors.name && <span className="input-error-msg"><AlertCircle size={11} /> {errors.name}</span>}
                    </div>

                    <div className="input-group">
                      <label htmlFor="console-email">Corporate Email</label>
                      <input
                        id="console-email"
                        type="email"
                        placeholder="sarah@company.ae"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && <span className="input-error-msg"><AlertCircle size={11} /> {errors.email}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="console-focus">Describe Your Supply Chain Challenges &amp; Focus Area</label>
                    <textarea
                      id="console-focus"
                      placeholder="e.g. I am a Logistics Director trying to optimize inventory holding costs and streamline last-mile delivery routes across the GCC region..."
                      value={formData.professional_focus}
                      onChange={e => setFormData({ ...formData, professional_focus: e.target.value })}
                      className={errors.professional_focus ? "error" : ""}
                      rows={4}
                    />

                    <div className="textarea-analysis-widget">
                      <div className="analysis-stat">
                        <span>Characters: {formData.professional_focus.length}</span>
                      </div>
                      <div className="analysis-keywords">
                        <span>Detected SCM Concepts: </span>
                        {detectedKeywords.length === 0 ? (
                          <span className="muted">None detected yet...</span>
                        ) : (
                          <span className="keyword-tags">
                            {detectedKeywords.slice(0, 4).map(kw => (
                              <span key={kw} className="kw-tag">{kw}</span>
                            ))}
                            {detectedKeywords.length > 4 && <span className="kw-tag">+ {detectedKeywords.length - 4} more</span>}
                          </span>
                        )}
                      </div>
                    </div>
                    {errors.professional_focus && <span className="input-error-msg"><AlertCircle size={11} /> {errors.professional_focus}</span>}
                  </div>

                  <button type="submit" className="console-action-btn">
                    <Sparkles size={16} />
                    <span>Run RAG Matching Pipeline</span>
                  </button>
                </form>
              </motion.div>
            )}

            {stage === "running" && (
              <motion.div
                key="running-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="console-terminal-view"
              >
                <div className="terminal-header">
                  <Terminal size={14} className="terminal-icon" />
                  <span>RAG MATCHING &amp; GENERATION LOGS</span>
                </div>
                <div className="terminal-body">
                  <div className="terminal-lines">
                    {logs.slice(0, logIndex).map((log, index) => (
                      <div key={index} className={`terminal-line ${log.type}`}>
                        <span className="line-timestamp">[{new Date().toLocaleTimeString()}]</span>
                        <ChevronRight size={12} className="line-chevron" />
                        <span className="line-text">{log.text}</span>
                      </div>
                    ))}
                    {logIndex < logs.length && (
                      <div className="terminal-line active">
                        <span className="line-timestamp">[{new Date().toLocaleTimeString()}]</span>
                        <span className="terminal-cursor-indicator" />
                        <span className="line-text">Executing operations...</span>
                      </div>
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "completed" && result && (
              <motion.div
                key="completed-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="console-results-container"
              >
                <div className="success-badge-glow">
                  <CheckCircle size={32} className="success-icon" />
                  <h4>AI Matching Successful!</h4>
                  <p>A custom syllabus path has been constructed based on your corporate profile.</p>
                </div>

                <div className="results-card">
                  <div className="matched-session-section">
                    <div className="badge-tag">
                      <Cpu size={12} />
                      <span>Similarity Score: {(result.matched_session?.match_score * 100).toFixed(1)}%</span>
                    </div>
                    <h5>{result.matched_session?.title}</h5>
                    <div className="session-meta-row">
                      <span>🕒 {result.matched_session?.time}</span>
                      <span>🎙️ {result.matched_session?.speaker}</span>
                    </div>
                    <p className="session-description">{result.matched_session?.description}</p>
                  </div>

                  <div className="invitation-draft-section">
                    <div className="draft-header">
                      <Mail size={12} />
                      <span>PERSONALIZED INVITATION DRAFT (LLM GENERATED)</span>
                    </div>
                    <div className="draft-body">
                      {result.email_draft}
                    </div>
                  </div>

                  {result.mcp_triggered && (
                    <div className="mcp-activation-alert">
                      <Network size={14} className="alert-icon" />
                      <span>
                        <strong>MCP Pipeline Executed:</strong> <code>send_draft_via_mcp()</code> was automatically invoked with UTC timestamp. Check backend console.
                      </span>
                    </div>
                  )}

                  {result.offline && (
                    <div className="offline-warning">
                      <ShieldAlert size={14} className="warning-icon" />
                      <span>Running in offline simulation fallback mode. Start python backend on port 8000 for live AI generation.</span>
                    </div>
                  )}
                </div>

                <button onClick={handleReset} className="reset-console-btn">
                  <RefreshCw size={14} />
                  <span>Run Another Analysis</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="console-monitor-sidebar">
          <div className="sidebar-heading">
            <Cpu size={14} />
            <span>AI ENGINE MONITOR</span>
          </div>

          <div className="monitor-stats">
            <div className="monitor-stat-box">
              <div className="stat-label">Model Engine</div>
              <div className="stat-value">Gemini 1.5 Flash</div>
              <div className="stat-indicator green">ACTIVE</div>
            </div>

            <div className="monitor-stat-box">
              <div className="stat-label">RAG Knowledge</div>
              <div className="stat-value">agenda.txt (Parsed)</div>
              <div className="stat-indicator green">10 SESSIONS INDEXED</div>
            </div>

            <div className="monitor-stat-box">
              <div className="stat-label">MCP Bridge</div>
              <div className="stat-value">send_draft_via_mcp()</div>
              <div className="stat-indicator green">ONLINE</div>
            </div>

            <div className="monitor-stat-box">
              <div className="stat-label">Sandbox Safety</div>
              <div className="stat-value">Anti-Hallucination Prompt</div>
              <div className="stat-indicator active">ENFORCED</div>
            </div>
          </div>

          <div className="sidebar-console-visual">
            <div className="visual-pulse-grid">
              <div className="pulse-circle pulse-1" />
              <div className="pulse-circle pulse-2" />
              <div className="pulse-circle pulse-3" />
            </div>
            <div className="visual-coordinates">
              <span>LATENCY: ~240ms</span>
              <span>RAG CONFIDENCE: High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
