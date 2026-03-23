const html = require('eslint-plugin-html');

module.exports = [
  {
    ignores: ['dist/', 'node_modules/', 'index.html']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: {
      html
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  }
];