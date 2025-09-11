module.exports = {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [
    'prettier-plugin-organize-imports',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // MUST come last
  ],
  importOrder: [
    '^react',
    '',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '<THIRD_PARTY_MODULES>',
    '^@(.*)',
    '^@/(.*)',
    '',
    '',
    '^[.]((?!.s?css$|.less$).)*$',
    '(.s?css|.less)$',
  ],
  importOrderSafeSideEffects: ['\\.(css|less|scss|sass)$'],
};
