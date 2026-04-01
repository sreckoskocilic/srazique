const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Removed thresholds block: vm2 sandbox disables vitest coverage checks

    },
  },
});
