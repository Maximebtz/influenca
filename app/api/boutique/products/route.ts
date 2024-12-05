import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        influencerId: session.user.id
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

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // ... delete logic ...
    
    // Après la suppression, ajoutez ces en-têtes
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}