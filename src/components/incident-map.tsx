/**
 * IncidentMap — a light-themed "tactical detection map": topographic contours,
 * a rotating radar sweep, an amber incident epicenter with pulsing pings, and
 * violet correlation beams tracing out to service nodes. Pure SVG + SMIL, so
 * it animates without JS and stays crisp at any size. Themed to match the site.
 */
const AMBER = "#f79009";
const V = "#7c5cff";
const V2 = "#a855f7";

const nodes = [
  { x: 108, y: 96, label: "api-gateway" },
  { x: 402, y: 104, label: "orders-db" },
  { x: 452, y: 286, label: "cache" },
  { x: 120, y: 300, label: "queue" },
  { x: 300, y: 356, label: "workers" },
];
const CX = 262;
const CY = 200;

export function IncidentMap() {
  return (
    <div className="imap">
      <div className="imap-grid" aria-hidden />
      <svg className="imap-svg" viewBox="0 0 520 400" fill="none" aria-hidden>
        <defs>
          <radialGradient id="sweep" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={V} stopOpacity="0.28" />
            <stop offset="100%" stopColor={V} stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* topographic contours */}
        {[150, 118, 86, 56].map((r, i) => (
          <ellipse key={i} cx={CX} cy={CY} rx={r * 1.15} ry={r} stroke={V} strokeOpacity={0.16} strokeWidth="1" />
        ))}

        {/* rotating radar sweep */}
        <g>
          <path d={`M${CX},${CY} L${CX},${CY - 168} A168,168 0 0 1 ${CX + 120},${CY - 118} Z`} fill="url(#sweep)">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="7s" repeatCount="indefinite" />
          </path>
        </g>

        {/* correlation beams + traveling packets */}
        {nodes.map((n, i) => {
          const len = Math.hypot(n.x - CX, n.y - CY);
          return (
            <g key={i}>
              <line x1={CX} y1={CY} x2={n.x} y2={n.y} stroke={V} strokeOpacity="0.5" strokeWidth="1.4"
                strokeDasharray={len} strokeDashoffset={len}>
                <animate attributeName="stroke-dashoffset" from={len} to="0" dur="1.1s" begin={`${0.25 * i}s`} fill="freeze" />
              </line>
              <circle r="3" fill={V2}>
                <animate attributeName="cx" values={`${CX};${n.x}`} dur="1.6s" begin={`${1.2 + 0.35 * i}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${CY};${n.y}`} dur="1.6s" begin={`${1.2 + 0.35 * i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" begin={`${1.2 + 0.35 * i}s`} repeatCount="indefinite" />
              </circle>
              {/* service node */}
              <circle cx={n.x} cy={n.y} r="4.5" fill="#fff" stroke={V} strokeWidth="1.6" />
              <circle cx={n.x} cy={n.y} r="4.5" fill="none" stroke={V} strokeWidth="1.4">
                <animate attributeName="r" values="4.5;13" dur="2.4s" begin={`${0.4 * i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.4s" begin={`${0.4 * i}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* incident epicenter pings */}
        {[0, 0.9, 1.8].map((d, i) => (
          <circle key={i} cx={CX} cy={CY} r="8" fill="none" stroke={AMBER} strokeWidth="1.5">
            <animate attributeName="r" values="8;60" dur="2.7s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.7s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* epicenter core */}
        <circle cx={CX} cy={CY} r="7" fill={AMBER} filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.55;1" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* live labels */}
      <span className="imap-tag alert" style={{ left: "44%", top: "40%" }}>
        <span className="d" /> p99 +412%
      </span>
      <span className="imap-tag" style={{ left: "6%", top: "18%" }}>api-gateway</span>
      <span className="imap-tag" style={{ right: "6%", bottom: "18%" }}>root cause · 47s</span>
      <div className="imap-status"><span className="d" /> INCIDENT DETECTED · correlating 5 services</div>
    </div>
  );
}
