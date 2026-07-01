import animate from "tailwindcss-animate";
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false }, // keep the existing plain-CSS design intact
  theme: {
    extend: {
      // shadcn tokens namespaced (--sh-*) so they don't collide with the site's
      // own --card / --muted / --accent design tokens (which are hex values).
      colors: {
        border: "hsl(var(--sh-border))",
        input: "hsl(var(--sh-input))",
        ring: "hsl(var(--sh-ring))",
        background: "hsl(var(--sh-background))",
        foreground: "hsl(var(--sh-foreground))",
        primary: { DEFAULT: "hsl(var(--sh-primary))", foreground: "hsl(var(--sh-primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--sh-secondary))", foreground: "hsl(var(--sh-secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--sh-muted))", foreground: "hsl(var(--sh-muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--sh-accent))", foreground: "hsl(var(--sh-accent-foreground))" },
        card: { DEFAULT: "hsl(var(--sh-card))", foreground: "hsl(var(--sh-card-foreground))" },
        popover: { DEFAULT: "hsl(var(--sh-popover))", foreground: "hsl(var(--sh-popover-foreground))" },
        destructive: { DEFAULT: "hsl(var(--sh-destructive))", foreground: "hsl(var(--sh-destructive-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [animate],
};
