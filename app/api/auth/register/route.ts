import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { uploadToCloudinary, validateFileType } from '@/lib/upload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'BUYER' | 'INFLUENCER';
    const avatar = formData.get('avatar') as File | null;
    const banner = formData.get('banner') as File | null;

    console.log('Début du processus d\'inscription');

    // Vérification si l'username existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà utilisé" },
        { status: 400 }
      );
    }

    // Vérification si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarUrl = null;
    let bannerUrl = null;

    try {
      // Upload de l'avatar
      if (avatar && validateFileType(avatar.name)) {
        console.log('Tentative d\'upload avatar');
        const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
        avatarUrl = await uploadToCloudinary(avatarBuffer, 'influenca/avatars');
        console.log('Avatar uploadé:', avatarUrl);
      }

      // Upload de la bannière
      if (banner && validateFileType(banner.name)) {
        console.log('Tentative d\'upload bannière');
        const bannerBuffer = Buffer.from(await banner.arrayBuffer());
        bannerUrl = await uploadToCloudinary(bannerBuffer, 'influenca/banners');
        console.log('Bannière uploadée:', bannerUrl);
      }
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        throw new Error(`Erreur d'upload: ${uploadError.message}`);
      }
      // Si ce n'est pas une instance d'Error, on lance une erreur générique
      throw new Error("Une erreur inconnue s'est produite lors de l'upload");
    }

    // Création de l'utilisateur
    const userData = {
      email,
      username,
      password: hashedPassword,
      role,
      ...(avatarUrl && { avatar: avatarUrl }),
      ...(bannerUrl && { banner: bannerUrl })
    };

    console.log('Données utilisateur à créer:', userData);

    const user = await prisma.user.create({
      data: userData
    });

    console.log('Utilisateur créé avec succès');

    // Au lieu de retourner directement l'utilisateur, on retourne un signal de succès
    return NextResponse.json({
      success: true,
      message: "Inscription réussie",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        banner: user.banner
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Erreur détaillée lors de l\'inscription:', error);
    console.error('Stack trace:', (error as Error).stack);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'inscription: ' + (error instanceof Error ? error.message : String(error)),
        details: (error as Error).stack
      },
      { status: 500 }
    );
  }
}