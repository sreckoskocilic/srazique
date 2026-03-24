const html = require('eslint-plugin-html');

module.exports = [
  {
    ignores: ['dist/', 'node_modules/', 'index.html']
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
  },
  {
    files: ['tests/fixtures/**/*.html'],
    plugins: {
      html
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  }
];
