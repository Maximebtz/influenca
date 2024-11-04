import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password, username, role } = await req.json();

        if (!email || !password || !username || !role) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà
        const existingUserEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUserEmail) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        // Vérifier si le username existe déjà
        const existingUserUsername = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUserUsername) {
            return NextResponse.json(
                { error: "Ce nom d'utilisateur est déjà utilisé" },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role
            }
        });

        return NextResponse.json(
            { message: "Utilisateur créé avec succès" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du compte" },
            { status: 500 }
        );
    }
}