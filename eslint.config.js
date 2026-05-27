import { defineConfig } from 'eslint/config';
import airbnb from 'eslint-config-flat-airbnb';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';

import deverseLint from './eslint/index.js';

/**
 * Import order aligned with category comments:
 * // React → // External → // Internal → // Relative → // Styles
 */
const strictReactImportOrder = [
  'error',
  {
    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
    pathGroups: [
      { pattern: 'react', group: 'external', position: 'before' },
      { pattern: 'react-dom', group: 'external', position: 'before' },
      { pattern: 'react-dom/**', group: 'external', position: 'before' },
      { pattern: 'react-router', group: 'external', position: 'before' },
      { pattern: 'react-router-dom', group: 'external', position: 'before' },
      { pattern: 'react-router-dom/**', group: 'external', position: 'before' },
      { pattern: 'react/**', group: 'external', position: 'before' },
      { pattern: '@mui/**', group: 'external', position: 'after' },
      { pattern: '@/**', group: 'internal', position: 'after' },
      { pattern: '**/*.css', group: 'index', position: 'after' },
      { pattern: '**/*.{scss,sass,less}', group: 'index', position: 'after' },
    ],
    pathGroupsExcludedImportTypes: ['builtin'],
    distinctGroup: true,
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

const importResolutionRules = {
  'import-x/no-unresolved': ['error', { commonjs: true }],
  'import-x/named': 'error',
  'import-x/default': 'error',
  'import-x/namespace': 'error',
  'no-undef': 'error',
};

const strictReactImportXRules = {
  ...importResolutionRules,
  'import-x/order': strictReactImportOrder,
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-namespace': 'error',
  'import-x/no-duplicates': ['error', { considerQueryString: true, 'prefer-inline': false }],
};

const strictReactScopeRules = {
  'react/react-in-jsx-scope': 'error',
  'react/jsx-uses-react': 'error',
};

const strictReactJsxImportRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ImportDeclaration[source.value="react"]:not(:has(ImportDefaultSpecifier))',
      message:
        'React must be default-imported: `import React from "react"` (named exports may follow on the same line).',
    },
    {
      selector:
        'Program:has(JSXElement):not(:has(ImportDeclaration[source.value="react"] ImportDefaultSpecifier))',
      message: 'JSX files must default-import React: `import React from "react"`.',
    },
    {
      selector:
        'Program:has(JSXFragment):not(:has(ImportDeclaration[source.value="react"] ImportDefaultSpecifier))',
      message: 'JSX files must default-import React: `import React from "react"`.',
    },
  ],
};

const strictReactRules = {
  ...strictReactImportXRules,
  ...strictReactScopeRules,
};

export default defineConfig(
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', '*.min.js'],
  },
  ...airbnb({
    react: true,
    imports: {
      overrides: strictReactImportXRules,
    },
    overrides: {
      // Console & debugging (production)
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',

      // Variables
      'no-unused-vars': 'off',
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],

      // Control flow & complexity
      curly: ['error', 'all'],
      'no-nested-ternary': 'warn',
      'max-depth': ['warn', 4],
      complexity: ['warn', 15],

      // Objects & arrays (logic; Prettier handles layout)
      'no-array-constructor': 'error',
      'no-new-object': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],

      // Line breaks (non-Prettier)
      'eol-last': 'error',
      'linebreak-style': ['error', 'unix'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'padded-blocks': ['error', 'never'],
    },
  }),
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,jsx}'],
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
    plugins: {
      'import-group-comments': deverseLint,
      'unused-imports': unusedImports,
    },
    rules: {
      ...strictReactRules,
      'import-group-comments/require-category-comment': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
    },
  },
  {
    files: ['**/*.jsx'],
    rules: strictReactJsxImportRules,
  },
  {
    files: ['eslint.config.js', 'eslint/**/*.js'],
    rules: {
      'import-x/no-named-as-default': 'off',
      'import-x/extensions': 'off',
      'import-group-comments/require-category-comment': 'off',
    },
  },
  {
    files: ['vite.config.js', 'eslint.config.js', 'prettier.config.js'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-group-comments/require-category-comment': 'off',
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
);
