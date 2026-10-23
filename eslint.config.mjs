import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

// eslint-config-next 16 直接导出 flat config，不再需要 FlatCompat 转换 legacy extends。
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-dev/**',
      '.open-next/**',
      '.wrangler/**',
      '.codegraph/**',
      '.archives/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'cloudflare-env.d.ts',
      '.prettierrc.js',
      'postcss.config.js',
      'stylelint.config.js',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ...prettierConfig,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // eslint-config-next 16 内置的 react-hooks v7 新增了 React Compiler 时代的规则。
      // 现有组件依赖"挂载期 setState / 读取 ref"惯用法，重构会影响 hydration 行为，
      // 因此先降级为 warning 保留可见债务，待单独重构时再收紧。
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];

export default eslintConfig;
