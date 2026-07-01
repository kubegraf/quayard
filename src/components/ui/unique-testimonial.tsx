import { motion } from "framer-motion";

export type UniqueTestimonialProps = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  metric?: { value: string; label: string };
};

/**
 * Unique testimonial — a distinctive featured quote: oversized gradient
 * quotation mark, large quote, author, and an optional highlighted metric,
 * on a frosted glass slab with a gradient edge.
 */
export function UniqueTestimonial({ quote, name, role, initials, metric }: UniqueTestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-4xl overflow-hidden rounded-[30px] p-10 md:p-14"
      style={{
        background: "linear-gradient(160deg, rgba(124,92,255,.1), rgba(168,85,247,.05)), rgba(255,255,255,.6)",
        backdropFilter: "blur(24px) saturate(150%)",
        border: "1px solid rgba(124,92,255,.28)",
        boxShadow: "var(--sh-lg)",
      }}
    >
      {/* oversized quote glyph */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-10 select-none"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 260,
          lineHeight: 1,
          background: "var(--grad)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: 0.14,
        }}
      >
        &rdquo;
      </div>

      <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-[22px] font-medium leading-snug md:text-[27px]" style={{ color: "var(--ink)", fontFamily: "var(--display)", letterSpacing: "-.02em" }}>
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
              style={{ background: "var(--grad)", fontFamily: "var(--display)", boxShadow: "0 12px 24px -8px rgba(124,92,255,.6)" }}
            >
              {initials}
            </span>
            <div>
              <div className="text-base font-bold" style={{ fontFamily: "var(--display)" }}>{name}</div>
              <div className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>{role}</div>
            </div>
          </div>
        </div>

        {metric && (
          <div className="shrink-0 rounded-3xl px-8 py-7 text-center" style={{ background: "rgba(255,255,255,.6)", border: "1px solid var(--line)", boxShadow: "var(--sh-sm)" }}>
            <div className="grad" style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 52, lineHeight: 1, letterSpacing: "-.03em" }}>{metric.value}</div>
            <div className="mt-2 text-sm" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>{metric.label}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
