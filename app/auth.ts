import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/db';
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                username: { label: "Nom d'utilisateur", type: "text" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string
                    }
                });

                if (!user || !user.password) {
                    throw new Error("Aucun utilisateur trouvé avec cet email");
                }

                const passwordMatch = await bcrypt.compare(credentials.password as string, user.password);

                if (!passwordMatch) {
                    throw new Error("Mot de passe incorrect");
                }

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    name: user.name
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    }
});