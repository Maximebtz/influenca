'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('BUYER');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        console.error('Erreur de réponse:', errorData);
        alert(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription');
    }
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
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <label htmlFor="buyer" className='text-base'>Acheteur</label>
        <input
          type="radio" 
          id="influencer"
          name="role"
          value="INFLUENCER"
          checked={role === "INFLUENCER"}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <label htmlFor="influencer" className='text-base'>Influenceur</label>
      </div>
      <div className='flex items-center gap-2'>
        <input type="checkbox" id="terms" required />
        <label htmlFor="terms" className='text-sm'>Accepter les conditions d'utilisation</label>
      </div>
      <button className='medium-button' type="submit">S'inscrire</button>
    </form>
  );
}
