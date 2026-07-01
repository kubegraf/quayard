import { useEffect, useRef, useState, type ReactNode } from "react";

const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

const Mark = () => (
  <span className="brand-mark">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 20l6-13 6 13" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15h6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  </span>
);
const Brand = () => (<a className="brand" href="#top"><Mark />Quayard<sup style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--accent)", verticalAlign: "super", marginLeft: -2 }}>.ai</sup></a>);

const Check = () => (<span className="ck"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7" /></svg></span>);

function Nav() {
  return (
    <header>
      <div className="wrap nav">
        <Brand />
        <nav className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#how">How It Works</a>
          <a href="#results">Results</a>
          <a href="#integrations">Integrations</a>
        </nav>
        <div className="nav-cta">
          <a className="nav-signin" href="#">Sign In</a>
          <a className="btn btn-primary" href="#cta">Book a Demo</a>
          <button className="burger" aria-label="Menu" onClick={() => { const el = document.querySelector<HTMLElement>(".nav-links"); if (el) el.style.display = el.style.display === "flex" ? "" : "flex"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
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
          <span className="eyebrow"><span className="dot" />Autonomous SRE · Zero Overhead</span>
          <h1>Your AI SRE<br /><span className="grad">never sleeps.</span></h1>
          <p className="lede">
            Quayard detects, investigates, and resolves production incidents autonomously —
            <b> before your engineers wake up.</b> Ship faster. Sleep better.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#cta">Book a Demo →</a>
            <a className="btn btn-ghost" href="#how">See How It Works</a>
          </div>
          <div className="trust-pills">
            <span><span className="tick">✓</span> 5-minute deploy</span>
            <span><span className="tick">✓</span> SOC 2 Compliant</span>
            <span><span className="tick">✓</span> 99.99% Uptime</span>
          </div>
        </div>
        <Reveal>
          <div className="hero-figure">
            <div className="hero-shot">
              <img src={asset("hero-topology.webp")} alt="Live infrastructure topology — all systems nominal, 99.98% 30-day uptime" loading="eager" />
            </div>
            <img className="mascot-float" src={asset("mascot.webp")} alt="Quayard — your AI SRE" />
          </div>
        </Reveal>
      </div>

      <div className="marquee">
        <div className="lbl">Trusted by world-class engineering teams</div>
        <div className="marquee-mask">
          <div className="marquee-track">
            {["Datadog","PagerDuty","AWS","Kubernetes","Grafana","Terraform","Docker","Prometheus","Slack","GitHub","Jenkins","Azure","GCP","Splunk","New Relic",
              "Datadog","PagerDuty","AWS","Kubernetes","Grafana","Terraform","Docker","Prometheus","Slack","GitHub","Jenkins","Azure","GCP","Splunk","New Relic"].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

type Step = { num: string; eta: string; label: string; title: string; desc: string; img?: string; imgAlt?: string; barTitle: string; logs: { ts: string; msg: string; cls?: string }[] };

function Autopsy() {
  const steps: Step[] = [
    {
      num: "01", eta: "Anomaly identified in 0.3s", label: "Detection", title: "See it the instant it drifts.",
      desc: "Quayard monitors every metric, log, and trace across your entire stack. When something deviates from the baseline, it catches it instantly — before alerts even fire.",
      img: asset("layers.webp"), imgAlt: "Detection phase — topology-aware signal correlation",
      barTitle: "detection · checkout-api",
      logs: [
        { ts: "08:42:03", msg: "↑ Latency spike detected: p99 > 1200ms", cls: "up" },
        { ts: "08:42:03", msg: "→ Service: checkout-api / us-east-1" },
        { ts: "08:42:04", msg: "→ Blast radius: 3 downstream services" },
      ],
    },
    {
      num: "02", eta: "Root cause isolated in 47s", label: "Reasoning", title: "Find the source, not the symptom.",
      desc: "The AI assembles a causal chain by correlating deployments, config changes, and infrastructure events. It doesn't just find symptoms — it finds the source.",
      img: asset("anomaly-pulse.webp"), imgAlt: "Reasoning phase — anomaly waveform and causal correlation",
      barTitle: "reasoning · causal-chain",
      logs: [
        { ts: "08:42:04", msg: "⚡ Hypothesis: deploy 7e2a91c @ 08:38", cls: "flag" },
        { ts: "08:42:18", msg: "→ Validating: DB query plan regression" },
        { ts: "08:42:50", msg: "✓ Root cause: missing index on orders.user_id", cls: "ok" },
      ],
    },
    {
      num: "03", eta: "Auto-remediated in 2m 14s", label: "Resolution", title: "The fix ships itself.",
      desc: "Quayard generates the fix, opens a PR, and rolls it out — or rolls back the offending deploy. Your engineers review the post-mortem, not the 3AM page.",
      barTitle: "resolution · auto-remediate",
      logs: [
        { ts: "08:44:17", msg: "⚙ Fix: CREATE INDEX idx_orders_user_id", cls: "flag" },
        { ts: "08:44:17", msg: "→ PR #1847 opened → auto-merged" },
        { ts: "08:44:17", msg: "✓ p99 latency restored: 142ms", cls: "ok" },
      ],
    },
  ];
  return (
    <section className="block soft" id="how">
      <div className="wrap">
        <div className="kicker">The Incident Autopsy</div>
        <h2>From alert to resolution<br /><span className="grad">in under 3 minutes.</span></h2>
        <p className="sub">Watch how Quayard autonomously handles a production incident — no human intervention required.</p>

        {steps.map((s, i) => (
          <Reveal key={s.num}>
            <div className={`autopsy-step ${i % 2 === 1 ? "flip" : ""}`}>
              <div className="step-copy">
                <div className="step-num">{s.num}</div>
                <div className="step-lbl">{s.label}</div>
                <div className="step-eta">{s.eta}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {s.img && (
                  <div className="step-shot"><img src={s.img} alt={s.imgAlt} loading="lazy" /></div>
                )}
                <div className="logcard">
                  <div className="lc-bar"><i className="r" /><i className="y" /><i className="g" /><span className="t">{s.barTitle}</span></div>
                  {s.logs.map((l, j) => (
                    <div className="logrow" key={j}><span className="ts">{l.ts}</span><span className={`msg ${l.cls ?? ""}`}>{l.msg}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Tab = { key: string; h: string; p: string; feats: string[]; legacy: string[]; smart: string[] };

function Platform() {
  const tabs: Tab[] = [
    {
      key: "Detect", h: "See everything. Miss nothing.",
      p: "Real-time anomaly detection across logs, metrics, traces, and events. Quayard understands your infrastructure topology and correlates signals across services to catch issues before they cascade.",
      feats: ["Multi-signal anomaly correlation", "Dynamic baseline learning", "Topology-aware blast radius analysis", "Zero-config auto-discovery"],
      legacy: ["Manual threshold alerts", "Siloed dashboards", "Alert fatigue (200+ daily)"],
      smart: ["AI-driven anomaly detection", "Unified signal correlation", "3 actionable alerts per day"],
    },
    {
      key: "Investigate", h: "Reason like your best engineer.",
      p: "Quayard assembles a causal chain across deploys, config changes and infra events — then validates each hypothesis against the evidence until it lands on the true root cause.",
      feats: ["Automated causal reasoning", "Deploy & config diffing", "Cross-service trace analysis", "Evidence-cited conclusions"],
      legacy: ["Manual log spelunking", "Guesswork & tribal knowledge", "Hours to root cause"],
      smart: ["Automated causal reasoning", "Evidence you can verify", "Root cause in ~47s"],
    },
    {
      key: "Resolve", h: "Fix it before the page.",
      p: "Quayard generates the remediation, opens a PR or rolls back the offending deploy, and executes under your approval policy — then writes the post-mortem for you.",
      feats: ["Auto-generated remediations", "PR + safe rollback workflows", "Approval-gated execution", "Automatic post-mortems"],
      legacy: ["Manual runbooks", "3AM pages", "Post-mortems written by hand"],
      smart: ["One-click or autonomous fixes", "Rollback in seconds", "Post-mortem generated for you"],
    },
  ];
  const [active, setActive] = useState(0);
  const t = tabs[active];
  return (
    <section className="block" id="platform">
      <div className="wrap">
        <div className="kicker">The Platform</div>
        <h2>Reliability, <span className="grad">redefined.</span></h2>
        <p className="sub">Three autonomous capabilities that transform how your team handles production.</p>
        <Reveal><div className="platform-shot"><img src={asset("platform-console.webp")} alt="Quayard developer console — modules, reasoning, and code in one workspace" loading="lazy" /></div></Reveal>
        <div className="tabs">
          {tabs.map((tb, i) => (
            <button key={tb.key} className={`tab ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>{tb.key}</button>
          ))}
        </div>
        <div className="panel">
          <div>
            <h3>{t.h}</h3>
            <p>{t.p}</p>
            <div className="flist">
              {t.feats.map((f) => <div key={f}><Check />{f}</div>)}
            </div>
          </div>
          <div className="vs">
            <div className="vs-card legacy">
              <h4>Legacy Monitoring</h4>
              <ul>{t.legacy.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
            <div className="vs-card smart">
              <h4>Quayard Intelligence</h4>
              <ul>{t.smart.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Results() {
  const r = [
    { n: "95%", l: "MTTR Reduction", s: "Mean time to resolution" },
    { n: "47s", l: "Avg Root Cause", s: "Time to identify root cause" },
    { n: "12,000+", l: "Hours Saved", s: "Engineering hours per year" },
    { n: "99.98%", l: "Accuracy", s: "Root cause analysis accuracy" },
  ];
  return (
    <section className="block soft" id="results">
      <div className="wrap">
        <div className="kicker">Proven Results</div>
        <h2>Quantifiable <span className="grad">impact.</span></h2>
        <p className="sub" />
        <div className="results">
          {r.map((x) => (
            <Reveal key={x.l}><div className="result"><div className="n grad">{x.n}</div><div className="l">{x.l}</div><div className="s">{x.s}</div></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const q = [
    { t: "Quayard resolved a cascading database failure at 2AM while our entire on-call team slept. By morning, we had a full post-mortem and a PR preventing recurrence. That's not a tool — that's a teammate.", nm: "Sarah Chen", rl: "VP of Engineering · Series C Fintech", av: "S" },
    { t: "We went from 200+ pages a week to under 10. MTTR dropped from 45 minutes to under 3. Our SRE team finally has time to work on reliability instead of fighting fires.", nm: "Marcus Rivera", rl: "Head of Platform · Enterprise SaaS", av: "M" },
    { t: "The reasoning engine is genuinely impressive. It traced a latency spike back to a feature flag change three deployments ago. No human would have found that correlation in under an hour.", nm: "Dr. Anika Patel", rl: "CTO · Healthcare Platform", av: "A" },
  ];
  return (
    <section className="block">
      <div className="wrap">
        <div className="kicker">From Engineering Leaders</div>
        <h2>What teams <span className="grad">are saying.</span></h2>
        <p className="sub" />
        <div className="quotes">
          {q.map((it) => (
            <Reveal key={it.nm}>
              <div className="quote">
                <p>“{it.t}”</p>
                <div className="who"><span className="av">{it.av}</span><div><div className="nm">{it.nm}</div><div className="rl">{it.rl}</div></div></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Integrations() {
  const cats = [
    { h: "Observability", items: ["Datadog", "Grafana", "Prometheus", "New Relic", "Splunk", "Dynatrace"] },
    { h: "Cloud", items: ["AWS", "GCP", "Azure", "DigitalOcean"] },
    { h: "Orchestration", items: ["Kubernetes", "Docker", "Terraform", "Ansible"] },
    { h: "Communication", items: ["Slack", "PagerDuty", "Opsgenie", "Teams"] },
    { h: "Source", items: ["GitHub", "GitLab", "Bitbucket", "Jira"] },
  ];
  return (
    <section className="block soft" id="integrations">
      <div className="wrap">
        <div className="kicker">Integrations</div>
        <h2>Plugs into your <span className="grad">existing stack.</span></h2>
        <p className="sub">Quayard connects to your observability, cloud, CI/CD, and communication tools out of the box. No agents to install. No data to migrate.</p>
        <div className="int-grid">
          {cats.map((c) => (
            <Reveal key={c.h}>
              <div className="int-cat">
                <h4>{c.h}</h4>
                {c.items.map((it) => <span key={it}>{it}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section className="block" id="cta">
      <div className="wrap">
        <Reveal>
          <div className="cta-panel">
            <div className="kicker">Get Started</div>
            <h2>Deploy Quayard<br />in 5 minutes.</h2>
            <p className="sub">No agents to install. No data to migrate. Connect your observability stack and let Quayard start protecting your production systems immediately.</p>
            <div className="row">
              <a className="btn btn-primary" href="mailto:founder@quayard.ai?subject=Quayard%20demo">Book a Demo</a>
              <a className="btn btn-ghost" href="mailto:founder@quayard.ai?subject=Quayard%20trial">Start Free Trial</a>
            </div>
            <div className="fine">
              <span><span className="tick">✓</span> 5-minute setup</span>
              <span><span className="tick">✓</span> SOC 2 Type II</span>
              <span><span className="tick">✓</span> No credit card required</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: "Platform", links: ["Detection", "Investigation", "Resolution", "Integrations", "Changelog"] },
    { h: "Resources", links: ["Documentation", "API Reference", "Blog", "Case Studies", "Status"] },
    { h: "Company", links: ["About", "Careers", "Contact", "Press Kit"] },
    { h: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "DPA"] },
  ];
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Brand />
            <p>The autonomous AI SRE platform that detects, investigates, and resolves incidents — so your engineers don't have to.</p>
          </div>
          {cols.map((c) => (
            <div className="foot-col" key={c.h}>
              <h5>{c.h}</h5>
              {c.links.map((l) => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Quayard Inc. All rights reserved.</p>
          <div className="foot-social"><a href="#">Twitter / X</a><a href="#">LinkedIn</a><a href="#">GitHub</a></div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Autopsy />
        <Platform />
        <Results />
        <Testimonials />
        <Integrations />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
