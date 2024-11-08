import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";


// Récupérer un produit spécifique par son ID
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        influencer: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true
          }
        },
        images: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 


export async function DELETE(
  request: Request,
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

    console.log('Produit supprimé avec succès:', deletedProduct);

    return NextResponse.json(
      { message: "Produit supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur wowowowowo", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 