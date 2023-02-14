const { defineConfig } = require('tsup');

module.exports = defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true
});
