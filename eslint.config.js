import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      // add other patterns as needed
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
    plugins: { prettier: prettierPlugin },
    rules: {
      indent: ['error', 2],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': 'error',
    },
  },
  prettier,
]);
