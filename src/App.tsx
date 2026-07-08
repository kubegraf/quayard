import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate, type Variants } from "framer-motion";
import { OpsConsole } from "@/components/ops-console";

const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------- motion */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE } } }}>
      {children}
    </motion.div>
  );
}
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

/* --------------------------------------------------------------- count-up */
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
    const c = animate(0, target, { duration: 1.6, ease: EASE, onUpdate: (v) => {
      const s = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
      setDisp(prefix + s + suffix);
    } });
    return () => c.stop();
  }, [inView]);
  return <span ref={ref}>{disp}</span>;
}

/* ----------------------------------------------------------------- shared */
const Brand = () => (
  <a className="brand" href="#top">
    <span className="brand-mark"><img src={asset("logo.webp")} alt="" /></span>
    Quayard<sup>.ai</sup>
  </a>
);

function SectionHead({ index, kicker, title, sub }: { index: string; kicker: string; title: ReactNode; sub?: string }) {
  return (
    <div className="shead">
      <Reveal><div className="kicker"><span className="kix">{index}</span>{kicker}</div></Reveal>
      <Reveal delay={0.06}><h2>{title}</h2></Reveal>
      {sub && <Reveal delay={0.12}><p className="sub">{sub}</p></Reveal>}
    </div>
  );
}

/* -------------------------------------------------------------------- nav */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["#how", "How it works"], ["#platform", "Platform"], ["#results", "Results"], ["#integrations", "Integrations"]] as const;
  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-in">
        <Brand />
        <nav className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <a className="nav-links-cta" href="#cta">Book a demo</a>
        </nav>
        <div className="nav-cta">
          <a className="nav-signin" href="#">Sign in</a>
          <a className="btn btn-primary sm" href="#cta">Book a demo</a>
          <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- hero */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden />
      <div className="wrap hero-grid">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show">
          <motion.span className="eyebrow" variants={item}><span className="dot" />AUTONOMOUS SRE · ALWAYS ON-CALL</motion.span>
          <motion.h1 variants={item}>
            Incidents resolve<br />themselves at <span className="hl">3AM.</span>
          </motion.h1>
          <motion.p className="lede" variants={item}>
            Quayard is an AI SRE that detects anomalies, isolates root cause with cited evidence,
            and ships the fix — <b>while your on-call rotation sleeps.</b>
          </motion.p>
          <motion.div className="hero-cta" variants={item}>
            <a className="btn btn-primary" href="#cta">Book a demo</a>
            <a className="btn btn-ghost" href="#how">Watch it work <span className="arr">→</span></a>
          </motion.div>
          <motion.div className="trust-row" variants={item}>
            <span>5-minute deploy</span><i /><span>SOC 2 Type II</span><i /><span>Self-hosted or cloud</span>
          </motion.div>
        </motion.div>

        <motion.div className="hero-figure" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25, ease: EASE }}>
          <OpsConsole />
          <div className="hero-figure-glow" aria-hidden />
        </motion.div>
      </div>

      <div className="marquee">
        <div className="marquee-lbl">Works with the stack you already run</div>
        <div className="marquee-mask">
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, k) =>
              ["Datadog", "PagerDuty", "AWS", "Kubernetes", "Grafana", "Terraform", "Prometheus", "Slack", "GitHub", "Azure", "GCP", "Splunk", "New Relic", "Opsgenie"]
                .map((t) => <span key={`${k}-${t}`}>{t}</span>))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- how it works */
