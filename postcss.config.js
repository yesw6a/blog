const path = require('path');

module.exports = {
  plugins: {
    '@stylexswc/postcss-plugin': {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      rsOptions: {
        dev: process.env.NODE_ENV === 'development',
        aliases: {
          '@/*': [path.join(process.cwd(), 'src/*')],
        },
        unstable_moduleResolution: {
          type: 'commonJS',
        },
      },
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
