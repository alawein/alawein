import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/htmlcov/**',
      '**/__pycache__/**',
      '**/templates/**',
      '**/*.min.js',
      '**/archive/**',
      '**/.metaHub/templates/**',
      '**/organizations/**',
      '**/research/**',
      '**/tools/**',
      '**/docs/**',
    ],
  },

  // Base JavaScript/TypeScript config
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      // Relaxed rules for monorepo with multiple projects
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-unused-expressions': 'off',
      // Allow lexical declarations in case blocks (stylistic, not a bug)
      'no-case-declarations': 'off',
      // Allow empty interfaces for type extension patterns
      '@typescript-eslint/no-empty-object-type': 'off',
      // Allow useless escapes (often intentional in regex patterns)
      'no-useless-escape': 'warn',
      // Allow empty catch blocks with comment
      'no-empty': ['warn', { allowEmptyCatch: true }],
      // Control regex characters are sometimes intentional
      'no-control-regex': 'warn',
    },
  },

  // TypeScript files in organizations
  {
    files: ['organizations/**/*.{ts,tsx}'],
    rules: {
      // More permissive for generated/lovable code
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Tool and automation files (stricter)
  {
    files: ['tools/**/*.ts', 'automation/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // Test files
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // JSX Accessibility rules for React/TSX files
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
    },
  },
];
