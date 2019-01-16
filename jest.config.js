module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    // ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  },
  testMatch: ['**/__tests__/**/*.(ts|js)'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/types/',
    '<rootDir>/src/demo/'
  ],
  // "testResultsProcessor": "<rootDir>/node_modules/ts-jest/coverageprocessor.js",
  // snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverageFrom: [
    'src/*.{ts}',
    '!**/demo/**'
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage'
};
