import { TextEncoder } from 'util';
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { Buffer } from 'buffer';
import { FormData, Request, Response } from 'undici';

// Polyfills Web API
global.TextEncoder = TextEncoder;
global.ReadableStream = ReadableStream as unknown as typeof global.ReadableStream;
global.WritableStream = WritableStream as unknown as typeof global.WritableStream;
global.TransformStream = TransformStream as unknown as typeof global.TransformStream;
global.Buffer = Buffer;

// Cast des types Web API pour la compatibilité
global.FormData = FormData as unknown as typeof global.FormData;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;

// Variables d'environnement
process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud_name';
process.env.CLOUDINARY_API_KEY = 'test_api_key';
process.env.CLOUDINARY_API_SECRET = 'test_api_secret';

// Nettoyage des mocks après chaque test
afterEach(() => {
  jest.clearAllMocks();
}); 