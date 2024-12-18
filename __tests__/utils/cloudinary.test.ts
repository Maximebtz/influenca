import { describe, expect, test, beforeAll } from '@jest/globals';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

describe('Configuration Cloudinary', () => {
  beforeAll(() => {
    dotenv.config();
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  });

  test('devrait avoir les variables d\'environnement configurées', () => {
    expect(process.env.CLOUDINARY_CLOUD_NAME).toBeDefined();
    expect(process.env.CLOUDINARY_API_KEY).toBeDefined();
    expect(process.env.CLOUDINARY_API_SECRET).toBeDefined();
  });
});  