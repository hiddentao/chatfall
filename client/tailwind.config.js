/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
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
        props: "opacity, background-color, color, border-color",
      },
    },
  },
}
