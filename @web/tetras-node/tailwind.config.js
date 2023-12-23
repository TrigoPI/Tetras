/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "card-color": "#fde047"
      },
      borderColor: {
        "card-color": "#fde047"
      }
    },
  },
  plugins: [],
}

