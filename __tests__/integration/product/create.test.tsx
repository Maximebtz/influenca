import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProductCreateForm from '@/components/product/ProductCreateForm';
import '@testing-library/jest-dom';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

describe('Création de produit - Intégration', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn()
  };

  const mockSession = {
    data: {
      user: {
        id: 'test-user-id',
        role: 'INFLUENCER'
      }
    }
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue(mockSession);
    global.fetch = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    // Mock de la requête API pour les catégories
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 'cat1', name: 'Catégorie 1' }
        ])
      })
    );

    // Mock de la requête de création
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'new-product-id' })
      })
    );

    await act(async () => {
      render(<ProductCreateForm />);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Titre'), {
        target: { value: 'Test Product' }
      });
      fireEvent.change(screen.getByLabelText('Prix'), {
        target: { value: '99.99' }
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'Test description' }
      });
      fireEvent.change(screen.getByLabelText('Couleur'), {
        target: { value: 'Rouge' }
      });
      fireEvent.change(screen.getByLabelText('Taille'), {
        target: { value: 'M' }
      });
      fireEvent.change(screen.getByLabelText('Catégorie'), {
        target: { value: 'cat1' }
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(screen.getByLabelText('Images'), {
        target: { files: [file] }
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /créer le produit/i }));
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/boutique/products');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs de soumission', async () => {
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 'cat1', name: 'Catégorie 1' }])
      }))
      .mockImplementationOnce(() => Promise.reject(new Error('Erreur test')));

    await act(async () => {
      render(<ProductCreateForm />);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Titre'), {
        target: { value: 'Test Product' }
      });
      fireEvent.submit(screen.getByRole('button', { name: /créer le produit/i }));
    });

    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});