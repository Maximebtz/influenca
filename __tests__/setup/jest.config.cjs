const path = require('path');

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/../../__tests__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: [
    path.resolve(__dirname, './jest.setup.ts')
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/setup/',
    '/__tests__/api/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@next-auth)/)'
  ]
};

module.exports = config;