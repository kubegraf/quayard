import { useEffect, useRef, useState, type ReactNode } from "react";

/* Scroll-reveal: adds `.in` when the element enters the viewport. */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const Mark = () => (
  <span className="brand-mark">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 20l6-13 6 13" stroke="#04121a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15h6" stroke="#04121a" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  </span>
);

const Brand = () => (
  <a className="brand" href="#top">
    <Mark />
    Quayard<sup>.ai</sup>
  </a>
);

function Nav() {
  return (
    <header>
      <div className="wrap nav">
        <Brand />
        <nav className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#how">How it works</a>
          <a href="#security">Security</a>
          <a href="#compare">Compare</a>
        </nav>
        <div className="nav-cta">
          <a className="nav-signin" href="#">Sign in</a>
          <a className="btn btn-primary" href="#cta">Book a demo</a>
          <button
            className="burger"
            aria-label="Menu"
            onClick={() => {
              const el = document.querySelector<HTMLElement>(".nav-links");
              if (el) el.style.display = el.style.display === "flex" ? "" : "flex";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow"><span className="dot" />Autonomous AI SRE</span>
          <h1>AI SRE that <span className="grad">shows its work.</span></h1>
          <p className="lede">
            Quayard detects anomalies, finds root cause with <b>cited evidence</b>, and
            safely remediates production incidents — collapsing MTTR from hours to seconds.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#cta">Start free →</a>
            <a className="btn btn-ghost" href="#cta">Book a demo</a>
          </div>
          <div className="trustline">
            <span><span className="tick">✓</span> SOC 2 Type II</span>
            <span><span className="tick">✓</span> Self-hosted or cloud</span>
            <span><span className="tick">✓</span> No credit card</span>
          </div>
        </div>

        <Reveal>
          <div className="rca">
            <div className="rca-head">
              <div className="rca-id">INC-2291 <span>· checkout-api · p99 latency</span></div>
              <span className="chip resolving"><span className="d" />Resolving</span>
            </div>
            <div className="rstep">
              <div className="n">01</div>
              <div className="t">p99 on <code>checkout-api</code> spiked <code>+412%</code> at 02:14 UTC.</div>
              <div className="tag">Observed</div>
            </div>
            <div className="rstep">
              <div className="n">02</div>
              <div className="t">Correlated with deploy <code>v3.7.1</code> shipped 4 min prior.</div>
              <div className="tag">Observed</div>
            </div>
            <div className="rstep">
              <div className="n">03</div>
              <div className="t">DB pool exhausted — <code>247/250</code> held by stalled workers.</div>
              <div className="tag warn">Confirmed</div>
            </div>
            <div className="rstep">
              <div className="n">04</div>
              <div className="t">
                Root cause: PR <code>#4820</code> dropped the connection timeout. <b>94% confidence.</b>
                <div className="evidence">
                  <a href="#cta">logs·2.1k</a><a href="#cta">trace·a91f</a><a href="#cta">metric·pool</a><a href="#cta">diff·#4820</a>
                </div>
              </div>
              <div className="tag cite">Cited</div>
            </div>
            <div className="rstep">
              <div className="n">05</div>
              <div className="t">Rolled back &amp; drained stale workers — SLO restored in <code>38s</code>.</div>
              <div className="tag ok">Remediated</div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="marquee">
        <div className="wrap">
          <div className="lbl">Runs alongside the stack you already have</div>
        </div>
        <div className="marquee-track">
          {["Kubernetes","Prometheus","Datadog","GitHub","OpenTelemetry","PagerDuty","Slack","Grafana","Terraform","AWS",
            "Kubernetes","Prometheus","Datadog","GitHub","OpenTelemetry","PagerDuty","Slack","Grafana","Terraform","AWS"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const stats = [
    { n: "$14k", l: "Median cost of a single minute of downtime (Gartner / IDC)." },
    { n: "67h", l: "Median MTTR when a human traces root cause by hand." },
    { n: "~85h", l: "Per engineer, per quarter, lost to triage and post-mortems." },
  ];
  return (
    <section className="block" id="platform">
      <div className="wrap">
        <div className="kicker">The problem</div>
        <h2>Alerts fire. <span className="grad">Nobody knows why.</span></h2>
        <p className="sub">
          Teams drown in alerts while root cause hides across a dozen tools. The cost isn't the
          outage — it's the hour of a senior engineer at 3am, guessing.
        </p>
        <div className="pillars stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {stats.map((s) => (
            <Reveal key={s.n}>
              <div className="pillar" style={{ minHeight: 0 }}>
                <div className="grad" style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 44, letterSpacing: "-.02em", lineHeight: 1 }}>{s.n}</div>
                <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 12 }}>{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const items = [
    { k: "detect", step: "Step 01 · Detect", h: "Catches what thresholds miss.", p: "One model correlates pod restarts, latency, cost and deploy signals — not fourteen disconnected alerts.", icon: <path d="M3 12h4l3 8 4-16 3 8h4" /> },
    { k: "diagnose", step: "Step 02 · Diagnose", h: "Root cause you can verify.", p: "Every conclusion links the exact logs, metrics, traces and diffs it used. Replay the reasoning — no black box.", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></> },
    { k: "remediate", step: "Step 03 · Remediate", h: "Fixes, gated by you.", p: "Proposes the fix, shows the blast radius, executes after approval — with automatic rollback if the SLO slips.", icon: <><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" /><path d="m9 12 2 2 4-4" /></> },
  ];
  return (
    <section className="block" id="features" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">The platform</div>
        <h2>An autonomous SRE, <span className="grad">not another dashboard.</span></h2>
        <p className="sub">Quayard closes the loop — from the first anomaly to a signed, verified fix.</p>
        <div className="pillars">
          {items.map((it) => (
            <Reveal key={it.k}>
              <div className={`pillar ${it.k}`}>
                <div className="ic"><svg viewBox="0 0 24 24">{it.icon}</svg></div>
                <div className="step-lbl">{it.step}</div>
                <h3>{it.h}</h3>
                <p>{it.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { h: "Observe", p: "Streams telemetry, deploys and topology into one live model of your systems." },
    { h: "Correlate", p: "Forms a hypothesis and walks the dependency graph like a senior engineer." },
    { h: "Cite", p: "Pins the root cause to the exact evidence — logs, traces, metrics, commits." },
    { h: "Remediate", p: "Applies the signed fix under your policy, verifies recovery, rolls back if needed." },
  ];
  return (
    <section className="block" id="how" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">How it works</div>
        <h2>From signal to signed fix, <span className="grad">in seconds.</span></h2>
        <p className="sub">Four steps run continuously — the agent does the 3am investigation so your engineers don't have to.</p>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal key={s.h}>
              <div className="hw">
                <div className="num">{i + 1}</div>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="block" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">Built for production</div>
        <h2>Everything an on-call engineer <span className="grad">wishes they had.</span></h2>
        <p className="sub">Depth where it matters — evidence, safety, and your data staying yours.</p>
        <div className="bento">
          <Reveal className="tile wide"><div className="tile" style={{ height: "100%" }}><span className="glow" /><div className="tag">Evidence-cited RCA</div><h3>No black box. Ever.</h3><p>Every root-cause claim carries its receipts — the log lines, traces, metrics and code diffs behind it. You can agree, disagree, and audit. That's the whole point.</p></div></Reveal>
          <Reveal className="tile third"><div className="tile" style={{ height: "100%" }}><span className="glow" /><div className="tag">Anomaly detection</div><h3>Learns normal.</h3><p>Flags the drift before it pages you.</p></div></Reveal>
          <Reveal className="tile third"><div className="tile" style={{ height: "100%" }}><span className="glow" /><div className="tag">Safe remediation</div><h3>Approval-gated.</h3><p>Blast-radius limits + auto-rollback.</p></div></Reveal>
          <Reveal className="tile half"><div className="tile" style={{ height: "100%" }}><span className="glow" /><div className="tag">Zero-trust</div><h3>Your data stays yours.</h3><p>Self-hosted in your VPC or fully managed. Least-privilege access, zero inbound ports, every action audit-logged.</p></div></Reveal>
          <Reveal className="tile half"><div className="tile" style={{ height: "100%" }}><span className="glow" /><div className="tag">Integrations</div><h3>Plugs into your stack.</h3><p>Kubernetes, Prometheus, Datadog, GitHub, PagerDuty, Slack — connected in minutes, not weeks.</p></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const row = [
    { n: "−90%", l: "MTTR reduction" },
    { n: "38s", l: "Median signal → fix" },
    { n: "80%", l: "Less alert noise" },
    { n: "~85h", l: "Engineer hrs saved / qtr" },
  ];
  return (
    <section className="block" id="outcomes" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal>
          <div className="band">
            <div className="kicker">Outcomes</div>
            <h2 style={{ marginBottom: 6 }}>Measurable from day one.</h2>
            <div className="row">
              {row.map((r) => (
                <div key={r.l}><div className="n grad">{r.n}</div><div className="l">{r.l}</div></div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Security() {
  const items = [
    { b: "Zero-trust architecture", p: "The agent opens zero inbound ports and verifies every command inside your cluster." },
    { b: "Self-hosted or cloud", p: "Run entirely in your own VPC — data never leaves your tenancy — or let us host it." },
    { b: "Least-privilege by default", p: "Scoped, revocable access with a full, immutable audit trail of every action." },
  ];
  const badges = [
    { b1: "SOC 2", b2: "Type II" },
    { b1: "VPC", b2: "self-hosted" },
    { b1: "AES-256", b2: "encrypted" },
    { b1: "Audit", b2: "every action" },
  ];
  return (
    <section className="block" id="security" style={{ paddingTop: 0 }}>
      <div className="wrap sec-grid">
        <div>
          <div className="kicker left">Security &amp; trust</div>
          <h2 style={{ textAlign: "left", margin: "0 0 12px" }}>Trusted with production.</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 480 }}>
            Quayard is built for regulated, security-conscious teams — verifiable, sovereign, and auditable by design.
          </p>
          <div className="sec-list">
            {items.map((it) => (
              <div className="sec-item" key={it.b}>
                <span className="ck"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7" /></svg></span>
                <div><b>{it.b}</b><p>{it.p}</p></div>
              </div>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="badges" style={{ flexWrap: "wrap" }}>
            {badges.map((bd) => (
              <div className="badge" key={bd.b1}><div className="b1 grad">{bd.b1}</div><div className="b2">{bd.b2}</div></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  const rows: [string, ReactNode, ReactNode, ReactNode][] = [
    ["Correlates signals into one incident", <span className="yes">●</span>, <span className="mid">◐</span>, <span className="no">○</span>],
    ["Root cause with cited evidence", <span className="yes">●</span>, <span className="no">○</span>, <span className="mid">◐</span>],
    ["Safe, approval-gated remediation", <span className="yes">●</span>, <span className="no">○</span>, <span className="no">○</span>],
    ["Self-hosted · zero-trust", <span className="yes">●</span>, <span className="mid">◐</span>, <span className="no">○</span>],
    ["Auditable, replayable reasoning", <span className="yes">●</span>, <span className="no">○</span>, <span className="no">○</span>],
  ];
  return (
    <section className="block" id="compare" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">Why Quayard</div>
        <h2>Not a dashboard. <span className="grad">Not a chatbot.</span></h2>
        <p className="sub">Observability tools show you data. Generic AI copilots guess. Quayard investigates and proves it.</p>
        <div className="cmp">
          <table>
            <thead>
              <tr>
                <th style={{ width: "46%" }}></th>
                <th className="q">Quayard</th>
                <th>Observability dashboards</th>
                <th>Generic AI copilots</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="feat">{r[0]}</td>
                  <td className="mark q">{r[1]}</td>
                  <td className="mark">{r[2]}</td>
                  <td className="mark">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const q = [
    { t: "Quayard found the root cause in 4 minutes — with the exact log lines. We stopped guessing.", nm: "Priya N.", rl: "SRE Lead, fintech", av: "P" },
    { t: "The cited evidence is the killer feature. My team actually trusts the fix before approving it.", nm: "Marcus D.", rl: "VP Eng, SaaS", av: "M" },
    { t: "Self-hosted in our VPC in an afternoon. Alert noise down 80% by the second week.", nm: "Wei L.", rl: "Platform Eng", av: "W" },
  ];
  return (
    <section className="block" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">Loved by on-call teams</div>
        <h2>Root cause in minutes, <span className="grad">not war rooms.</span></h2>
        <p className="sub" />
        <div className="quotes">
          {q.map((it) => (
            <Reveal key={it.nm}>
              <div className="quote">
                <div className="stars">★★★★★</div>
                <p>“{it.t}”</p>
                <div className="who">
                  <span className="av">{it.av}</span>
                  <div><div className="nm">{it.nm}</div><div className="rl">{it.rl}</div></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="block final" id="cta" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker">Get started</div>
        <h2>See the root cause. <span className="grad">Trust the fix.</span></h2>
        <p className="sub">Self-hosted or cloud. Read-only by default. Walk a real incident with us — the first one's on the house.</p>
        <div className="cta">
          <a className="btn btn-primary" href="mailto:founder@quayard.ai?subject=Quayard%20trial">Start free →</a>
          <a className="btn btn-ghost" href="mailto:founder@quayard.ai?subject=Quayard%20demo">Book a demo</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: "Product", links: ["Platform", "How it works", "Security", "Integrations"] },
    { h: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { h: "Legal", links: ["Privacy", "Security", "Terms"] },
  ];
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div className="foot-brand">
            <Brand />
            <p>The autonomous AI SRE platform. Detect, diagnose with cited evidence, and safely remediate — before it pages you.</p>
          </div>
          <div className="foot-cols">
            {cols.map((c) => (
              <div className="foot-col" key={c.h}>
                <h5>{c.h}</h5>
                {c.links.map((l) => <a href="#" key={l}>{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Quayard.ai — all rights reserved.</p>
          <p>Zero inbound ports · every action signed</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Pillars />
        <HowItWorks />
        <Bento />
        <Metrics />
        <Security />
        <Comparison />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
