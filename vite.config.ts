import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' → relative asset paths, so the built site works whether it's
// served from a domain root (Vercel/Netlify/custom domain) or a GitHub Pages
// project subpath (kubegraf.github.io/quayard/).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
