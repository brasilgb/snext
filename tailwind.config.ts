/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      extend: {
          transitionProperty: {
              height: 'height',
          },
          colors: {
              'primary-blue': '#013A63',
              'secundary-blue': '#01497C',
              'terciary-blue': '#145a89',
              'primary-yellow': '#FFB703',
              'secundary-yellow': '#FFD166',
              'terciary-yellow': '#FFF1D0',
              'primary-red': '#D8315B',
              'secundary-red': '#EF476F',
              'primary-green': '#03B00A',
              'secundary-green': '#97CA00',
          },
          fontFamily: {
              Roboto: ['var(--font-roboto)'],
          },
          backgroundImage: {
              // 'hero-image': "url('/images/campanha1.jpg')"
          },
      },
  },
  plugins: [require('@tailwindcss/forms')],
};
