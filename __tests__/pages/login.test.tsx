import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
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

describe('Page de connexion/inscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher le formulaire de connexion par défaut', () => {
    render(<LoginPage />);
    
    // Utiliser getByTestId ou getById pour être plus spécifique
    const loginButton = screen.getByTestId('login-btn');
    const signupButton = screen.getByTestId('signup-btn');
    
    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
    expect(loginButton).toHaveClass('text-white');
    expect(signupButton).toHaveClass('text-influenca-black');
  });

  it('devrait basculer entre connexion et inscription', async () => {
    render(<LoginPage />);
    
    // Vérifier l'état initial
    const loginButton = screen.getByTestId('login-btn');
    const signupButton = screen.getByTestId('signup-btn');
    
    expect(loginButton).toHaveClass('text-white');
    expect(signupButton).toHaveClass('text-influenca-black');
    
    // Cliquer sur le bouton d'inscription
    fireEvent.click(signupButton);
    
    // Vérifier le changement d'état
    await waitFor(() => {
      expect(loginButton).toHaveClass('text-influenca-black');
      expect(signupButton).toHaveClass('text-white');
      expect(screen.getByRole('heading')).toHaveTextContent('Inscription');
    });
  });

  it('devrait afficher le bon formulaire selon l\'état', () => {
    render(<LoginPage />);
    
    // Vérifier que le formulaire de connexion est affiché par défaut
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    
    // Basculer vers l'inscription
    fireEvent.click(screen.getByTestId('signup-btn'));
    
    // Vérifier que le formulaire d'inscription est affiché
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });
}); 