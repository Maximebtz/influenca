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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-24">
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="BUYER">Acheteur</option>
        <option value="INFLUENCER">Influenceur</option>
      </select>
      <div>
        <input type="checkbox" id="terms" required />
        <label htmlFor="terms">Accepter les conditions d'utilisation</label>
      </div>
      <button className='medium-button' type="submit">S'inscrire</button>
    </form>
  );
}
