import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { influencerId: string } }
) {
  try {
    const influencer = await prisma.user.findUnique({
      where: {
        id: params.influencerId,
        role: 'INFLUENCER'
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        banner: true,
        bio: true,
        email: true
      }
    });

    if (!influencer) {
      return NextResponse.json(
        { error: "Influenceur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(influencer);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'influenceur:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 