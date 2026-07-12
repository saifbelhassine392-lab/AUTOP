'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function CustomerCatalogue() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
  }, []);

  const filtered = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.reference || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0e1a] min-h-screen mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">🗂️ Catalogue Général Articles</h1>
          <p className="text-xs text-slate-400 mt-1">Disponibilités sur Demande</p>
        </div>
        <input type="text" placeholder="Rechercher une pièce..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-[#1e293b]/30 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">{product.reference}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${(product.stock || 0) > 0 ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {(product.stock || 0) > 0 ? '✓ En Stock' : '⏳ Sur Commande'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-200 mb-4">{product.name}</h3>
            </div>
            <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-bold">PRIX DE VENTE</span>
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-chat', {
                      detail: { reference: product.reference, name: product.name }
                    })
                  );
                }}
                className="p-1.5 bg-red-650 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-1.5 text-[9px] font-black uppercase"
                title="Demander le prix par Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" /> CHAT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}