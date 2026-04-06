const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // v8 cannot instrument <script> blocks inside index.html, so coverage
      // always reports 0% for game logic. Behavioral coverage is provided by
      // the vm sandbox tests in tests/game-logic.test.js instead.
    },
  },
});
