import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function DELETE(
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

    // Vérifier si le produit existe et appartient à l'influenceur
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: { categories: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    if (product.influencerId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer ce produit" },
        { status: 403 }
      );
    }

    // Supprimer les relations ProductCategory
    await prisma.productCategory.deleteMany({
      where: {
        productId: params.productId
      }
    });

    // Supprimer les images associées
    await prisma.image.deleteMany({
      where: {
        productId: params.productId
      }
    });

    // Enfin, supprimer le produit
    const deletedProduct = await prisma.product.delete({
      where: { 
        id: params.productId,
        influencerId: session.user.id
      }
    });

    return NextResponse.json(
      { message: "Produit supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 