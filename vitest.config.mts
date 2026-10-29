import { env } from 'node:process';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

const ci = !!env.CI;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['lib/**/*.spec.ts', 'test/**/*.spec.ts'],
    reporters: ci
      ? [['default', { summary: false }], 'github-actions', 'junit']
      : ['default', 'junit'],
    outputFile: {
      junit: 'coverage/junit.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ci ? ['text-summary', 'json'] : ['text-summary', 'html', 'json'],
      include: ['lib/**/*.ts'],
      exclude: [...coverageConfigDefaults.exclude, 'test/test-utils.ts'],
    },
  },
});
