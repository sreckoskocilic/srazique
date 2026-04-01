const html = require('eslint-plugin-html');

module.exports = [
  {
    ignores: ['dist/', 'node_modules/'],
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
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
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
    files: ['index.html'],
    plugins: { html },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        requestAnimationFrame: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        AudioContext: 'readonly',
        AbortSignal: 'readonly',
        navigator: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      // Functions invoked from inline onclick attributes appear unused to static analysis
      'no-unused-vars': 'off',
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];
