"use client"

import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const { data: session } = useSession()
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">AUTOP</Link>
        
        {/* Burger menu mobile */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm">Accueil</Link>
          <Link href="/pieces" className="text-slate-300 hover:text-white transition-colors text-sm">Pièces</Link>
          <Link href="/devis" className="text-slate-300 hover:text-white transition-colors text-sm">Devis</Link>
          
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="text-red-400 hover:text-red-300 font-semibold transition-colors text-sm">
              🔧 Admin
            </Link>
          )}
          
          {session && (
            <>
              <Link href="/mes-devis" className="text-slate-300 hover:text-white transition-colors text-sm">Mes devis</Link>
              <Link href="/panier" className="relative text-slate-300 hover:text-white transition-colors text-sm">
                🛒 Panier
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            </>
          )}
          
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm hidden lg:block">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link href="/connexion" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Connexion
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-slate-800 pt-4">
          <Link href="/" className="block text-slate-300 hover:text-white text-sm">Accueil</Link>
          <Link href="/pieces" className="block text-slate-300 hover:text-white text-sm">Pièces</Link>
          <Link href="/devis" className="block text-slate-300 hover:text-white text-sm">Devis</Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="block text-red-400 font-semibold text-sm">🔧 Admin</Link>
          )}
          {session && (
            <>
              <Link href="/mes-devis" className="block text-slate-300 hover:text-white text-sm">Mes devis</Link>
              <Link href="/panier" className="block text-slate-300 hover:text-white text-sm">🛒 Panier ({count})</Link>
            </>
          )}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/connexion" className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium text-center">
              Connexion
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}