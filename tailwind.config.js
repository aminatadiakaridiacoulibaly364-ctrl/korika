/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nuit: 'var(--c-nuit, #2A1A22)',
        or: { DEFAULT: 'var(--c-or, #D56B7F)', clair: 'var(--c-or-clair, #E08798)', fonce: 'var(--c-or-fonce, #B84E63)' },
        creme: 'var(--c-creme, #FBEDE8)',
        carte: 'var(--c-carte, #FFFAF8)',
        encre: 'var(--c-encre, #2A1A22)'
      },
      fontFamily: {
        titre: ['var(--font-titre)', 'serif'],
        corps: ['var(--font-corps)', 'sans-serif']
      }
    }
  },
  plugins: []
};
