/** @type {import('jest').Config} */
const path = require('path');

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, '../../$1')
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: path.resolve(__dirname, '../../tsconfig.json')
    }]
  },
  rootDir: '..',
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.test.tsx"
  ],
  setupFilesAfterEnv: [
    path.resolve(__dirname, 'jest.setup.ts')
  ]
};

module.exports = config; 