"use client"

import { useState } from "react"
import AddToCartButton from "@/components/AddToCartButton"

const PRODUITS = [
  { id: "REF-2847", name: "Disque de frein AV", price: 89.90, category: "Freinage", stock: "En stock" },
  { id: "REF-1923", name: "Kit embrayage", price: 245.00, category: "Transmission", stock: "Faible" },
  { id: "REF-4451", name: "Amortisseur AR", price: 156.50, category: "Suspension", stock: "En stock" },
  { id: "REF-7782", name: "Filtre à huile", price: 12.90, category: "Entretien", stock: "Rupture" },
  { id: "REF-1123", name: "Bougies x4", price: 34.50, category: "Allumage", stock: "En stock" },
  { id: "REF-3341", name: "Courroie distribution", price: 189.00, category: "Moteur", stock: "En stock" },
]

export default function PiecesPage() {
  const [search, setSearch] = useState("")
  const [categorie, setCategorie] = useState("Tous")

  const categories = ["Tous", ...new Set(PRODUITS.map(p => p.category))]

  const filtered = PRODUITS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchCat = categorie === "Tous" || p.category === categorie
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">🔧 Nos pièces auto</h1>
        <p className="text-slate-400 mb-6 md:mb-8">Toutes les pièces détachées pour votre véhicule</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((produit) => (
            <div key={produit.id} className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="w-full h-28 md:h-32 bg-slate-700 rounded-lg flex items-center justify-center text-3xl md:text-4xl mb-4">
                🔧
              </div>
              <p className="text-xs text-slate-400 mb-1">{produit.category}</p>
              <h3 className="font-semibold text-sm md:text-base mb-1">{produit.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{produit.id}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg md:text-xl font-bold text-blue-400">{produit.price.toFixed(2)} €</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  produit.stock === "En stock" ? "bg-green-500/20 text-green-400" :
                  produit.stock === "Faible" ? "bg-orange-500/20 text-orange-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {produit.stock}
                </span>
              </div>
              <AddToCartButton id={produit.id} name={produit.name} price={produit.price} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-slate-500 text-center py-12">Aucune pièce trouvée</p>
        )}
      </div>
    </div>
  )
}