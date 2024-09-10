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
        cLight: {
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
      {
        cDark: {
          "base-100": "#333", // replaced from #fff to a darker gray, suitable for background and text
          "base-content": "#f7f7f7", // lightened from #000 to provide sufficient contrast with text
          "base-200": "#454545", // darkened from #eee to maintain consistency with base colors
          "base-300": "#444", // further darkened from #ddd, suitable for backgrounds and subtle separation
          primary: "#FF9800", // lightened from original primary color, maintains vibrancy in dark mode
          "primary-content": "#333", // matches new "base-content" value to maintain contrast
          secondary: "#55595C", // replaced from #E0E1DD to a darker gray-blue for improved readability
          "secondary-content": "#f7f7f7", // consistent with base-content for optimal text visibility
          neutral: "#333", // consistent with primary-content, maintains balance in dark mode
          "neutral-content": "#f7f7f7", // matches base-content value to ensure clear text on backgrounds
          info: "#66CCCC", // lightened from original info color, retains its calming effect
          "info-content": "#000", // follows the "primary-content" pattern for better contrast
          error: "#FF3737", // slightly lightened from original error color, maintains intensity without overpowering users
          "error-content": "#f7f7f7", // consistent with base-content to provide clear visibility of text on backgrounds
        },
      },
    ],
    base: false, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}
