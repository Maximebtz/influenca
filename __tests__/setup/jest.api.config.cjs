const path = require('path');

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../../__tests__/api'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../$1',
    '^next-auth$': '<rootDir>/mocks/next-auth.ts',
    '^next-auth/react$': '<rootDir>/mocks/next-auth.ts',
    '^@auth/prisma-adapter$': '<rootDir>/mocks/prisma-adapter.ts',
    '^next-auth/providers/credentials$': '<rootDir>/mocks/credentials-provider.ts',
    '^next-auth/jwt$': '<rootDir>/mocks/next-auth.ts',
    '^cloudinary$': '<rootDir>/mocks/cloudinary.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.api.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          allowJs: true,
          esModuleInterop: true
        }
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next|@next|next-auth|@auth|@prisma|@clerk)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};

module.exports = config; 