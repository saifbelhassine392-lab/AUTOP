import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck, Truck, Zap, Award } from 'lucide-react'

export default function AccueilPage() {
  return (
    <div className="text-white min-h-screen">
      
      {/* Hero / Presentation Section with full-width background */}
      <div className="relative w-full overflow-hidden bg-slate-950 py-16 md:py-28 border-b border-slate-900">
        {/* Background Image Container with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/bg_hero.png" 
            alt="AUTOP background" 
            className="w-full h-full object-cover opacity-20 object-center"
          />
          {/* Gradient overlays to blend backgrounds and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-650/10 via-transparent to-red-650/10" />
        </div>

        {/* Floating 3D Graphic Shapes (Brake Disc, Piston, Spark Plug) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-20 hidden md:block">
          {/* Brake Disc floating 3D */}
          <div className="absolute right-[8%] top-[15%] w-44 h-44 float-3d-fast">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-red-500 w-full h-full">
              <circle cx="50" cy="50" r="45" strokeDasharray="6 3" />
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="15" />
              <line x1="50" y1="5" x2="50" y2="95" />
              <line x1="5" y1="50" x2="95" y2="50" />
              <path d="M20 20 L80 80 M80 20 L20 80" />
            </svg>
          </div>
          {/* Piston floating 3D */}
          <div className="absolute left-[6%] bottom-[20%] w-40 h-40 float-3d-slow">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-slate-400 w-full h-full">
              <rect x="30" y="10" width="40" height="30" rx="4" />
              <line x1="30" y1="20" x2="70" y2="20" />
              <line x1="30" y1="30" x2="70" y2="30" />
              <rect x="40" y="40" width="20" height="40" rx="2" />
              <circle cx="50" cy="80" r="8" />
            </svg>
          </div>
          {/* Spark Plug floating 3D */}
          <div className="absolute right-[25%] bottom-[12%] w-36 h-36 float-3d-slow" style={{ animationDelay: '-3s' }}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-red-500 w-full h-full">
              <line x1="50" y1="5" x2="50" y2="95" strokeWidth="2.5" />
              <rect x="45" y="20" width="10" height="40" rx="1" fill="currentColor" fillOpacity="0.1" />
              <rect x="40" y="60" width="20" height="15" rx="2" />
              <path d="M45 75 L50 90 L55 75 Z" fill="currentColor" />
              <circle cx="50" cy="92" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Banner Logo Container */}
          <div className="mb-8 flex justify-center">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md max-w-xs flex items-center justify-center transition-transform hover:scale-105 duration-500">
              <img src="/logo.png" alt="AUTOP Logo" className="max-h-24 w-auto object-contain" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-wider text-white">
            AUTOP PIÈCE AUTO
          </h1>
          <p className="text-sm md:text-base text-red-500 font-extrabold tracking-widest mb-6 uppercase">
            DISTRIBUTEUR PIÈCES AUTO NEUVES — ORIGINE & PREMIÈRE MONTE
          </p>
          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed normal-case">
            Multimarques Européennes & Asiatiques — Qualité OEM & stock immédiat pour professionnels et particuliers en Tunisie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pieces" 
              className="chrome-gloss bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition duration-300 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
            >
              🔍 Rechercher une pièce
            </Link>
            <Link 
              href="/devis" 
              className="chrome-gloss bg-slate-900/80 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition duration-300 border border-slate-800 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm shadow-xl"
            >
              📋 Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 space-y-24">
        
        {/* Grid of Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: "Qualité OEM", desc: "Pièces neuves d'origine certifiées et de qualité première monte." },
            { icon: Truck, title: "Livraison rapide", desc: "Service de livraison réactif sur toute la Tunisie." },
            { icon: Zap, title: "Stock immédiat", desc: "Grand inventaire disponible immédiatement dans notre comptoir." },
            { icon: Award, title: "Multimarques", desc: "Pièces pour toutes les marques européennes et asiatiques." }
          ].map((feat, idx) => (
            <div key={idx} className="tilt-card-3d bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-lg hover:bg-slate-900/50 shadow-xl flex flex-col items-start">
              <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black mb-2 tracking-wider">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold normal-case">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Corporate Info Section */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-[40px] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Glow Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-wider">NOTRE COMPTOIR DE DISTRIBUTION</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-8">
                COMPTOIR DE DISTRIBUTION DE PIÈCES DE RECHANGE — TUNIS
              </p>

              <div className="space-y-6">
                {/* Adresse */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">ADRESSE</h4>
                    <p className="text-sm font-semibold mt-1 normal-case text-slate-350">19 RUE DE L'USINE, Z.I. ARIANA AÉROPORT, 1080 TUNIS CEDEX, TUNISIE (CHARGUIA 2)</p>
                  </div>
                </div>

                {/* Téléphones */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">TÉLÉPHONES</h4>
                    <p className="text-sm font-semibold mt-1">
                      <span className="font-mono text-slate-300">+216 98 774 525</span>{" — "}
                      <span className="font-mono text-slate-300">+216 98 171 411</span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">EMAIL</h4>
                    <a 
                      href="mailto:comptoir.distribution@autop.tn" 
                      className="text-sm font-semibold mt-1 text-red-400 hover:text-red-300 transition block lowercase"
                    >
                      comptoir.distribution@autop.tn
                    </a>
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">FACEBOOK</h4>
                    <a 
                      href="https://www.facebook.com/autoppieceauto" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold mt-1 text-red-400 hover:text-red-300 transition block lowercase"
                    >
                      www.facebook.com/autoppieceauto
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social preview mockup */}
            <div className="border border-slate-800 bg-slate-950/80 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-800 overflow-hidden bg-slate-900 p-1 flex items-center justify-center">
                    <img src="/logo.png" alt="AUTOP Logo" className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black">AUTOP PIECE AUTO</h3>
                    <p className="text-[9px] text-slate-500 font-mono">2,2 K FOLLOWERS</p>
                  </div>
                </div>
                <a 
                  href="https://www.facebook.com/autoppieceauto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-black rounded-lg transition uppercase tracking-wider text-white"
                >
                  Visiter la page
                </a>
              </div>
              
              <p className="text-xs text-slate-350 leading-relaxed mb-4 normal-case">
                Suivez-nous sur notre page Facebook pour découvrir nos nouvelles arrivées, offres promo et actualités du comptoir de pièces de rechange AUTOP !
              </p>

              <a 
                href="https://www.facebook.com/autoppieceauto"
                target="_blank" 
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden border border-slate-800/80 group"
              >
                <div className="h-40 bg-slate-900 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url('/logo.png')" }} />
                  <div className="w-12 h-12 bg-blue-600/90 rounded-full flex items-center justify-center text-white relative z-10 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}