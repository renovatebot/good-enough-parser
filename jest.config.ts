import { env } from 'node:process';
import type { JestConfigWithTsJest } from 'ts-jest/dist/types';

const ci = !!env.CI;

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    'jest-watch-suspend',
  ],
  globals: {
    'ts-jest': {
      diagnostics: ci,
    },
  },
  reporters: ci
    ? [['github-actions', { silent: false }], 'summary']
    : ['default'],
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['test-utils'],
  coverageProvider: 'v8',
  coverageReporters: ci
    ? ['text-summary', 'json']
    : ['text-summary', 'html', 'json'],
};

export default config;
