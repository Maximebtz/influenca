import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import { uploadToCloudinary, validateFileType } from "@/lib/upload";

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

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const productData = JSON.parse(data.get('productData') as string);
    const files = data.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Au moins une image est requise" },
        { status: 400 }
      );
    }

    // Upload des images sur Cloudinary
    const imageUrls = [];
    for (const file of files) {
      if (validateFileType(file.name)) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadToCloudinary(buffer, 'influenca/products');
        imageUrls.push({ url: imageUrl });
      }
    }

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
          create: imageUrls
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
    console.error("Erreur création produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
