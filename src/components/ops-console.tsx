import { useEffect, useState } from "react";

/**
 * OpsConsole — the hero visual. A live "agent session" terminal that replays
 * a production incident end-to-end: detection, diagnosis, remediation,
 * resolution. Pure React state + CSS transitions; loops forever.
 */

type Line = {
  t: number; // seconds into the cycle when the line appears
  tag: "DETECT" | "TRIAGE" | "FIX" | "OK";
  ts: string;
  text: string;
};

const LINES: Line[] = [
  { t: 0.6, tag: "DETECT", ts: "03:12:04", text: "anomaly · checkout-api p99 1,240ms (baseline 180ms)" },
  { t: 1.5, tag: "DETECT", ts: "03:12:05", text: "blast radius mapped → payments, cart, orders-db" },
  { t: 2.5, tag: "TRIAGE", ts: "03:12:07", text: "correlating 1,204 signals across 37 services…" },
  { t: 3.6, tag: "TRIAGE", ts: "03:12:31", text: "hypothesis: deploy 7e2a91c @ 03:08 UTC" },
  { t: 4.7, tag: "TRIAGE", ts: "03:12:51", text: "confirmed: query-plan regression · orders.user_id unindexed" },
  { t: 5.9, tag: "FIX", ts: "03:13:22", text: "migration drafted · CREATE INDEX CONCURRENTLY idx_orders_user_id" },
  { t: 7.0, tag: "FIX", ts: "03:14:40", text: "PR #1847 opened → checks green → merged & deployed" },
  { t: 8.2, tag: "OK", ts: "03:14:45", text: "p99 recovered 1,240ms → 142ms · incident closed" },
];

const CYCLE = 13; // seconds per full loop
const RESOLVE_AT = 8.2;

/* latency curve for the sparkline: calm → spike → decay → calm */
const SPARK = "M0,34 L30,33 L52,34 L70,32 L84,33 L96,10 L108,4 L122,8 L136,6 L152,14 L168,24 L186,31 L220,33 L260,34 L300,33";

export function OpsConsole() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      // quantize to 100ms so React re-renders ~10×/s instead of every frame
      setNow(Math.round((((t - start) / 1000) % CYCLE) * 10) / 10);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const resolved = now >= RESOLVE_AT;
  const visible = LINES.filter((l) => now >= l.t);

  return (
    <div className="console" role="img" aria-label="Quayard agent session resolving a production incident autonomously">
      <div className="console-bar">
        <span className="led r" /><span className="led y" /><span className="led g" />
        <span className="console-title">quayard-agent · session 4721</span>
        <span className={`console-status ${resolved ? "ok" : "hot"}`}>
          <i />{resolved ? "RESOLVED · MTTR 2m 41s" : "INCIDENT · investigating"}
        </span>
      </div>

      <div className="console-chart" aria-hidden>
        <div className="cc-head">
          <span>checkout-api · p99 latency</span>
          <span className={resolved ? "ok" : "hot"}>{resolved ? "142ms" : "1,240ms"}</span>
        </div>
        <svg viewBox="0 0 300 38" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="spark-fill" d={`${SPARK} L300,38 L0,38 Z`} fill="url(#sparkfill)" stroke="none" />
          <path className="spark-line" d={SPARK} fill="none" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          {/* traveling cursor, synced to the cycle */}
          <circle className="spark-dot" r="2.6">
            <animateMotion dur={`${CYCLE}s`} repeatCount="indefinite" path={SPARK} />
          </circle>
        </svg>
      </div>

      <div className="console-body">
        {visible.map((l) => (
          <div className="cl" key={l.t}>
            <span className="cl-ts">{l.ts}</span>
            <span className={`cl-tag ${l.tag.toLowerCase()}`}>{l.tag}</span>
            <span className="cl-txt">{l.text}</span>
          </div>
        ))}
        {!resolved && (
          <div className="cl cursor-line">
            <span className="cl-ts">--:--:--</span>
            <span className="caret" />
          </div>
        )}
        {resolved && (
          <div className="console-summary">
            <span><b>0</b> humans paged</span>
            <span><b>47s</b> to root cause</span>
            <span><b>PR #1847</b> shipped</span>
          </div>
        )}
      </div>
    </div>
  );
}
