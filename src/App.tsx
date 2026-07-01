import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate, type Variants } from "framer-motion";
import { ScrollExpansionHero } from "@/components/scroll-expansion-hero";
import { AnimatedTestimonials, type Testimonial } from "@/components/ui/animated-testimonials";
import { UniqueTestimonial } from "@/components/ui/unique-testimonial";

const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* scroll reveal */
const up: Variants = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: EASE } } }}>
      {children}
    </motion.div>
  );
}
/* stagger container + item */
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } };
const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } };

/* count-up */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const m = value.match(/^([^\d-]*)([\d.,]+)(.*)$/);
  const prefix = m?.[1] ?? "", raw = m?.[2] ?? "", suffix = m?.[3] ?? "";
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const target = parseFloat(raw.replace(/,/g, ""));
  const [disp, setDisp] = useState(isNaN(target) ? value : prefix + "0" + suffix);
  useEffect(() => {
    if (!inView || isNaN(target)) return;
    const c = animate(0, target, { duration: 1.5, ease: EASE, onUpdate: (v) => {
      const s = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
      setDisp(prefix + s + suffix);
    } });
    return () => c.stop();
  }, [inView]);
  return <span ref={ref}>{disp}</span>;
}

const Mark = () => <img className="brand-logo" src={asset("logo.webp")} alt="Quayard" />;
const Brand = () => (<a className="brand" href="#top"><Mark />Quayard<sup>.ai</sup></a>);
const Check = () => (<span className="ck"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7" /></svg></span>);

function Nav() {
  return (
    <header>
      <motion.div className="nav" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}>
        <Brand />
        <nav className="nav-links">
          <a href="#platform">Platform</a><a href="#how">How It Works</a><a href="#results">Results</a><a href="#integrations">Integrations</a>
        </nav>
        <div className="nav-cta">
          <a className="nav-signin" href="#">Sign In</a>
          <a className="btn btn-primary" href="#cta">Book a Demo</a>
          <button className="burger" aria-label="Menu" onClick={() => { const el = document.querySelector<HTMLElement>(".nav-links"); if (el) el.style.display = el.style.display === "flex" ? "" : "flex"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </motion.div>
    </header>
  );
}

function Hero() {
  return (
    <>
      <ScrollExpansionHero
        media={asset("hero-topology.webp")}
        mediaAlt="Live infrastructure topology — all systems nominal, 99.98% 30-day uptime"
        eyebrow={
          <>
            <img className="se-mascot" src={asset("mascot.webp")} alt="Quayard mascot" />
            <span className="eyebrow"><span className="dot" />Autonomous SRE · Zero Overhead</span>
          </>
        }
        title={<>Your AI SRE <span className="grad">never sleeps.</span></>}
        subtitle={<>Quayard detects, investigates, and resolves production incidents autonomously — <b style={{ color: "var(--ink)", fontWeight: 600 }}>before your engineers wake up.</b></>}
        actions={
          <>
            <a className="btn btn-primary" href="#cta">Book a Demo →</a>
            <a className="btn btn-ghost" href="#how">See How It Works</a>
          </>
        }
        overlay={<div className="se-cap-title grad">See it run in production.</div>}
      />

      <div className="marquee">
        <div className="lbl">Trusted by world-class engineering teams</div>
        <div className="marquee-mask">
          <div className="marquee-track">
            {["Datadog","PagerDuty","AWS","Kubernetes","Grafana","Terraform","Docker","Prometheus","Slack","GitHub","Jenkins","Azure","GCP","Splunk","New Relic",
              "Datadog","PagerDuty","AWS","Kubernetes","Grafana","Terraform","Docker","Prometheus","Slack","GitHub","Jenkins","Azure","GCP","Splunk","New Relic"].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

type Step = { num: string; eta: string; label: string; title: string; desc: string; img?: string; imgAlt?: string; barTitle: string; logs: { ts: string; msg: string; cls?: string }[] };
function Autopsy() {
  const steps: Step[] = [
    { num: "01", eta: "Anomaly identified in 0.3s", label: "Detection", title: "See it the instant it drifts.",
      desc: "Quayard monitors every metric, log, and trace across your entire stack. When something deviates from the baseline, it catches it instantly — before alerts even fire.",
      img: asset("layers.webp"), imgAlt: "Detection — topology-aware signal correlation", barTitle: "detection · checkout-api",
      logs: [{ ts: "08:42:03", msg: "↑ Latency spike detected: p99 > 1200ms", cls: "up" }, { ts: "08:42:03", msg: "→ Service: checkout-api / us-east-1" }, { ts: "08:42:04", msg: "→ Blast radius: 3 downstream services" }] },
    { num: "02", eta: "Root cause isolated in 47s", label: "Reasoning", title: "Find the source, not the symptom.",
      desc: "The AI assembles a causal chain by correlating deployments, config changes, and infrastructure events. It doesn't just find symptoms — it finds the source.",
      img: asset("anomaly-pulse.webp"), imgAlt: "Reasoning — anomaly waveform and causal correlation", barTitle: "reasoning · causal-chain",
      logs: [{ ts: "08:42:04", msg: "⚡ Hypothesis: deploy 7e2a91c @ 08:38", cls: "flag" }, { ts: "08:42:18", msg: "→ Validating: DB query plan regression" }, { ts: "08:42:50", msg: "✓ Root cause: missing index on orders.user_id", cls: "ok" }] },
    { num: "03", eta: "Auto-remediated in 2m 14s", label: "Resolution", title: "The fix ships itself.",
      desc: "Quayard generates the fix, opens a PR, and rolls it out — or rolls back the offending deploy. Your engineers review the post-mortem, not the 3AM page.",
      barTitle: "resolution · auto-remediate",
      logs: [{ ts: "08:44:17", msg: "⚙ Fix: CREATE INDEX idx_orders_user_id", cls: "flag" }, { ts: "08:44:17", msg: "→ PR #1847 opened → auto-merged" }, { ts: "08:44:17", msg: "✓ p99 latency restored: 142ms", cls: "ok" }] },
  ];
  return (
    <section className="block soft" id="how">
      <div className="wrap">
        <Reveal><div className="kicker">The Incident Autopsy</div></Reveal>
        <Reveal delay={0.05}><h2>From alert to resolution<br /><span className="grad">in under 3 minutes.</span></h2></Reveal>
        <Reveal delay={0.1}><p className="sub">Watch how Quayard autonomously handles a production incident — no human intervention required.</p></Reveal>
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
                {s.img && <div className="step-shot"><img src={s.img} alt={s.imgAlt} loading="lazy" /></div>}
                <div className="logcard">
                  <div className="lc-bar"><i className="r" /><i className="y" /><i className="g" /><span className="t">{s.barTitle}</span></div>
                  {s.logs.map((l, j) => <div className="logrow" key={j}><span className="ts">{l.ts}</span><span className={`msg ${l.cls ?? ""}`}>{l.msg}</span></div>)}
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
    { key: "Detect", h: "See everything. Miss nothing.", p: "Real-time anomaly detection across logs, metrics, traces, and events. Quayard understands your infrastructure topology and correlates signals across services to catch issues before they cascade.",
      feats: ["Multi-signal anomaly correlation", "Dynamic baseline learning", "Topology-aware blast radius analysis", "Zero-config auto-discovery"],
      legacy: ["Manual threshold alerts", "Siloed dashboards", "Alert fatigue (200+ daily)"], smart: ["AI-driven anomaly detection", "Unified signal correlation", "3 actionable alerts per day"] },
    { key: "Investigate", h: "Reason like your best engineer.", p: "Quayard assembles a causal chain across deploys, config changes and infra events — then validates each hypothesis against the evidence until it lands on the true root cause.",
      feats: ["Automated causal reasoning", "Deploy & config diffing", "Cross-service trace analysis", "Evidence-cited conclusions"],
      legacy: ["Manual log spelunking", "Guesswork & tribal knowledge", "Hours to root cause"], smart: ["Automated causal reasoning", "Evidence you can verify", "Root cause in ~47s"] },
    { key: "Resolve", h: "Fix it before the page.", p: "Quayard generates the remediation, opens a PR or rolls back the offending deploy, and executes under your approval policy — then writes the post-mortem for you.",
      feats: ["Auto-generated remediations", "PR + safe rollback workflows", "Approval-gated execution", "Automatic post-mortems"],
      legacy: ["Manual runbooks", "3AM pages", "Post-mortems written by hand"], smart: ["One-click or autonomous fixes", "Rollback in seconds", "Post-mortem generated for you"] },
  ];
  const [active, setActive] = useState(0);
  const t = tabs[active];
  return (
    <section className="block" id="platform">
      <div className="wrap">
        <Reveal><div className="kicker">The Platform</div></Reveal>
        <Reveal delay={0.05}><h2>Reliability, <span className="grad">redefined.</span></h2></Reveal>
        <Reveal delay={0.1}><p className="sub">Three autonomous capabilities that transform how your team handles production.</p></Reveal>
        <Reveal delay={0.12}><div className="platform-shot"><img src={asset("platform-console.webp")} alt="Quayard developer console" loading="lazy" /></div></Reveal>
        <Reveal delay={0.05}>
          <div className="tabs">{tabs.map((tb, i) => <button key={tb.key} className={`tab ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>{tb.key}</button>)}</div>
        </Reveal>
        <motion.div className="panel" key={t.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
          <div>
            <h3>{t.h}</h3><p>{t.p}</p>
            <div className="flist">{t.feats.map((f) => <div key={f}><Check />{f}</div>)}</div>
          </div>
          <div className="vs">
            <div className="vs-card legacy"><h4>Legacy Monitoring</h4><ul>{t.legacy.map((l) => <li key={l}>{l}</li>)}</ul></div>
            <div className="vs-card smart"><h4>Quayard Intelligence</h4><ul>{t.smart.map((l) => <li key={l}>{l}</li>)}</ul></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section className="block soft" id="results">
      <div className="wrap">
        <Reveal><div className="kicker">Proven Results</div></Reveal>
        <Reveal delay={0.05}><h2>Quantifiable <span className="grad">impact.</span></h2></Reveal>
        <div className="results-bento">
          <Reveal className="rb-hero">
            <div className="rb-hero-inner">
              <div className="n grad"><CountUp value="95%" /></div>
              <div className="rb-hero-l">MTTR reduction</div>
              <p>Mean time to resolution collapses from 45 minutes to under 3 — the 3AM war room becomes a morning post-mortem.</p>
              <div className="bars">{[42, 64, 50, 82, 60, 96, 74, 90].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
            </div>
          </Reveal>
          <Reveal className="rb"><div><div className="n"><CountUp value="47s" /></div><div className="l">Avg root cause</div><div className="s">Time to identify root cause</div></div></Reveal>
          <Reveal className="rb"><div><div className="n"><CountUp value="12,000+" /></div><div className="l">Hours saved</div><div className="s">Engineering hours per year</div></div></Reveal>
          <Reveal className="rb"><div><div className="n"><CountUp value="99.98%" /></div><div className="l">Accuracy</div><div className="s">Root cause analysis accuracy</div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS: Testimonial[] = [
  { quote: "Quayard resolved a cascading database failure at 2AM while our entire on-call team slept. By morning, we had a full post-mortem and a PR preventing recurrence. That's not a tool — that's a teammate.", name: "Sarah Chen", designation: "VP of Engineering · Series C Fintech", initials: "SC" },
  { quote: "We went from 200+ pages a week to under 10. MTTR dropped from 45 minutes to under 3. Our SRE team finally has time to work on reliability instead of fighting fires.", name: "Marcus Rivera", designation: "Head of Platform · Enterprise SaaS", initials: "MR" },
  { quote: "The reasoning engine is genuinely impressive. It traced a latency spike back to a feature flag change three deployments ago. No human would have found that correlation in under an hour.", name: "Dr. Anika Patel", designation: "CTO · Healthcare Platform", initials: "AP" },
];

function Testimonials() {
  return (
    <section className="block">
      <div className="wrap">
        <Reveal><div className="kicker">From Engineering Leaders</div></Reveal>
        <Reveal delay={0.05}><h2>What teams <span className="grad">are saying.</span></h2></Reveal>
        <Reveal delay={0.1}><p className="sub">Root cause in minutes, not war rooms — from the people who ship on Quayard.</p></Reveal>

        <div style={{ marginBottom: 40 }}>
          <UniqueTestimonial
            quote="Quayard resolved a cascading database failure at 2AM while our entire on-call team slept. By morning, we had a full post-mortem and a PR preventing recurrence."
            name="Sarah Chen" role="VP of Engineering · Series C Fintech" initials="SC"
            metric={{ value: "2AM", label: "resolved while asleep" }}
          />
        </div>

        <AnimatedTestimonials testimonials={TESTIMONIALS} />
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
        <Reveal><div className="kicker">Integrations</div></Reveal>
        <Reveal delay={0.05}><h2>Plugs into your <span className="grad">existing stack.</span></h2></Reveal>
        <Reveal delay={0.1}><p className="sub">Quayard connects to your observability, cloud, CI/CD, and communication tools out of the box. No agents to install. No data to migrate.</p></Reveal>
        <div className="int-grid">
          {cats.map((c, i) => (
            <Reveal key={c.h} delay={i * 0.06}><div className="int-cat"><h4>{c.h}</h4>{c.items.map((it) => <span key={it}>{it}</span>)}</div></Reveal>
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
              <span><span className="tick">✓</span> 5-minute setup</span><span><span className="tick">✓</span> SOC 2 Type II</span><span><span className="tick">✓</span> No credit card required</span>
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
          <div className="foot-brand"><Brand /><p>The autonomous AI SRE platform that detects, investigates, and resolves incidents — so your engineers don't have to.</p></div>
          {cols.map((c) => <div className="foot-col" key={c.h}><h5>{c.h}</h5>{c.links.map((l) => <a href="#" key={l}>{l}</a>)}</div>)}
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
        <Hero /><Autopsy /><Platform /><Results /><Testimonials /><Integrations /><GetStarted />
      </main>
      <Footer />
    </>
  );
}
