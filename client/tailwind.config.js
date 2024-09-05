/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        anchor: "#1a73e8",
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: "calc(0.5rem - 4px)",
      },
      fontSize: {
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
      },
      fontFamily: {
        body: ["'Verdana', sans-serif"],
        heading: ["'Lucida Grande', sans-serif"],
      },
      transitionProperty: {
        props:
          "scale, opacity, background-color, color, border-color, height, margin, padding, max-height",
      },
    },
  },
  plugins: [require("daisyui")],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [
      {
        chatfallLight: {
          "base-100": "#fff",
          "base-content": "#000",
          "base-200": "#eee",
          "base-300": "#ddd",
          primary: "#f77f00",
          "primary-content": "#fff",
          secondary: "#E0E1DD",
          "secondary-content": "#000",
          neutral: "#000",
          "neutral-content": "#fff",
          info: "#415A77",
          "info-content": "#fff",
          error: "#ff0000",
          "error-content": "#fff",
        },
      },
      "dark",
    ],
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}