type Step = {
  num: string; tag: string; time: string; title: string; desc: string;
  logs: { ts: string; msg: string; cls?: string }[];
};
function HowItWorks() {
  const steps: Step[] = [
    {
      num: "01", tag: "DETECT", time: "T+0.3s", title: "It sees the drift before the alert fires.",
      desc: "Quayard baselines every metric, log stream, and trace in your stack. The moment something deviates, it maps the blast radius across your service topology — no thresholds to tune, no dashboards to babysit.",
      logs: [
        { ts: "03:12:04", msg: "↑ p99 latency 1,240ms · checkout-api / us-east-1", cls: "hot" },
        { ts: "03:12:04", msg: "→ baseline deviation 6.9σ · confidence 0.98" },
        { ts: "03:12:05", msg: "→ blast radius: payments, cart, orders-db" },
      ],
    },
    {
      num: "02", tag: "DIAGNOSE", time: "T+47s", title: "It finds the cause, and shows its work.",
      desc: "The reasoning engine builds a causal chain across deploys, config changes, and infra events — then validates each hypothesis against the evidence. Every conclusion ships with citations you can check.",
      logs: [
        { ts: "03:12:31", msg: "⚡ hypothesis: deploy 7e2a91c @ 03:08 UTC", cls: "warn" },
        { ts: "03:12:44", msg: "→ validating: query-plan diff on orders service" },
        { ts: "03:12:51", msg: "✓ root cause: missing index on orders.user_id", cls: "ok" },
      ],
    },
    {
      num: "03", tag: "REMEDIATE", time: "T+2m 41s", title: "The fix ships under your policy.",
      desc: "Quayard drafts the remediation — a PR, a rollback, a config change — and executes it under the approval policy you set. Fully autonomous, one-click, or read-only: you decide per environment.",
      logs: [
        { ts: "03:13:22", msg: "⚙ CREATE INDEX CONCURRENTLY idx_orders_user_id", cls: "warn" },
        { ts: "03:14:40", msg: "→ PR #1847 · checks green · merged & deployed" },
        { ts: "03:14:45", msg: "✓ p99 recovered → 142ms · post-mortem drafted", cls: "ok" },
      ],
    },
  ];
  return (
    <section className="block" id="how">
      <div className="wrap">
        <SectionHead index="01" kicker="How it works"
          title={<>One incident, replayed.<br /><span className="hl">Zero humans paged.</span></>}
          sub="This is a real incident pattern, end to end. Quayard handled every phase before the on-call engineer's phone would have buzzed." />
        <div className="timeline">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.05}>
              <div className="tstep">
                <div className="tstep-rail">
                  <span className="tstep-node">{s.num}</span>
                  {i < steps.length - 1 && <span className="tstep-line" />}
                </div>
                <div className="tstep-body">
                  <div className="tstep-meta">
                    <span className={`ttag ${s.tag.toLowerCase()}`}>{s.tag}</span>
                    <span className="ttime">{s.time}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <div className="logcard">
                  <div className="lc-bar"><i /><i /><i /><span>{s.tag.toLowerCase()} · checkout-api</span></div>
                  {s.logs.map((l, j) => (
                    <div className="logrow" key={j}><span className="ts">{l.ts}</span><span className={`msg ${l.cls ?? ""}`}>{l.msg}</span></div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- platform */
function MiniTopology() {
  return (
    <svg className="mini-topo" viewBox="0 0 220 120" fill="none" aria-hidden>
      {[[30, 30], [110, 18], [190, 34], [64, 96], [156, 92]].map(([x, y], i) => (
        <g key={i}>
          <line x1={110} y1={58} x2={x} y2={y} className="mt-edge" />
          <circle cx={x} cy={y} r="5" className="mt-node" />
        </g>
      ))}
      <circle cx="110" cy="58" r="8" className="mt-core" />
      <circle cx="110" cy="58" r="8" className="mt-ping" />
    </svg>
  );
}
function MiniDiff() {
  return (
    <div className="mini-diff" aria-hidden>
      <div className="dl del"><span>-</span> retry_budget: unlimited</div>
      <div className="dl add"><span>+</span> retry_budget: 3 · backoff: exp</div>
      <div className="dl add"><span>+</span> CREATE INDEX idx_orders_user_id</div>
      <div className="dl ctx"><span>#</span> PR #1847 · auto-merged 03:14 UTC</div>
    </div>
  );
}
function MiniChain() {
  const rows = [
    ["deploy 7e2a91c", "03:08:12"],
    ["query plan regressed", "03:11:58"],
    ["p99 breach · 6.9σ", "03:12:04"],
    ["root cause · cited", "03:12:51"],
  ];
  return (
    <div className="mini-chain" aria-hidden>
      {rows.map(([t, ts], i) => (
        <div className="mc-row" key={i}>
          <span className="mc-dot" /><span className="mc-t">{t}</span><span className="mc-ts">{ts}</span>
        </div>
      ))}
    </div>
  );
}
function Platform() {
  return (
    <section className="block soft" id="platform">
      <div className="wrap">
        <SectionHead index="02" kicker="The platform"
          title={<>An SRE&apos;s judgment.<br /><span className="hl">A machine&apos;s vigilance.</span></>}
          sub="Six capabilities, one autonomous loop — from the first anomalous datapoint to the written post-mortem." />
        <div className="bento">
          <Reveal className="bcard wide">
            <div>
              <MiniTopology />
              <h3>Topology-aware detection</h3>
              <p>Quayard learns your service graph and correlates metrics, logs, and traces across it — so one root anomaly never becomes 200 duplicate alerts.</p>
            </div>
          </Reveal>
          <Reveal className="bcard wide" delay={0.05}>
            <div>
              <MiniChain />
              <h3>Causal reasoning</h3>
              <p>Hypotheses are tested against deploys, config diffs, and infra events until the chain holds — with evidence cited at every link.</p>
            </div>
          </Reveal>
          <Reveal className="bcard" delay={0.08}>
            <div>
              <MiniDiff />
              <h3>Safe remediation</h3>
              <p>Fixes ship as reviewable PRs or instant rollbacks, gated by per-environment approval policies you control.</p>
            </div>
          </Reveal>
          <Reveal className="bcard" delay={0.1}>
            <div>
              <div className="mini-doc" aria-hidden>
                <b>POST-MORTEM · INC-4721</b>
                <i style={{ width: "92%" }} /><i style={{ width: "78%" }} /><i style={{ width: "86%" }} /><i style={{ width: "54%" }} />
              </div>
              <h3>Post-mortems, written</h3>
              <p>Timeline, root cause, impact, and prevention items — drafted by the agent the moment the incident closes.</p>
            </div>
          </Reveal>
          <Reveal className="bcard" delay={0.12}>
            <div>
              <div className="mini-policy" aria-hidden>
                <div className="mp-row"><span>production</span><em className="lvl approve">approval required</em></div>
                <div className="mp-row"><span>staging</span><em className="lvl auto">fully autonomous</em></div>
                <div className="mp-row"><span>database migrations</span><em className="lvl review">read-only + suggest</em></div>
              </div>
              <h3>Guardrails you define</h3>
              <p>Zero-trust by design. Scope the agent's permissions per environment and per action class — every step is logged, auditable, and reversible.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- results */
function Results() {
  const stats = [
    { n: "95%", l: "MTTR reduction", s: "45 minutes → under 3" },
    { n: "47s", l: "median time to root cause", s: "with cited evidence" },
    { n: "12,000+", l: "engineering hours saved", s: "per team, per year" },
    { n: "0", l: "pages at 3AM", s: "your on-call, finally quiet" },
  ];
  return (
    <section className="block" id="results">
      <div className="wrap">
        <SectionHead index="03" kicker="Results"
          title={<>The pager goes quiet.<br /><span className="hl">The graphs go flat.</span></>} />
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.l} delay={i * 0.06}>
              <div>
                <div className="stat-n"><CountUp value={s.n} /></div>
                <div className="stat-l">{s.l}</div>
                <div className="stat-s">{s.s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ testimonials */
function Testimonials() {
  const quotes = [
    {
      big: true,
      q: "Quayard resolved a cascading database failure at 2AM while our entire on-call team slept. By morning we had a full post-mortem and a PR preventing recurrence. That's not a tool — that's a teammate.",
      name: "Sarah Chen", role: "VP of Engineering · Series C fintech", init: "SC",
    },
    {
      q: "We went from 200+ pages a week to under 10. Our SRE team finally works on reliability instead of fighting fires.",
      name: "Marcus Rivera", role: "Head of Platform · enterprise SaaS", init: "MR",
    },
    {
      q: "It traced a latency spike to a feature flag three deploys back. No human finds that correlation in under an hour.",
      name: "Dr. Anika Patel", role: "CTO · healthcare platform", init: "AP",
    },
  ];
  return (
    <section className="block soft" id="teams">
      <div className="wrap">
        <SectionHead index="04" kicker="From engineering leaders"
          title={<>Trusted where <span className="hl">downtime is expensive.</span></>} />
        <div className="quotes">
          {quotes.map((t, i) => (
            <Reveal className={`quote ${t.big ? "big" : ""}`} key={t.name} delay={i * 0.06}>
              <figure>
                <div className="quote-mark" aria-hidden>
                  <svg viewBox="0 0 24 24" width="54" height="54" fill="currentColor">
                    <path d="M4 12c0-4 2.4-7 6-8l.8 1.8C8.4 7 7.2 8.6 7 10.4c.3-.1.7-.2 1.1-.2 1.9 0 3.3 1.4 3.3 3.4 0 2-1.5 3.4-3.5 3.4C5.5 17 4 15 4 12Zm9.6 0c0-4 2.4-7 6-8l.8 1.8c-2.4 1.2-3.6 2.8-3.8 4.6.3-.1.7-.2 1.1-.2 1.9 0 3.3 1.4 3.3 3.4 0 2-1.5 3.4-3.5 3.4-2.4 0-3.9-2-3.9-5Z" />
                  </svg>
                </div>
                <blockquote>{t.q}</blockquote>
                <figcaption>
                  <span className="avatar">{t.init}</span>
                  <span><b>{t.name}</b><br /><small>{t.role}</small></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ integrations */
function Integrations() {
  const cats = [
    { h: "Observability", items: ["Datadog", "Grafana", "Prometheus", "New Relic", "Splunk", "Dynatrace"] },
    { h: "Cloud & infra", items: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform", "Docker"] },
    { h: "Incident & comms", items: ["PagerDuty", "Opsgenie", "Slack", "Teams"] },
    { h: "Source & delivery", items: ["GitHub", "GitLab", "Bitbucket", "Jira", "Jenkins"] },
  ];
  return (
    <section className="block" id="integrations">
      <div className="wrap">
        <SectionHead index="05" kicker="Integrations"
          title={<>Plugs into your <span className="hl">existing stack.</span></>}
          sub="No agents to install, no data to migrate. Connect your observability, cloud, and comms tools — Quayard starts learning in minutes." />
        <div className="int-grid">
          {cats.map((c, i) => (
            <Reveal key={c.h} delay={i * 0.05}>
              <div className="int-cat">
                <h4>{c.h}</h4>
                <div className="int-chips">{c.items.map((it) => <span key={it}>{it}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- CTA */
function Cta() {
  return (
    <section className="block" id="cta">
      <div className="wrap">
        <Reveal>
          <div className="cta-panel">
            <div className="cta-grid-bg" aria-hidden />
            <img className="cta-mascot" src={asset("mascot.webp")} alt="" aria-hidden />
            <div className="kicker center"><span className="kix">06</span>Get started</div>
            <h2>Put an SRE on-call<br />that <span className="hl">never sleeps.</span></h2>
            <p className="sub">Connect your stack in five minutes. Quayard starts in read-only mode — see what it would have caught before you grant it a single permission.</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="mailto:founder@quayard.ai?subject=Quayard%20demo">Book a demo</a>
              <a className="btn btn-ghost" href="mailto:founder@quayard.ai?subject=Quayard%20trial">Start free trial</a>
            </div>
            <div className="cta-fine">
              <span>5-minute setup</span><i /><span>SOC 2 Type II</span><i /><span>No credit card required</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- footer */
function Footer() {
  const cols = [
    { h: "Platform", links: ["Detection", "Diagnosis", "Remediation", "Integrations", "Changelog"] },
    { h: "Resources", links: ["Documentation", "API reference", "Blog", "Case studies", "Status"] },
    { h: "Company", links: ["About", "Careers", "Contact", "Press kit"] },
    { h: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
  ];
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Brand />
            <p>The autonomous AI SRE that detects, diagnoses, and resolves production incidents — and shows its work.</p>
            <div className="foot-status"><span className="dot" />All systems operational</div>
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
        <HowItWorks />
        <Platform />
        <Results />
        <Testimonials />
        <Integrations />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
