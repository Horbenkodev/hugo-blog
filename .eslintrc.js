module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['prettier', '@stylistic'],
  overrides: [],
  rules: {
    '@stylistic/semi': 'error',
  },
  reportUnusedDisableDirectives: true,
};
