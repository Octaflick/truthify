"use client";

import { useState } from "react";
import Link from "next/link";

interface AnalysisResult {
  verdict: string;
  confidence_score: number;
  key_facts: string;
  emotional_tone: string;
  manipulation_score: number;
  manipulation_tactics: string;
  bias_detected: string;
  logical_issues: string;
  source_credibility: string;
  credibility_score: number;
  red_flags: string;
  recommendation: string;
  headline: string;
  source: string;
}

function getVerdictColor(verdict: string) {
  const v = (verdict ?? "").toUpperCase();
  if (v.includes("REAL")) return { bg: "#34c759", text: "#ffffff" };
  if (v.includes("FAKE")) return { bg: "#ff3b30", text: "#ffffff" };
  return { bg: "#ff9500", text: "#ffffff" };
}

function getScoreColor(score: number) {
  if (score >= 70) return "#34c759";
  if (score >= 40) return "#ff9500";
  return "#ff3b30";
}

export default function Home() {
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!headline.trim() && !content.trim()) return;

    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, content, source }),
      });

      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
    } catch {
      setErrorMsg("Failed to reach the analysis service. Please try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setHeadline("");
    setContent("");
    setSource("");
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  }

  const confidence = Number(result?.confidence_score ?? 0);
  const credibility = Number(result?.credibility_score ?? 0);
  const manipulation = Number(result?.manipulation_score ?? 0);
  const verdictColor = result ? getVerdictColor(result.verdict) : null;

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f7" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12"
        style={{
          height: 48,
          background: "rgba(245, 245, 247, 0.72)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1d1d1f",
            letterSpacing: "-0.374px",
            textDecoration: "none",
          }}
        >
          Truthify
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="hover:opacity-60 transition-opacity"
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(0, 0, 0, 0.8)",
              letterSpacing: "-0.12px",
              textDecoration: "none",
            }}
          >
            Blog
          </Link>
          <a
            href="https://github.com/AbnormalPilot/truthify"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity"
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(0, 0, 0, 0.8)",
              letterSpacing: "-0.12px",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div style={{ height: 48, background: "#f5f5f7" }} />

      {/* Form Section */}
      {status !== "done" && (
        <section style={{ background: "#f5f5f7", paddingTop: 56, paddingBottom: 80 }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1
                style={{
                  fontSize: "clamp(32px, 6vw, 48px)",
                  fontWeight: 600,
                  lineHeight: 1.07,
                  letterSpacing: "-0.28px",
                  color: "#1d1d1f",
                  margin: 0,
                }}
              >
                Truthify
              </h1>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: 1.47,
                  letterSpacing: "-0.374px",
                  color: "rgba(0, 0, 0, 0.48)",
                  marginTop: 8,
                }}
              >
                Verify any claim. Instantly.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Headline Input */}
                <div>
                  <label
                    htmlFor="headline"
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.33,
                      letterSpacing: "-0.12px",
                      color: "rgba(0, 0, 0, 0.48)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Article Title
                  </label>
                  <input
                    id="headline"
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter the headline or claim to verify"
                    required
                    disabled={status === "loading"}
                    style={{ width: "100%", background: "#ffffff", borderRadius: 12 }}
                  />
                </div>

                {/* Content Input */}
                <div>
                  <label
                    htmlFor="content"
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.33,
                      letterSpacing: "-0.12px",
                      color: "rgba(0, 0, 0, 0.48)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Article Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the full article text here"
                    rows={6}
                    required
                    disabled={status === "loading"}
                    style={{ width: "100%", background: "#ffffff", borderRadius: 12, resize: "vertical" }}
                  />
                </div>

                {/* Source Input */}
                <div>
                  <label
                    htmlFor="source"
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.33,
                      letterSpacing: "-0.12px",
                      color: "rgba(0, 0, 0, 0.48)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Source URL <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
                  </label>
                  <input
                    id="source"
                    type="url"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="https://example.com/article"
                    disabled={status === "loading"}
                    style={{ width: "100%", background: "#ffffff", borderRadius: 12 }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: "16px 24px",
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: 1,
                  background: "#0071e3",
                  color: "#ffffff",
                  borderRadius: 980,
                }}
                className="hover:brightness-110"
              >
                {status === "loading" ? "Analyzing..." : "Analyze Article"}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Loading State */}
      {status === "loading" && (
        <section
          className="flex flex-col items-center justify-center"
          style={{ background: "#f5f5f7", padding: "60px 24px" }}
        >
          <div
            className="animate-spin"
            style={{
              width: 32,
              height: 32,
              border: "3px solid rgba(0, 0, 0, 0.1)",
              borderTopColor: "#0071e3",
              borderRadius: "50%",
              marginBottom: 20,
            }}
          />
          <p style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.19, color: "#1d1d1f" }}>
            Analyzing your article
          </p>
          <p style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.48)", marginTop: 8, letterSpacing: "-0.224px" }}>
            This usually takes 5-15 seconds
          </p>
        </section>
      )}

      {/* Error State */}
      {status === "error" && (
        <section
          className="flex flex-col items-center justify-center"
          style={{ background: "#f5f5f7", padding: "60px 24px" }}
        >
          <p style={{ fontSize: 17, color: "#ff3b30", marginBottom: 20, letterSpacing: "-0.374px" }}>
            {errorMsg}
          </p>
          <button
            onClick={() => setStatus("idle")}
            style={{
              padding: "12px 24px",
              fontSize: 17,
              background: "transparent",
              color: "#0071e3",
              border: "1px solid #0071e3",
              borderRadius: 980,
            }}
            className="hover:brightness-110"
          >
            Try Again
          </button>
        </section>
      )}

      {/* Results */}
      {status === "done" && result && (
        <>
          {/* Verdict Hero */}
          <section
            className="flex flex-col items-center justify-center text-center"
            style={{
              background: verdictColor?.bg,
              padding: "60px 24px",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.12px",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Verdict
            </p>
            <p
              style={{
                fontSize: "clamp(40px, 8vw, 56px)",
                fontWeight: 600,
                lineHeight: 1.07,
                letterSpacing: "-0.28px",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {result.verdict}
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1.14,
                color: "rgba(255, 255, 255, 0.9)",
                marginTop: 12,
              }}
            >
              {confidence}% confident
            </p>
            {/* Confidence Bar */}
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                height: 6,
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                marginTop: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${confidence}%`,
                  height: "100%",
                  background: "#ffffff",
                  borderRadius: 3,
                  transition: "width 0.7s ease",
                }}
              />
            </div>
          </section>

          {/* Article Info */}
          <section style={{ background: "#f5f5f7", padding: "60px 24px" }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "-0.12px",
                  color: "rgba(0, 0, 0, 0.48)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Article
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.14,
                  letterSpacing: "0.196px",
                  color: "#1d1d1f",
                  margin: 0,
                }}
              >
                {result.headline}
              </p>
              {result.source && (
                <p
                  style={{
                    fontSize: 14,
                    color: "#0066cc",
                    marginTop: 8,
                    letterSpacing: "-0.224px",
                    wordBreak: "break-all",
                  }}
                >
                  {result.source}
                </p>
              )}

              {/* Key Facts */}
              {result.key_facts && (
                <div style={{ marginTop: 32 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "-0.12px",
                      color: "rgba(0, 0, 0, 0.48)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Key Facts
                  </p>
                  <p
                    style={{
                      fontSize: 17,
                      lineHeight: 1.47,
                      letterSpacing: "-0.374px",
                      color: "rgba(0, 0, 0, 0.8)",
                      margin: 0,
                    }}
                  >
                    {result.key_facts}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Scores Section */}
          <section style={{ background: "#000000", padding: "60px 24px" }}>
            <div
              style={{
                maxWidth: 600,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* Credibility */}
              <div
                style={{
                  background: "#1d1d1f",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "-0.12px",
                    color: "rgba(255, 255, 255, 0.48)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Credibility
                </p>
                <p
                  style={{
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: getScoreColor(credibility),
                    margin: 0,
                  }}
                >
                  {credibility}%
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.224px",
                    color: "rgba(255, 255, 255, 0.7)",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {result.source_credibility}
                </p>
              </div>

              {/* Manipulation */}
              <div
                style={{
                  background: "#1d1d1f",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "-0.12px",
                    color: "rgba(255, 255, 255, 0.48)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Manipulation
                </p>
                <p
                  style={{
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: getScoreColor(100 - manipulation),
                    margin: 0,
                  }}
                >
                  {manipulation}%
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.224px",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginTop: 4,
                  }}
                >
                  {result.emotional_tone}
                </p>
              </div>
            </div>
          </section>

          {/* Details Section */}
          {(
            (result.bias_detected && result.bias_detected !== "none detected") ||
            (result.manipulation_tactics && result.manipulation_tactics !== "none") ||
            (result.red_flags && result.red_flags !== "none")
          ) && (
            <section style={{ background: "#f5f5f7", padding: "60px 24px" }}>
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                {/* Bias */}
                {result.bias_detected && result.bias_detected !== "none detected" && (
                  <div style={{ marginBottom: 32 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "-0.12px",
                        color: "rgba(0, 0, 0, 0.48)",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Bias Detected
                    </p>
                    <p
                      style={{
                        fontSize: 17,
                        lineHeight: 1.47,
                        letterSpacing: "-0.374px",
                        color: "rgba(0, 0, 0, 0.8)",
                        margin: 0,
                      }}
                    >
                      {result.bias_detected}
                    </p>
                  </div>
                )}

                {/* Tactics */}
                {result.manipulation_tactics && result.manipulation_tactics !== "none" && (
                  <div style={{ marginBottom: 32 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "-0.12px",
                        color: "rgba(0, 0, 0, 0.48)",
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      Manipulation Tactics
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.manipulation_tactics.split(",").map((t) => (
                        <span
                          key={t.trim()}
                          style={{
                            display: "inline-block",
                            padding: "6px 14px",
                            background: "#1d1d1f",
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 980,
                            letterSpacing: "-0.12px",
                          }}
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {result.red_flags && result.red_flags !== "none" && (
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "-0.12px",
                        color: "rgba(0, 0, 0, 0.48)",
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      Red Flags
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.red_flags.split(",").map((f) => (
                        <span
                          key={f.trim()}
                          style={{
                            display: "inline-block",
                            padding: "6px 14px",
                            background: "#ff3b30",
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 980,
                            letterSpacing: "-0.12px",
                          }}
                        >
                          {f.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <section style={{ background: "#000000", padding: "60px 24px" }}>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "-0.12px",
                    color: "rgba(255, 255, 255, 0.48)",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Recommendation
                </p>
                <p
                  style={{
                    fontSize: 21,
                    fontWeight: 600,
                    lineHeight: 1.19,
                    letterSpacing: "0.231px",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {result.recommendation}
                </p>
              </div>
            </section>
          )}

          {/* Analyze Another */}
          <section
            className="flex items-center justify-center"
            style={{ background: "#f5f5f7", padding: "40px 24px" }}
          >
            <button
              onClick={handleReset}
              style={{
                padding: "12px 28px",
                fontSize: 17,
                fontWeight: 400,
                background: "#0071e3",
                color: "#ffffff",
                borderRadius: 980,
              }}
              className="hover:brightness-110"
            >
              Analyze Another Article
            </button>
          </section>
        </>
      )}

      {/* Footer — always visible, stuck to bottom */}
      <footer
        className="flex items-center justify-center"
        style={{
          marginTop: "auto",
          background: "#f5f5f7",
          padding: "16px 24px",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <p style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.48)", letterSpacing: "-0.12px", margin: 0 }}>
          AI-generated analysis. Always verify from multiple trusted sources.
        </p>
      </footer>
    </div>
  );
}
