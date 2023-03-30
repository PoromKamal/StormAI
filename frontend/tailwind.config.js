/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "lilita-one": ["Lilita One"],
        "Lato": ["Lato"],
      },
      colors:{
        "storm-blue": "#172B4D",
      },
      animation:{
        logo: "fadeIn 0.3s ease-in",
        introText: "fadeIn 0.8s ease-in",
        text: 'text 5s ease infinite',
      },

      keyframes: theme => ({
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
      }}),
    },
  },
  plugins: [],
}
