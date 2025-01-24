import { POST } from '@/app/api/product/create/route';
import { auth } from '@/app/auth';
import { uploadToCloudinary, validateFileType } from '@/lib/upload';
import { prisma } from '@/lib/db';

// Mocks
jest.mock('@/app/auth');
jest.mock('@/lib/upload');
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: ResponseInit) => {
      const response = new Response(JSON.stringify(data), init);
      Object.defineProperty(response, 'status', {
        get() {
          return init?.status || 200;
        }
      });
      return response;
    }
  }
}));
jest.mock('@/lib/db', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    $disconnect: jest.fn()
  }
}));

describe('POST /api/product/create', () => {
  const mockSession = {
    user: { id: 'test-user-id' }
  };

  const mockFormData = {
    title: 'Test Product',
    price: '99.99',
    description: 'Test description',
    color: 'Rouge',
    size: 'M',
    categoryIds: ['cat1']
  };

  let consoleErrorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (auth as jest.Mock).mockResolvedValue(mockSession);
    (uploadToCloudinary as jest.Mock).mockResolvedValue('https://cloudinary.com/test.jpg');
    (validateFileType as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('devrait créer un produit avec succès', async () => {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(mockFormData));
    
    const blob = new Blob(['test file content'], { type: 'image/jpeg' });
    formData.append('images', blob, 'test.jpg');

    const request = new Request('http://localhost/api/product/create', {
      method: 'POST',
      body: formData
    });

    (prisma.product.create as jest.Mock).mockResolvedValue({
      id: 'test-product-id',
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      color: 'Rouge',
      size: 'M',
      images: [{ url: 'https://cloudinary.com/test.jpg' }]
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id', 'test-product-id');
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: mockFormData.title,
        price: 99.99,
        influencerId: mockSession.user.id,
        images: {
          create: [{ url: 'https://cloudinary.com/test.jpg' }]
        }
      })
    });
  });

  it('devrait retourner une erreur si non authentifié', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('productData', JSON.stringify(mockFormData));
    const blob = new Blob(['test file content'], { type: 'image/jpeg' });
    formData.append('images', blob, 'test.jpg');

    const request = new Request('http://localhost/api/product/create', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error', 'Non autorisé');
  });

  it('devrait retourner une erreur si aucune image n\'est fournie', async () => {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(mockFormData));

    const request = new Request('http://localhost/api/product/create', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error', 'Au moins une image est requise');
  });

  it('devrait gérer les erreurs de création', async () => {
    (prisma.product.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
    
    const formData = new FormData();
    formData.append('productData', JSON.stringify(mockFormData));
    const blob = new Blob(['test file content'], { type: 'image/jpeg' });
    formData.append('images', blob, 'test.jpg');

    const request = new Request('http://localhost/api/product/create', {
      method: 'POST',
      body: formData
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Erreur lors de la création du produit');
  });
});