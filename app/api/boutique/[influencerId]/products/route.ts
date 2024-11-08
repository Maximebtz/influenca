import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { influencerId: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        influencerId: params.influencerId
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 