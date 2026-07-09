"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

const PRODUITS = [
  { id: "1", name: "Filtre à huile", category: "Moteur", price: 25, description: "Filtre à huile haute qualité" },
  { id: "2", name: "Plaquettes de frein", category: "Freinage", price: 45, description: "Plaquettes de frein avant" },
  { id: "3", name: "Bougie d'allumage", category: "Moteur", price: 15, description: "Bougie d'allumage iridium" },
  { id: "4", name: "Disque de frein", category: "Freinage", price: 65, description: "Disque de frein ventilé" },
  { id: "5", name: "Amortisseur", category: "Suspension", price: 120, description: "Amortisseur avant gauche" },
];

export default function PiecesPage() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");

  const categories = ["Tous", ...Array.from(new Set(PRODUITS.map((p) => p.category)))];

  const filtres = PRODUITS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                       p.id.toLowerCase().includes(search.toLowerCase());
    const matchCategorie = categorie === "Tous" || p.category === categorie;
    return matchSearch && matchCategorie;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue de pièces</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="pl-10 pr-8 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtres.map((produit) => (
          <div key={produit.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">{produit.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{produit.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-400">{produit.price} TND</span>
              <span className="text-xs bg-slate-700 px-3 py-1 rounded-full">{produit.category}</span>
            </div>
            <AddToCartButton id={produit.id} name={produit.name} price={produit.price} />
          </div>
        ))}
      </div>
    </div>
  );
}