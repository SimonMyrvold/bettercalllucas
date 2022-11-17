/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'bakgrund': "url('/src/bilder/bg2.png')",
      }),
      fontFamily:{
       windows: ['windowsregular']
    },
  },
  plugins: [require('flowbite/plugin')],
}

}
