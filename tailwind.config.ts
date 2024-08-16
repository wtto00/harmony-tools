import type { Config } from 'tailwindcss'
import flowbite from 'flowbite/plugin'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  darkMode: 'class',
  plugins: [flowbite],
} satisfies Config
