import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Récupérer tous les produits
export async function GET() {
  try {

    const products = await prisma.product.findMany({
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

    return NextResponse.json(products);
    
  } catch (error) {

    console.error('Erreur lors de la récupération des produits:', error);
    
  } finally {
    // Déconnexion propre
    await prisma.$disconnect();
  }
}
