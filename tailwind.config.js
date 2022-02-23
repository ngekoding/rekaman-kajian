module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#67864A'
      }
    },
    container: {
      center: true,
      padding: '2rem'
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
}
