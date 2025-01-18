import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '@/components/user/signInForm';
import '@testing-library/jest-dom';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait soumettre le formulaire de connexion', async () => {
    const mockSignIn = jest.fn(() => Promise.resolve({ error: null }));
    (require('next-auth/react') as any).signIn = mockSignIn;

    render(<SignInForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { 
      target: { value: 'test@test.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.click(screen.getByText(/Se connecter/i));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@test.com',
        password: 'password123',
        redirect: false
      });
    });
  });
}); 