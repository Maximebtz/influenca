import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Conversion du prix en nombre
    const price = parseFloat(data.price);
    
    // Création du produit avec sa catégorie
    const product = await prisma.product.create({
      data: {
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
