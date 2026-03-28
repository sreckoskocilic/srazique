const html = require('eslint-plugin-html');

module.exports = [
  {
    ignores: ['dist/', 'node_modules/', 'index.html'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      html,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-multiple-empty-lines': 'error',
      'no-trailing-spaces': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
  {
    files: ['tests/fixtures/**/*.html'],
    plugins: {
      html,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
