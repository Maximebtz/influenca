/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextEncoder } from 'util';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }
}

// Configuration globale pour les tests
global.TextEncoder = TextEncoder;

// Configuration de l'environnement de test
process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud_name';
process.env.CLOUDINARY_API_KEY = 'test_api_key';
process.env.CLOUDINARY_API_SECRET = 'test_api_secret';

// Mock fetch global avec le bon typage
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

global.fetch = mockFetch as unknown as typeof global.fetch;

// Nettoyage des mocks après chaque test
import { afterEach } from '@jest/globals';
afterEach(() => {
  jest.clearAllMocks();
});

// Modification de la déclaration globale
declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder;
    }
  }
}