import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettier, // deaktiviert Prettier-konfliktende Regeln
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'array-element-newline': [
        'error',
        {
          ArrayExpression: 'always', // normale Arrays: immer Zeilenumbruch
          ArrayPattern: 'never', // Destructuring wie [user, setUser]: nie umbrechen
        },
      ],
      'array-bracket-newline': [
        'error',
        {
          ArrayExpression: { multiline: true, minItems: 2 },
          ArrayPattern: 'never',
        },
      ],
    },
  },
]);
