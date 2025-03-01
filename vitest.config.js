import * as path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*{.,-}{test,test-d,spec}.?(c|m)[jt]s?(x)', 'src/index.ts'],
      include: ['src/**/*'],
      provider: 'v8',
      reportsDirectory: path.resolve(import.meta.dirname, 'coverage'),
      skipFull: true,
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    },
    watch: false
  }
});
