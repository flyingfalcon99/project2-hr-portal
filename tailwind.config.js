/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Professional Color Palette
      colors: {
        primary: {
          50: "#f0f4f9",
          100: "#e1eaf3",
          200: "#c3d5e7",
          300: "#a5c0db",
          400: "#87abcf",
          500: "#6896c3",
          600: "#4a7aad",
          700: "#3a5f8f",
          800: "#2a4471",
          900: "#1a2953",
        },
        secondary: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
        accent: {
          50: "#ecf7ff",
          100: "#d9ecff",
          200: "#b3d9ff",
          300: "#80c5ff",
          400: "#54aaff",
          500: "#2d8dff",
          600: "#1e5ba8",
          700: "#1a4a8a",
          800: "#163a70",
          900: "#122f5f",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#145231",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        info: {
          50: "#ecf7ff",
          100: "#d9ecff",
          200: "#b3d9ff",
          300: "#80c5ff",
          400: "#54aaff",
          500: "#2d8dff",
          600: "#1e5ba8",
          700: "#1a4a8a",
          800: "#163a70",
          900: "#122f5f",
        },
      },
      spacing: {
        // Consistent spacing scale (4px base)
        0: "0",
        1: "0.25rem",     // 4px
        2: "0.5rem",      // 8px
        3: "0.75rem",     // 12px
        4: "1rem",        // 16px
        5: "1.25rem",     // 20px
        6: "1.5rem",      // 24px
        7: "1.75rem",     // 28px
        8: "2rem",        // 32px
        9: "2.25rem",     // 36px
        10: "2.5rem",     // 40px
        12: "3rem",       // 48px
        14: "3.5rem",     // 56px
        16: "4rem",       // 64px
        20: "5rem",       // 80px
        24: "6rem",       // 96px
        28: "7rem",       // 112px
        32: "8rem",       // 128px
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        // Typography system
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],       // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],   // 14px
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],           // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0" }],        // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],   // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],    // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }], // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }], // 36px
        "5xl": ["3rem", { lineHeight: "1", letterSpacing: "-0.02em" }],         // 48px
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
      boxShadow: {
        // Depth shadow utilities
        none: "none",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "card-active": "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05)",
        input: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "input-focus": "0 0 0 3px rgba(74, 122, 173, 0.1)",
      },
      borderRadius: {
        // Border radius standards
        none: "0",
        xs: "0.125rem",     // 2px
        sm: "0.25rem",      // 4px
        base: "0.375rem",   // 6px
        md: "0.5rem",       // 8px
        lg: "0.75rem",      // 12px
        xl: "1rem",         // 16px
        "2xl": "1.5rem",    // 24px
        "3xl": "2rem",      // 32px
        full: "9999px",
        card: "0.5rem",
        input: "0.375rem",
        button: "0.375rem",
        modal: "0.5rem",
      },
      transitionDuration: {
        // Standard transition durations
        0: "0ms",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
      },
      transitionTimingFunction: {
        // Easing functions
        "linear": "linear",
        "in": "cubic-bezier(0.4, 0, 1, 1)",
        "out": "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-in-sine": "cubic-bezier(0.12, 0, 0.39, 0)",
        "ease-out-sine": "cubic-bezier(0.61, 1, 0.88, 1)",
        "ease-in-out-sine": "cubic-bezier(0.37, 0, 0.63, 1)",
        "ease-in-quad": "cubic-bezier(0.11, 0, 0.5, 0)",
        "ease-out-quad": "cubic-bezier(0.5, 1, 0.89, 1)",
      },
      screens: {
        // Responsive breakpoints
        xs: "320px",   // Extra small (mobile)
        sm: "640px",   // Small (landscape phone)
        md: "768px",   // Medium (tablet)
        lg: "1024px",  // Large (desktop)
        xl: "1280px",  // Extra large (wide desktop)
        "2xl": "1536px", // 2xl (ultra-wide)
      },
      opacity: {
        0: "0",
        5: "0.05",
        10: "0.1",
        20: "0.2",
        30: "0.3",
        40: "0.4",
        50: "0.5",
        60: "0.6",
        70: "0.7",
        75: "0.75",
        80: "0.8",
        90: "0.9",
        95: "0.95",
        100: "1",
      },
      zIndex: {
        // Z-index scale
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        auto: "auto",
        hide: "-1",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
    },
  },

  plugins: [
    function ({ addComponents, addUtilities, theme }) {
      // ============================================================================
      // TEXT & TYPOGRAPHY COMPONENTS
      // ============================================================================
      addComponents({
        // Heading styles
        "@keyframes fadeIn": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "@keyframes slideDown": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "@keyframes slideUp": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "@keyframes slideRight": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "@keyframes pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "@keyframes slideIn": {
          "0%": { transform: "translateX(400px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "@keyframes slideOut": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(400px)", opacity: "0" },
        },

        // Heading styles
        ".h1": {
          "@apply text-4xl font-bold text-secondary-900 tracking-tight": {},
        },
        ".h2": {
          "@apply text-3xl font-bold text-secondary-900 tracking-tight": {},
        },
        ".h3": {
          "@apply text-2xl font-semibold text-secondary-900": {},
        },
        ".h4": {
          "@apply text-xl font-semibold text-secondary-900": {},
        },
        ".h5": {
          "@apply text-lg font-semibold text-secondary-800": {},
        },
        ".h6": {
          "@apply text-base font-semibold text-secondary-800": {},
        },

        // Body text styles
        ".body-lg": {
          "@apply text-lg text-secondary-700 leading-relaxed": {},
        },
        ".body": {
          "@apply text-base text-secondary-700 leading-normal": {},
        },
        ".body-sm": {
          "@apply text-sm text-secondary-600 leading-normal": {},
        },

        // Caption and helper text
        ".caption": {
          "@apply text-xs text-secondary-500 font-medium uppercase tracking-wide": {},
        },
        ".helper-text": {
          "@apply text-sm text-secondary-600": {},
        },

        // ============================================================================
        // FORM INPUT UTILITIES
        // ============================================================================
        ".input-base": {
          "@apply w-full px-4 py-2 border border-secondary-300 rounded-input bg-white text-secondary-900 placeholder-secondary-400 transition-all duration-200": {},
        },
        ".input-focus": {
          "@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500": {},
        },
        ".input-field": {
          "@apply input-base input-focus shadow-input": {},
        },
        ".input-error": {
          "@apply border-danger-500 focus:ring-danger-500 focus:border-danger-500": {},
        },
        ".input-success": {
          "@apply border-success-500 focus:ring-success-500 focus:border-success-500": {},
        },
        ".input-disabled": {
          "@apply bg-secondary-100 text-secondary-500 cursor-not-allowed": {},
        },

        // ============================================================================
        // BUTTON UTILITIES
        // ============================================================================
        ".btn-base": {
          "@apply inline-flex items-center justify-center px-4 py-2 font-medium rounded-button transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2": {},
        },
        ".btn-primary": {
          "@apply btn-base bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed": {},
        },
        ".btn-secondary": {
          "@apply btn-base bg-secondary-200 text-secondary-900 hover:bg-secondary-300 active:bg-secondary-400 focus:ring-secondary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed": {},
        },
        ".btn-danger": {
          "@apply btn-base bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 focus:ring-danger-500 disabled:bg-danger-300 disabled:cursor-not-allowed": {},
        },
        ".btn-success": {
          "@apply btn-base bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus:ring-success-500 disabled:bg-success-300 disabled:cursor-not-allowed": {},
        },
        ".btn-warning": {
          "@apply btn-base bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800 focus:ring-warning-500 disabled:bg-warning-300 disabled:cursor-not-allowed": {},
        },
        ".btn-outline": {
          "@apply btn-base border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300": {},
        },
        ".btn-outline-danger": {
          "@apply btn-base border-2 border-danger-600 text-danger-600 hover:bg-danger-50 active:bg-danger-100 focus:ring-danger-500 disabled:border-danger-300 disabled:text-danger-300": {},
        },
        ".btn-ghost": {
          "@apply btn-base text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500 disabled:text-primary-300": {},
        },
        ".btn-sm": {
          "@apply px-3 py-1.5 text-sm": {},
        },
        ".btn-lg": {
          "@apply px-6 py-3 text-lg": {},
        },

        // ============================================================================
        // CARD UTILITIES
        // ============================================================================
        ".card": {
          "@apply bg-white rounded-card shadow-base p-6 border border-secondary-100": {},
        },
        ".card-hover": {
          "@apply card hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer": {},
        },
        ".card-elevated": {
          "@apply bg-white rounded-card shadow-md p-6 border border-secondary-200": {},
        },

        // ============================================================================
        // BADGE UTILITIES
        // ============================================================================
        ".badge": {
          "@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap": {},
        },
        ".badge-primary": {
          "@apply badge bg-primary-100 text-primary-800": {},
        },
        ".badge-secondary": {
          "@apply badge bg-secondary-100 text-secondary-800": {},
        },
        ".badge-success": {
          "@apply badge bg-success-100 text-success-800": {},
        },
        ".badge-warning": {
          "@apply badge bg-warning-100 text-warning-800": {},
        },
        ".badge-danger": {
          "@apply badge bg-danger-100 text-danger-800": {},
        },
        ".badge-info": {
          "@apply badge bg-info-100 text-info-800": {},
        },
        ".badge-outline": {
          "@apply badge border-2 border-primary-300 text-primary-700 bg-transparent": {},
        },

        // ============================================================================
        // ALERT/NOTIFICATION UTILITIES
        // ============================================================================
        ".alert": {
          "@apply rounded-lg p-4 border": {},
        },
        ".alert-success": {
          "@apply alert bg-success-50 border-success-200 text-success-800": {},
        },
        ".alert-error": {
          "@apply alert bg-danger-50 border-danger-200 text-danger-800": {},
        },
        ".alert-warning": {
          "@apply alert bg-warning-50 border-warning-200 text-warning-800": {},
        },
        ".alert-info": {
          "@apply alert bg-info-50 border-info-200 text-info-800": {},
        },

        // ============================================================================
        // LAYOUT UTILITIES
        // ============================================================================
        ".container-sm": {
          "@apply max-w-md mx-auto px-4": {},
        },
        ".container-md": {
          "@apply max-w-2xl mx-auto px-4": {},
        },
        ".container-lg": {
          "@apply max-w-4xl mx-auto px-4": {},
        },
        ".container-xl": {
          "@apply max-w-6xl mx-auto px-4": {},
        },

        // ============================================================================
        // FLEX UTILITIES
        // ============================================================================
        ".flex-center": {
          "@apply flex items-center justify-center": {},
        },
        ".flex-between": {
          "@apply flex items-center justify-between": {},
        },
        ".flex-col-center": {
          "@apply flex flex-col items-center justify-center": {},
        },

        // ============================================================================
        // TEXT UTILITIES
        // ============================================================================
        ".truncate-1": {
          "@apply line-clamp-1": {},
        },
        ".truncate-2": {
          "@apply line-clamp-2": {},
        },
        ".truncate-3": {
          "@apply line-clamp-3": {},
        },
        ".text-ellipsis": {
          "@apply overflow-hidden text-ellipsis": {},
        },
      });

      // ============================================================================
      // ANIMATION UTILITIES
      // ============================================================================
      addUtilities({
        ".animate-fade-in": {
          animation: "fadeIn 300ms ease-out",
        },
        ".animate-slide-down": {
          animation: "slideDown 300ms ease-out",
        },
        ".animate-slide-up": {
          animation: "slideUp 300ms ease-out",
        },
        ".animate-slide-right": {
          animation: "slideRight 300ms ease-out",
        },
        ".animate-pulse-ring": {
          animation: "pulse-ring 2s infinite",
        },
        ".animate-slideIn": {
          animation: "slideIn 300ms ease-out forwards",
        },
        ".animate-slideOut": {
          animation: "slideOut 200ms ease-in forwards",
        },
      });
    },
  ],
};