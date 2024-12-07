import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/db';
import { uploadToCloudinary, validateFileType } from '@/lib/upload';
import { FormData, File } from 'formdata-node';
import fetch, { Request, Headers } from 'node-fetch';

// Mock des dépendances
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      create: jest.fn()
    }
  }
}));

jest.mock('@/lib/upload', () => ({
  uploadToCloudinary: jest.fn(),
  validateFileType: jest.fn().mockReturnValue(true)
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: ResponseInit) => {
      const response = new Response(JSON.stringify(data), init);
      Object.defineProperty(response, 'status', {
        get() {
          return init?.status || 200;
        }
      });
      return response;
    })
  }
}));

interface MockRequest extends Request {
  formData: () => Promise<FormData>;
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait créer un influenceur avec avatar et bannière', async () => {
    const mockUploadToCloudinary = jest.mocked(uploadToCloudinary);
    mockUploadToCloudinary
      .mockResolvedValueOnce('https://cloudinary.com/avatar.jpg')
      .mockResolvedValueOnce('https://cloudinary.com/banner.jpg');

    const mockPrismaUserCreate = jest.mocked(prisma.user.create);
    mockPrismaUserCreate.mockResolvedValueOnce({
      id: '123',
      name: null,
      bio: null,
      email: 'test@test.com',
      emailVerified: null,
      username: 'testuser',
      avatar: 'https://cloudinary.com/avatar.jpg',
      banner: 'https://cloudinary.com/banner.jpg',
      password: 'hashed_password',
      role: 'INFLUENCER',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const formData = new FormData();
    formData.set('email', 'test@test.com');
    formData.set('username', 'testuser');
    formData.set('password', 'password123');
    formData.set('role', 'INFLUENCER');
    
    const avatarFile = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const bannerFile = new File(['banner'], 'banner.jpg', { type: 'image/jpeg' });
    formData.set('avatar', avatarFile);
    formData.set('banner', bannerFile);

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: new Headers(),
      body: formData as any
    }) as MockRequest;

    // Définir formData comme une fonction mockée
    request.formData = async () => formData;

    const response = await POST(request as any);
    const data = await response.json();

    // Vérifiez le statut et la structure de la réponse
    expect(response.status).toBe(200);
    expect(data.user).toEqual(expect.objectContaining({
      email: 'test@test.com',
      username: 'testuser',
      role: 'INFLUENCER',
      avatar: 'https://cloudinary.com/avatar.jpg',
      banner: 'https://cloudinary.com/banner.jpg'
    }));

    expect(uploadToCloudinary).toHaveBeenCalledTimes(2);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });
});