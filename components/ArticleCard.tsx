"use client";

import { useApp } from '@/lib/context';
import { ShoppingCart, Check } from 'lucide-react';
import type { Article } from '@/lib/data';

export default function ArticleCard({ article }: { article: Article }) {
  const { addToCart, cart } = useApp();
  const isInCart = cart.includes(article.id);

  return (
    <div className="bg-bg-card border border-border-custom rounded-2xl p-5 md:p-6 text-center hover:border-border-light hover:-translate-y-0.5 transition-all">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-bg-dark rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-3xl md:text-4xl">
        {article.icon}
      </div>
      <div className="font-bold text-sm md:text-[15px] mb-1 md:mb-1.5">{article.title}</div>
      <div className="text-[11px] md:text-xs text-text-muted mb-0.5 md:mb-1">Ref. {article.ref}</div>
      <div className="text-[11px] md:text-xs text-text-muted mb-2.5 md:mb-3.5">{article.vehicle}</div>
      <div className="text-xl md:text-[22px] font-extrabold text-accent-green mb-2 md:mb-2.5">{article.price} TND HT</div>
      <span className={`inline-block px-3 md:px-3.5 py-1 rounded-full text-[10px] md:text-[11px] font-bold mb-3 md:mb-4 ${
        article.stock === 'in-stock'
          ? 'bg-accent-green/15 text-accent-green'
          : 'bg-accent-orange/15 text-accent-orange'
      }`}>
        {article.stock === 'in-stock' ? 'EN STOCK' : 'SUR COMMANDE'}
      </span>
      <button
        onClick={() => addToCart(article.id)}
        disabled={isInCart}
        className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-[13px] flex items-center justify-center gap-1.5 md:gap-2 transition-colors ${
          isInCart
            ? 'bg-accent-green text-white cursor-default'
            : 'bg-accent-red text-white hover:bg-accent-red-hover'
        }`}
      >
        {isInCart ? <><Check size={14} /> AJOUTE</> : <><ShoppingCart size={14} /> AJOUTER AU DEVIS</>}
      </button>
    </div>
  );
}
