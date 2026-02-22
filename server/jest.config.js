module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!controllers/exportController.js', // Not used in current implementation
    '!controllers/profileController.js', // Covered by integration tests
    '!routes/exportRoutes.js', // Not used in current implementation
    '!routes/profileRoutes.js' // Covered by integration tests
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
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
