'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
        await new Promise(resolve => setTimeout(resolve, 100));
        router.replace('/home');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion');
    }
  };

  // const handleGoogleSignIn = () => {
  //   signIn('google', { callbackUrl: '/' });
  // };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-14 flex w-full max-w-md flex-col gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
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
    </form>
  );
}
