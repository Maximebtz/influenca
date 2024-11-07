import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const price = parseFloat(data.price);
    
    // Générer un slug unique basé sur le titre
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Vérifier si le slug existe déjà
    while (await prisma.product.findUnique({ where: { slug } })) {
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `${baseSlug}-${randomString}`;
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: slug,
        color: data.color,
        size: data.size,
        price: price,
        description: data.description,
        influencer: {
          connect: {
            id: data.influencerId
          }
        },
        categories: {
          create: data.categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        }
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
