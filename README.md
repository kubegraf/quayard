# Quayard.ai

**The autonomous AI SRE platform** — detects anomalies, finds root cause with
**cited evidence**, and safely remediates production incidents. Zero-trust,
self-hosted or cloud.

Marketing landing page — **Vite + React + TypeScript**.

## Develop

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build (http://localhost:5000)
npm run typecheck  # tsc --noEmit
```

## Deploy (npm)

```bash
npm run deploy     # builds and publishes dist/ to the gh-pages branch
```

`npm run deploy` uses [`gh-pages`](https://www.npmjs.com/package/gh-pages). To serve it,
enable **GitHub Pages** on the `gh-pages` branch (repo must be public or on a
Pages-enabled plan). `vite.config.ts` sets `base: './'` so the bundle also works from
a domain root — deploy the same `dist/` to Vercel / Netlify / S3+CloudFront, or point
the **quayard.ai** domain at it.

## Design

Dark theme · aqua→cyan→violet accent · status-color language (green = healthy,
amber/red = incident). Space Grotesk / Inter / JetBrains Mono. Sections: hero with a
live evidence-cited RCA panel · logo marquee · problem · Detect/Diagnose/Remediate ·
how-it-works · feature bento · outcomes · security & trust · comparison · testimonials
· CTA. Responsive; respects `prefers-reduced-motion`.
