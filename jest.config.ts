import { env } from 'node:process';
import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';

const ci = !!env.CI;

const presetConfig = createDefaultPreset({
  diagnostics: ci,
});

const config: JestConfigWithTsJest = {
  ...presetConfig,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
    'jest-watch-suspend',
  ],
  reporters: ci
    ? [
        ['github-actions', { silent: false }],
        [
          'jest-junit',
          {
            outputDirectory: './coverage',
            outputName: 'junit.xml',
            classNameTemplate: '{filepath}',
          },
        ],
        'summary',
      ]
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
