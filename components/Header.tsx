'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/pieces', label: 'Pièces' },
    { href: '/devis', label: 'Devis' },
  ]

  const user = session?.user as any
  const proLinks = user?.role === 'ADMIN' 
    ? [{ href: '/admin/dashbord', label: 'Admin' }]
    : user?.role === 'PROFESSIONAL'
    ? [{ href: '/espace-pro', label: 'Espace Pro' }]
    : []

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-32 h-12 relative flex items-center justify-start">
              <img src="/logo.png" alt="AUTOP Logo" className="max-h-full max-w-full object-contain" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {[...navLinks, ...proLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-red-500 font-semibold transition text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            <Link href="/panier" className="relative p-2 text-slate-300 hover:text-red-500 transition">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/mes-devis" className="text-sm text-slate-400 hover:text-red-500 transition font-medium">
                  Mes Devis
                </Link>
                
                <div className="flex items-center gap-2 border-l border-slate-800 pl-4 relative group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-sm shrink-0 border border-slate-700 group-hover:border-red-500 transition-colors">
                    {(user?.name || user?.email || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block pr-2">
                    <p className="text-white font-bold text-xs uppercase leading-none">{user?.name || user?.email?.split('@')[0]}</p>
                    <p className="text-slate-500 text-[9px] uppercase">{user?.role === 'CUSTOMER' ? 'Client' : 'Pro'}</p>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-slate-800 lg:hidden">
                        <p className="text-white font-bold text-xs uppercase truncate">{user?.name || user?.email?.split('@')[0]}</p>
                        <p className="text-slate-500 text-[10px] uppercase mt-0.5">{user?.role === 'CUSTOMER' ? 'Client' : 'Pro'}</p>
                      </div>
                      <Link href="/mes-devis" className="block px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        Mes Devis
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-slate-800 hover:text-red-400 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/connexion" className="text-slate-300 hover:text-red-500 font-semibold transition text-sm">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col space-y-3 px-2">
              {[...navLinks, ...proLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-red-500 font-semibold py-1 transition block text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-lg shrink-0 border border-slate-700">
                      {(user?.name || user?.email || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm uppercase leading-none">{user?.name || user?.email?.split('@')[0]}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-1">{user?.role === 'CUSTOMER' ? 'Client' : 'Pro'}</p>
                    </div>
                  </div>
                  <Link 
                    href="/mes-devis" 
                    className="text-slate-300 hover:text-red-500 font-semibold py-2 px-2 transition block text-sm bg-slate-900/50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes Devis
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-red-500 font-semibold py-2 px-2 transition flex items-center gap-2 text-sm hover:bg-slate-900/50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/connexion" 
                    className="text-slate-300 hover:text-red-500 font-semibold py-1 transition block text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/inscription" 
                    className="text-slate-300 hover:text-red-500 font-semibold py-1 transition block text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}