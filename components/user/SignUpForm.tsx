'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'INFLUENCER'>('BUYER');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      console.log('Role being sent:', role);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          alert('Erreur lors de la connexion automatique');
        } else {
          router.push('/');
        }
      } else {
        alert(data.error || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-14 w-full max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Pseudo"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Répéter le mot de passe"
        required
      />
      <div className='flex items-center gap-2'>
        <p>
          Je suis un :
        </p>
        <input
          type="radio"
          id="buyer"
          name="role"
          value="BUYER"
          checked={role === "BUYER"}
          onChange={() => setRole('BUYER')}
          required
        />
        <label htmlFor="buyer" className='text-base'>Acheteur</label>
        <input
          type="radio"
          id="influencer"
          name="role"
          value="INFLUENCER"
          checked={role === "INFLUENCER"}
          onChange={() => setRole('INFLUENCER')}
          required
        />
        <label htmlFor="influencer" className='text-base'>Influenceur</label>
      </div>
      <div className='flex items-center gap-2'>
        <input type="checkbox" id="terms" required />
        <label htmlFor="terms" className='text-sm'>Accepter les conditions d'utilisation</label>
      </div>
      <button className='medium-button' type="submit">S'inscrire</button>

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
        className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Image src="/icons/google.png" alt="Google" width={20} height={20} />
        Continuer avec Google
      </button> */}
    </form>
  );
}
