/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        tabWidth: 2,
      },
    ],
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: [
          'Main',
          'Navigations',
          'Logo',
          'Summary',
          'List',
          'Title',
          'Footer',
          'About',
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_', // ignore unused args starting with _
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_', // ignore unused caught errors starting with _
        destructuredArrayIgnorePattern: '^_', // ignore unused destructured array items starting with _
        varsIgnorePattern: '^_', // ignore unused variables starting with _
        ignoreRestSiblings: true,
      },
    ],
  },
};
