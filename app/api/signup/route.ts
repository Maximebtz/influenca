import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Données reçues:', body);

    const { email, username, password, role } = body;

    // Vérification des données
    if (!email || !username || !password || !role) {
      console.log('Données manquantes');
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    // Vérification du rôle
    if (role !== 'BUYER' && role !== 'INFLUENCER') {
      console.log('Rôle invalide:', role);
      return NextResponse.json({ message: 'Rôle invalide' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Tentative de création de l\'utilisateur');
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role as 'BUYER' | 'INFLUENCER',
      },
    });

    console.log('Utilisateur créé:', user);
    return NextResponse.json({ message: 'Utilisateur créé avec succès' }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json({ message: 'Erreur lors de la création de l\'utilisateur', error: (error as Error).message }, { status: 400 });
  }
}
