export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.app.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  // Tell Jest to collect coverage only from TSX files
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.tsx',
    '!**/node_modules/**',
    '!**/*.test.tsx',
    '!**/*.spec.tsx',
    '!src/__tests__/setup.ts',
    '!**/src/App.tsx',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup\\.ts$', '/__tests__/mockData/mockData.ts$'],

  // Optionally increase the coverage threshold to 70%
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // Optional: setup file for React Testing Library (if needed)
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
