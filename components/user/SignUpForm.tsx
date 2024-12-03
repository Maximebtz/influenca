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
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('role', role);
      
      if (role === 'INFLUENCER') {
        if (avatar) {
          console.log('Ajout de l\'avatar:', avatar);
          formData.append('avatar', avatar);
        }
        if (banner) {
          console.log('Ajout de la bannière:', banner);
          formData.append('banner', banner);
        }
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
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

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-14 flex w-full max-w-md flex-col gap-4">
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
        <p>Je suis un :</p>
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

      {role === 'INFLUENCER' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Photo de profil</label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="size-20 overflow-hidden rounded-full">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="size-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Image de bannière</label>
            <div className="space-y-2">
              {bannerPreview && (
                <div className="h-32 w-full overflow-hidden rounded-lg">
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    width={400}
                    height={128}
                    className="size-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className='flex items-center gap-2'>
        <input type="checkbox" id="terms" required />
        <label htmlFor="terms" className='text-sm'>Accepter les conditions d&apos;utilisation</label>
      </div>
      
      <button className='medium-button' type="submit">S&apos;inscrire</button>
    </form>
  );
}
