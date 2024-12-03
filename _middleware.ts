import { auth } from '@/app/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  // Gestion des fichiers uploads
  if (req.nextUrl.pathname.startsWith('/uploads/')) {
    console.log('Requête upload:', req.nextUrl.pathname);
    return NextResponse.next()
  }

  // Gestion de l'authentification
  const isLoggedIn = !!req.auth
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/boutique') || 
                          req.nextUrl.pathname.startsWith('/product/create')
  
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
})

// Configuration des chemins à protéger
export const config = {
  matcher: [
    '/boutique/:path*',
    '/product/create/:path*',
    '/api/boutique/:path*',
    '/api/product/:path*',
    '/uploads/:path*'
  ]
}