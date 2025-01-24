import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import { uploadToCloudinary } from "@/lib/upload";

// Fonction pour générer un slug à partir d'un titre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '')         // Supprime les tirets au début et à la fin
    .substring(0, 200);              // Limite la longueur
}

export const maxDuration = 300; // Augmente la durée maximale à 300 secondes
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const productData = JSON.parse(formData.get('productData') as string);
    const images = formData.getAll('images');

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "Au moins une image est requise" },
        { status: 400 }
      );
    }

    // Upload des images en parallèle pour améliorer les performances
    const imageUploadPromises = images.map(async (image) => {
      if (!(image instanceof File)) {
        throw new Error('Invalid image type');
      }
      try {
        const buffer = await image.arrayBuffer();
        const result = await uploadToCloudinary(Buffer.from(buffer));
        return result;
      } catch (error) {
        console.error('Erreur upload image:', error);
        throw new Error('Erreur lors de l\'upload des images');
      }
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const price = parseFloat(productData.price);
    const baseSlug = generateSlug(productData.title);
    let slug = baseSlug;

    while (await prisma.product.findUnique({ where: { slug } })) {
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `${baseSlug}-${randomString}`;
    }

    // Extraire categoryIds et supprimer de productData
    const { categoryIds, ...productDataWithoutCategories } = productData;

    const product = await prisma.product.create({
      data: {
        ...productDataWithoutCategories,
        price,
        slug,
        images: {
          create: imageUrls.map(url => ({
            url: url as string
          }))
        },
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        },
        influencerId: session.user.id
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur détaillée lors de la création:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
