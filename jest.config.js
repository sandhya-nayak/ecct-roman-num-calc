module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'node_modules/',
    'logs/.*',
    'dist/.*',
    'pacts/.*',
    'coverage/',
    'src/logger/*',
  ],
  watchPathIgnorePatterns: [
    'node_modules/',
    'logs/',
    'dist/',
    'pacts/',
    'coverage/',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  setupFiles: ['jest-plugin-context/setup'],
};

const TEST_PORT = '3331';
const TEST_CONVERTER_PORT = '3332';

process.env = Object.assign(process.env, {
  CONVERTER_PORT: TEST_CONVERTER_PORT,
  CONVERTER_URL: `http://localhost:${TEST_CONVERTER_PORT}`,
  PORT: TEST_PORT,
});
