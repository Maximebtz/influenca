'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/'); // Page de redirection 
        router.refresh();
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-14 w-full max-w-md mx-auto">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe" 
        required 
      />
      <button className="medium-button" type="submit">Se connecter</button>
      
      {/* <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-2 p-2 border border-influenca-grey rounded-md hover:bg-influenca-grey"
      >
        <Image src="/icons/google.png" alt="Google" width={20} height={20} />
        Continuer avec Google
      </button> */}
    </form>
  );
}
