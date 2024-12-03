import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

// Fonction pour générer un nom de fichier unique
function generateUniqueFileName(originalName: string): string {
  const uniqueSuffix = crypto.randomBytes(6).toString('hex');
  const extension = path.extname(originalName);
  return `${uniqueSuffix}${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'BUYER' | 'INFLUENCER';
    const avatar = formData.get('avatar') as File | null;
    const banner = formData.get('banner') as File | null;

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarFilename = null;
    let bannerFilename = null;

    // Gérer l'upload des fichiers
    if (avatar) {
      const avatarBuffer = await avatar.arrayBuffer();
      avatarFilename = generateUniqueFileName(avatar.name);
      const avatarPath = path.join(process.cwd(), 'public/uploads', avatarFilename);
      await writeFile(avatarPath, Buffer.from(avatarBuffer));
      console.log('Avatar sauvegardé:', avatarPath);
    }

    if (banner) {
      const bannerBuffer = await banner.arrayBuffer();
      bannerFilename = generateUniqueFileName(banner.name);
      const bannerPath = path.join(process.cwd(), 'public/uploads', bannerFilename);
      await writeFile(bannerPath, Buffer.from(bannerBuffer));
      console.log('Bannière sauvegardée:', bannerPath);
    }

    // Création de l'utilisateur
    const userData = {
      email,
      username,
      password: hashedPassword,
      role,
      ...(avatarFilename && { avatar: avatarFilename }),
      ...(bannerFilename && { banner: bannerFilename })
    };

    const user = await prisma.user.create({
      data: userData
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        banner: user.banner
      },
    });

  } catch (error: unknown) {
    console.error('Erreur détaillée lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}