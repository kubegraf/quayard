import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-expansion hero — a media panel that starts contained and expands to
 * full-bleed as you scroll, while the intro copy fades out and an in-context
 * caption fades in over the expanded media. Equivalent to the 21st.dev
 * "scroll-expansion-hero" pattern, themed for Quayard.
 */
export function ScrollExpansionHero({
  media,
  mediaAlt = "",
  eyebrow,
  title,
  subtitle,
  actions,
  overlay,
  floating,
}: {
  media: string;
  mediaAlt?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  overlay?: ReactNode;
  floating?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const width = useTransform(scrollYProgress, [0, 0.55], ["min(600px, 84vw)", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.55], ["40vh", "100vh"]);
  const top = useTransform(scrollYProgress, [0, 0.55], ["52vh", "0vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [28, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.32], [0, -40]);
  const capOpacity = useTransform(scrollYProgress, [0.62, 0.85], [0, 1]);
  const capY = useTransform(scrollYProgress, [0.62, 0.85], [24, 0]);

  return (
    <section ref={ref} className="se-hero">
      <div className="se-sticky">
        <motion.div className="se-intro" style={{ opacity: introOpacity, y: introY, x: "-50%" }}>
          {eyebrow}
          <h1>{title}</h1>
          {subtitle && <p className="lede">{subtitle}</p>}
          {actions && <div className="hero-cta">{actions}</div>}
        </motion.div>

        <motion.div className="se-media" style={{ width, height, top, borderRadius: radius, left: "50%", x: "-50%" }}>
          <img src={media} alt={mediaAlt} />
          <motion.div className="se-caption" style={{ opacity: capOpacity, y: capY }}>
            {overlay}
          </motion.div>
        </motion.div>

        {floating}
      </div>
    </section>
  );
}
