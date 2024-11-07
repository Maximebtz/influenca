import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const price = parseFloat(data.price);

    // Vérifier si le produit existe et appartient à l'influenceur
    const existingProduct = await prisma.product.findUnique({
      where: { 
        id: params.productId,
        influencerId: session.user.id
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé ou non autorisé" },
        { status: 404 }
      );
    }

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id: params.productId },
      data: {
        title: data.title,
        color: data.color,
        size: data.size,
        price: price,
        description: data.description,
        categories: {
          deleteMany: {},
          create: data.categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        }
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erreur modification produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 500 }
    );
  }
} 