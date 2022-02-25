module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#358004',
        secondary: '#6EA704',
        accent: '#98BA02'
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
