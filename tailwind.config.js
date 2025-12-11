/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Recursive", "sans-serif"], // Updated to Recursive
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bbts: {
          blue: "#003399", // BBTS Blue
          yellow: "#FFCC00", // BBTS Yellow
        },
        primary: {
          DEFAULT: "#003399", // Using BBTS Blue as Primary
          foreground: "white",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#FFCC00", // BBTS Yellow as Accent
          foreground: "#1A1A1A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Keeping sidebar and leave colors as they were useful
        sidebar: {
            DEFAULT: "hsl(var(--sidebar-background))",
            foreground: "hsl(var(--sidebar-foreground))",
            primary: "hsl(var(--sidebar-primary))",
            "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
            accent: "hsl(var(--sidebar-accent))",
            "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
            border: "hsl(var(--sidebar-border))",
            ring: "hsl(var(--sidebar-ring))",
        },
        leave: {
            vacation: "hsl(var(--leave-vacation))",
            "vacation-foreground": "hsl(var(--leave-vacation-foreground))",
            medical: "hsl(var(--leave-medical))",
            "medical-foreground": "hsl(var(--leave-medical-foreground))",
            maternity: "hsl(var(--leave-maternity))",
            "maternity-foreground": "hsl(var(--leave-maternity-foreground))",
            paternity: "hsl(var(--leave-paternity))",
            "paternity-foreground": "hsl(var(--leave-paternity-foreground))",
            wedding: "hsl(var(--leave-wedding))",
            "wedding-foreground": "hsl(var(--leave-wedding-foreground))",
            death: "hsl(var(--leave-death))",
            "death-foreground": "hsl(var(--leave-death-foreground))",
            study: "hsl(var(--leave-study))",
            "study-foreground": "hsl(var(--leave-study-foreground))",
            blood: "hsl(var(--leave-blood))",
            "blood-foreground": "hsl(var(--leave-blood-foreground))",
            court: "hsl(var(--leave-court))",
            "court-foreground": "hsl(var(--leave-court-foreground))",
            electoral: "hsl(var(--leave-electoral))",
            "electoral-foreground": "hsl(var(--leave-electoral-foreground))",
            other: "hsl(var(--leave-other))",
            "other-foreground": "hsl(var(--leave-other-foreground))",
        },
        status: {
            active: "hsl(var(--status-active))",
            planned: "hsl(var(--status-planned))",
            ended: "hsl(var(--status-ended))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
