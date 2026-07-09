"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"

export default function MesDevisPage() {
  const { data: session } = useSession()
  const { addItem, clearCart } = useCart()
  const [devis, setDevis] = useState<any[]>([])

  useEffect(() => {
    const allDevis = JSON.parse(localStorage.getItem("autop_devis") || "[]")
    const myDevis = allDevis.filter((d: any) => d.client?.email === session?.user?.email)
    setDevis(myDevis)
  }, [session])

  const accepterDevis = (d: any) => {
    clearCart()
    d.produits?.forEach((p: any) => {
      addItem({ id: p.id, name: p.name, price: p.price })
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📋 Mes devis</h1>

        {devis.length === 0 && (
          <p className="text-slate-500">Aucun devis pour le moment</p>
        )}

        {devis.map((d) => (
          <div key={d.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-blue-400">{d.id}</h3>
                <p className="text-sm text-slate-400">{d.marque} {d.modele} ({d.annee})</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                d.status === "Traité" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
              }`}>
                {d.status}
              </span>
            </div>

            {d.status === "Traité" && (
              <>
                <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-400 mb-2">Proposition de l'admin :</p>
                  <p className="text-sm mb-3">{d.reponse}</p>
                  <div className="space-y-2">
                    {d.produits?.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-sm">
                        <span>{p.name}</span>
                        <span className="font-bold text-blue-400">{p.price.toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/panier">
                  <button
                    onClick={() => accepterDevis(d)}
                    className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    ✅ Sélectionner les articles et passer commande
                  </button>
                </Link>
              </>
            )}

            {d.status === "En attente" && (
              <p className="text-slate-500 text-sm">En attente de traitement par l'admin...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}