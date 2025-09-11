import { addDynamicIconSelectors } from '@iconify/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'selector',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme_primary: 'var(--cc-color-primary)',
        'theme_primary/0': 'color-mix(in srgb, var(--cc-color-primary), transparent 100%)',
        'theme_primary/5': 'color-mix(in srgb, var(--cc-color-primary), transparent 95%)',
        'theme_primary/10': 'color-mix(in srgb, var(--cc-color-primary), transparent 90%)',
        'theme_primary/15': 'color-mix(in srgb, var(--cc-color-primary), transparent 85%)',
        'theme_primary/20': 'color-mix(in srgb, var(--cc-color-primary), transparent 80%)',
        'theme_primary/25': 'color-mix(in srgb, var(--cc-color-primary), transparent 75%)',
        'theme_primary/30': 'color-mix(in srgb, var(--cc-color-primary), transparent 70%)',
        'theme_primary/35': 'color-mix(in srgb, var(--cc-color-primary), transparent 65%)',
        'theme_primary/40': 'color-mix(in srgb, var(--cc-color-primary), transparent 60%)',
        'theme_primary/45': 'color-mix(in srgb, var(--cc-color-primary), transparent 55%)',
        'theme_primary/50': 'color-mix(in srgb, var(--cc-color-primary), transparent 50%)',
        'theme_primary/55': 'color-mix(in srgb, var(--cc-color-primary), transparent 45%)',
        'theme_primary/60': 'color-mix(in srgb, var(--cc-color-primary), transparent 40%)',
        'theme_primary/65': 'color-mix(in srgb, var(--cc-color-primary), transparent 35%)',
        'theme_primary/70': 'color-mix(in srgb, var(--cc-color-primary), transparent 30%)',
        'theme_primary/75': 'color-mix(in srgb, var(--cc-color-primary), transparent 25%)',
        'theme_primary/80': 'color-mix(in srgb, var(--cc-color-primary), transparent 20%)',
        'theme_primary/85': 'color-mix(in srgb, var(--cc-color-primary), transparent 15%)',
        'theme_primary/90': 'color-mix(in srgb, var(--cc-color-primary), transparent 10%)',
        'theme_primary/95': 'color-mix(in srgb, var(--cc-color-primary), transparent 5%)',
        'theme_primary/100': 'color-mix(in srgb, var(--cc-color-primary), transparent 0%)',
      },
      animation: {
        in: 'fadeIn 0.2s ease-out',
        'fade-in-0': 'fadeIn 0.2s ease-out',
        'zoom-in-95': 'zoomIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundColor: {
        primary: 'var(--cc-color-bg)',
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};

export default config;
