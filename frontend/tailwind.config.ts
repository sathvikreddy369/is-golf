import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#effcf8',
          100: '#d7f5eb',
          500: '#0fa37f',
          700: '#0f7e64',
          900: '#0b3f35'
        },
        ink: '#0c1f1a',
        coral: '#ff7a59'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 20% 0%, rgba(15,163,127,0.20), transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,122,89,0.24), transparent 45%), linear-gradient(180deg, #fbf9f3 0%, #eef4f2 100%)'
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(12,31,26,0.15)'
      }
    }
  },
  plugins: []
};

export default config;
