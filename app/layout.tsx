import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { AuthProvider } from './providers'
import Image from "next/image";
import PageTransition from '@/components/transitions/PageTransition';

export const metadata: Metadata = {
  title: "Influenca",
  description: "Influenca est une plateforme de partage de produits d'influenceurs pour leur communauté.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="relative bg-influenca-black">
        {/* Loading Transition */}
        <div className="absolute left-0 top-0 -z-10 flex h-lvh w-full items-center justify-center">
          <Image src="/logo/logo.png" alt="logo" width={72} height={72} className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" priority unoptimized />
        </div>
        {/* AuthProvider */}
        <AuthProvider>
          {/* Header */}
          <Header />
          {/* Main */}
          <main>
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
