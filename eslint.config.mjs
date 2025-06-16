import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      prettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React & Hooks
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unstable-nested-components': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-children-prop': 'off',
      'react/display-name': 'off',

      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // TypeScript
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/func-call-spacing': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
        },
      ],

      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-shadow': 'off',

      // General
      'no-shadow': 'off',
      'comma-dangle': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-debugger': 'warn',
      'newline-before-return': 'warn',
      curly: 'warn',
      semi: 'off',
      'no-console': 'warn',

      // Import restrictions
      'no-restricted-imports': 'error',
    },
  },
]);
