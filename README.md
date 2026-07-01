# Quayard.ai

**The autonomous AI SRE platform.** Quayard detects anomalies, finds root cause with
cited evidence, and safely remediates production incidents — collapsing MTTR from
hours to seconds, with a human in command the whole way.

## Landing page

`index.html` is a self-contained, dependency-free marketing landing page (inline CSS,
Google Fonts, a touch of vanilla JS for scroll reveals). Open it directly or serve it:

```bash
# just open it
open index.html

# or serve locally
python3 -m http.server 8000   # → http://localhost:8000
```

### Design

- **Type:** Space Grotesk (display) · Inter (body) · JetBrains Mono (labels)
- **Palette:** near-black surface with an aqua → sky → violet accent gradient
- **Sections:** hero + live incident-trace card · problem stats · feature grid ·
  how-it-works · outcomes band · CTA · footer
- Fully responsive; respects `prefers-reduced-motion`.

## Deploy

Any static host works (GitHub Pages, Vercel, Netlify, S3+CloudFront). For GitHub Pages:
make the repo public (or use a Pages-enabled plan), then enable Pages on the default
branch — the site is served from `index.html` at the root.

---

© Quayard.ai
