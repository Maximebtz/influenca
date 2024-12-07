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
    '^.+\\.(ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
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
    '/node_modules/(?!(next|@next|react|@react))',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

module.exports = config;