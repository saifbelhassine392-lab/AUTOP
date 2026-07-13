import React from 'react';
import Link from 'next/link';
import { ChevronRight, Truck, ShieldCheck, Tag, Headset } from 'lucide-react';

// 1. Page Header Banner
interface PageHeaderBannerProps {
  title: string;
  breadcrumbs: { label: string; href: string }[];
}

export function PageHeaderBanner({ title, breadcrumbs }: PageHeaderBannerProps) {
  return (
    <div className="w-full h-[150px] bg-slate-950 border-b border-slate-900 flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase mb-3">
          {title}
        </h1>
        
        {/* Fil d'ariane (Breadcrumb) */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <Link href={crumb.href} className="hover:text-red-500 transition-colors">
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-600" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}

// 2. Trust Banner
export function TrustBanner() {
  const trustItems = [
    { icon: Truck, title: "Livraison Express", desc: "Partout en Tunisie" },
    { icon: ShieldCheck, title: "Garantie OEM", desc: "Pièces certifiées" },
    { icon: Tag, title: "Tarifs Pros", desc: "Remises B2B exclusives" },
    { icon: Headset, title: "Support Dédié", desc: "Assistance technique 6j/7" }
  ];

  return (
    <div className="w-full bg-slate-900/50 py-8 border-y border-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 pt-6 md:pt-0 first:pt-0">
              <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-white tracking-wider uppercase mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Promo Banner (Mid-page)
export function PromoBanner() {
  return (
    <div className="w-full my-12 relative rounded-3xl overflow-hidden bg-red-600 text-white shadow-2xl shadow-red-600/20 group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-500 opacity-90" />
      {/* Utilisation de la même texture de fond que le reste du site */}
      <div className="absolute inset-0 bg-[url('/bg_hero.png')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-700" />
      
      <div className="relative z-10 px-8 py-10 md:py-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="max-w-2xl">
          <h3 className="text-2xl md:text-3xl font-black tracking-wider uppercase mb-2">
            Besoin d'une pièce spécifique en volume ?
          </h3>
          <p className="text-red-100 text-sm md:text-base font-semibold leading-relaxed">
            Profitez de nos conditions spéciales pour les professionnels de l'automobile. Demandez un devis sur mesure et obtenez une réponse en moins de 2 heures.
          </p>
        </div>
        
        <div className="shrink-0">
          <Link 
            href="/devis"
            className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-colors border border-slate-800 shadow-xl"
          >
            📋 Demander un devis
          </Link>
        </div>
      </div>
    </div>
  );
}

// 4. Hero Banner Full Screen (Plein Écran)
interface HeroBannerFullScreenProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  backgroundImageUrl: string;
}

export function HeroBannerFullScreen({ title, subtitle, buttonText, buttonHref, backgroundImageUrl }: HeroBannerFullScreenProps) {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with fixed positioning for a slight parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      
      {/* Content centered */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-widest mb-6 drop-shadow-2xl leading-tight">
          {title}
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-300 font-medium mb-10 max-w-2xl drop-shadow-lg">
          {subtitle}
        </p>
        
        <Link 
          href={buttonHref}
          className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/30 border border-red-500/50"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

