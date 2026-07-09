"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function DevisPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    marque: "",
    modele: "",
    annee: "",
    immatriculation: "",
    pieces: "",
    description: "",
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const devis = {
      id: `DEV-${Date.now()}`,
      ...form,
      client: {
        name: session?.user?.name || "Anonyme",
        email: session?.user?.email || "",
      },
      date: new Date().toISOString(),
      status: "En attente",
    }

    const existing = JSON.parse(localStorage.getItem("autop_devis") || "[]")
    existing.push(devis)
    localStorage.setItem("autop_devis", JSON.stringify(existing))

    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Devis envoyé !</h1>
          <p className="text-slate-400">Nous vous répondrons sous 24h.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📋 Demander un devis</h1>
        <p className="text-slate-400 mb-8">Décrivez votre véhicule et les pièces dont vous avez besoin</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Marque</label>
              <input required value={form.marque} onChange={(e) => setForm({...form, marque: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Renault" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Modèle</label>
              <input required value={form.modele} onChange={(e) => setForm({...form, modele: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Clio 4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Année</label>
              <input required value={form.annee} onChange={(e) => setForm({...form, annee: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="2018" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Immatriculation</label>
              <input required value={form.immatriculation} onChange={(e) => setForm({...form, immatriculation: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="123 TN 4567" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Pièces demandées</label>
            <textarea required value={form.pieces} onChange={(e) => setForm({...form, pieces: e.target.value})}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white h-24"
              placeholder="Disque de frein AV, plaquettes, filtre à huile..." />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Description complémentaire</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white h-24"
              placeholder="Problème constaté, kilométrage, etc." />
          </div>

          <button type="submit" className="w-full px-6 py-4 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Envoyer ma demande
          </button>
        </form>
      </div>
    </div>
  )
}