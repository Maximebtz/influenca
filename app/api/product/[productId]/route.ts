import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
        }
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

// Delete a product
export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  const productId = params.productId;

  const product = await prisma.product.delete({
    where: { id: productId }
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}