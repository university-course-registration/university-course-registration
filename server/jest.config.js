module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 30000, // 30 seconds per test
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  maxWorkers: 1 // Run tests serially to avoid database conflicts
};
