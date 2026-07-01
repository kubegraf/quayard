import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  initials: string;
};

/**
 * Animated testimonials — a faithful equivalent of Aceternity's component:
 * a rotating stack of author cards on the left, quote + name + arrows on the
 * right, autoplay, and a word-by-word quote reveal. Adapted to use branded
 * gradient author cards instead of photos.
 */
export function AnimatedTestimonials({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) {
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const isActive = (i: number) => i === active;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, 5200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const rotations = [-9, 6, -4, 8, -6];
  const rot = (i: number) => rotations[i % rotations.length];

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-14 md:grid-cols-2 md:items-center">
      {/* author card stack */}
      <div>
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.9, y: 12, rotate: rot(i) }}
                animate={{
                  opacity: isActive(i) ? 1 : 0.55,
                  scale: isActive(i) ? 1 : 0.94,
                  y: isActive(i) ? 0 : 8,
                  rotate: isActive(i) ? 0 : rot(i),
                  zIndex: isActive(i) ? 40 : testimonials.length - i,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 12, rotate: rot(i) }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 origin-bottom"
              >
                <div
                  className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[26px] p-7"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(124,92,255,.9), rgba(168,85,247,.85))",
                    boxShadow: "0 50px 100px -40px rgba(70,30,150,.5)",
                    border: "1px solid rgba(255,255,255,.35)",
                  }}
                >
                  <div
                    className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white"
                    style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.4)", fontFamily: "var(--display)" }}
                  >
                    {t.initials}
                  </div>
                  <div className="text-white">
                    <div className="text-xl font-bold" style={{ fontFamily: "var(--display)" }}>{t.name}</div>
                    <div className="text-sm text-white/75" style={{ fontFamily: "var(--mono)" }}>{t.designation}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* quote + controls */}
      <div className="flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[19px] leading-relaxed" style={{ color: "var(--ink)" }}>
              {testimonials[active].quote.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.35, delay: 0.02 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {w}&nbsp;
                </motion.span>
              ))}
            </p>
            <div className="mt-6">
              <div className="text-base font-bold" style={{ fontFamily: "var(--display)" }}>{testimonials[active].name}</div>
              <div className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>{testimonials[active].designation}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          <button onClick={prev} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full transition"
            style={{ background: "var(--card)", border: "1px solid var(--line)", boxShadow: "var(--sh-sm)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--ink)" }}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={next} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full transition"
            style={{ background: "var(--card)", border: "1px solid var(--line)", boxShadow: "var(--sh-sm)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--ink)" }}><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
