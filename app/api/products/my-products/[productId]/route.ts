import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    console.log('Tentative de suppression du produit:', params.productId);
    
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

    // Supprimer d'abord les relations avec les catégories
    await prisma.productCategory.deleteMany({
      where: {
        productId: params.productId
      }
    });

    // Ensuite, supprimer le produit
    const deletedProduct = await prisma.product.delete({
      where: { 
        id: params.productId,
        influencerId: session.user.id
      }
    });

    console.log('Produit supprimé avec succès:', deletedProduct);

    return NextResponse.json(
      { message: "Produit supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 