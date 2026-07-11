import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Liste des chemins publics (ceux qui ne demandent PAS de connexion)
  const isPublicRoute = 
    pathname === '/' || 
    pathname.startsWith('/connexion') || 
    pathname.startsWith('/inscription') ||
    pathname.startsWith('/admin/login') || // Ta page de login admin
    pathname.startsWith('/admin/dashbord') || // Ton dashboard admin
    pathname.startsWith('/api/quotes') ||    // API pour les devis
    pathname.startsWith('/api/admin');       // API pour l'admin

  // 2. Si la route est publique, on laisse passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. Ici, tu peux ajouter ta logique pour protéger les autres pages (ex: Espace Client)
  // Si tu n'as pas encore fait l'espace client, tu peux laisser passer tout le reste
  // ou ajouter une redirection vers /connexion.
  
  return NextResponse.next();
}

// 4. Configuration : on applique ce middleware partout SAUF aux fichiers statiques
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|public).*)',
  ],
};