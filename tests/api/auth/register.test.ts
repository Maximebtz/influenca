import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/db';
import { uploadToCloudinary } from '@/lib/upload';

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

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait créer un influenceur avec avatar et bannière', async () => {
    // Mock de l'upload Cloudinary
    const mockUploadToCloudinary = jest.mocked(uploadToCloudinary);
    mockUploadToCloudinary
      .mockResolvedValueOnce('https://cloudinary.com/avatar.jpg')
      .mockResolvedValueOnce('https://cloudinary.com/banner.jpg');

    // Mock de la création d'utilisateur
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

    // Création du FormData avec les fichiers
    const formData = new FormData();
    formData.append('email', 'test@test.com');
    formData.append('username', 'testuser');
    formData.append('password', 'password123');
    formData.append('role', 'INFLUENCER');
    
    // Création de faux fichiers
    const avatarFile = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const bannerFile = new File(['banner'], 'banner.jpg', { type: 'image/jpeg' });
    formData.append('avatar', avatarFile);
    formData.append('banner', bannerFile);

    // Création de la requête
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: formData
    });

    // Appel de la route
    const response = await POST(request);
    const data = await response.json();

    // Vérifications
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(data.user).toEqual(expect.objectContaining({
      email: 'test@test.com',
      username: 'testuser',
      role: 'INFLUENCER',
      avatar: 'https://cloudinary.com/avatar.jpg',
      banner: 'https://cloudinary.com/banner.jpg'
    }));

    // Vérification des appels aux mocks
    expect(uploadToCloudinary).toHaveBeenCalledTimes(2);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });
});
