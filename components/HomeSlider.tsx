"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: "NOTRE CENTRE LOGISTIQUE",
    subtitle: "Plus de 10 000 références de pièces d'origine stockées et prêtes à être expédiées dans toute la Tunisie.",
    buttonText: "Découvrir nos stocks",
    buttonHref: "/pieces",
    image: "/warehouse_hero.png"
  },
  {
    id: 2,
    title: "PIÈCES MÉCANIQUES PREMIUM",
    subtitle: "Distributeur multimarques de pièces neuves d'origine et de première monte. La qualité avant tout.",
    buttonText: "Explorer le catalogue",
    buttonHref: "/pieces",
    image: "/hero_image.png"
  },
  {
    id: 3,
    title: "VOTRE PARTENAIRE B2B",
    subtitle: "Profitez de nos conditions spéciales pour les professionnels de l'automobile. Demandez un devis sur mesure.",
    buttonText: "Demander un devis",
    buttonHref: "/devis",
    image: "/bg_hero.png" 
  }
];

export function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          
          {/* Content Left-Aligned */}
          <div className={`relative z-20 h-full flex flex-col justify-center text-left px-8 md:px-16 max-w-7xl mx-auto w-full transition-transform duration-1000 ${index === currentSlide ? 'translate-y-0' : 'translate-y-8'}`}>
            <div className="max-w-2xl">
              <h1 
                style={{ color: '#ffffff' }}
                className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-widest mb-6 drop-shadow-2xl leading-tight"
              >
                {slide.title}
              </h1>
              
              <p 
                style={{ color: '#ffffff' }}
                className="text-base md:text-lg font-medium mb-10 drop-shadow-lg"
              >
                {slide.subtitle}
              </p>
              
              <Link 
                href={slide.buttonHref}
                style={{ color: '#ffffff' }}
                className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/30 border border-red-500/50"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls (Dots) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600 scale-125' : 'bg-slate-400/50 hover:bg-slate-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
