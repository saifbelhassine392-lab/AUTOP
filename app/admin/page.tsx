"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const COMMERCIAUX = [
  { id: "amine", nom: "Amine", couleur: "bg-green-500", border: "border-green-500" },
  { id: "saif", nom: "Saif", couleur: "bg-blue-500", border: "border-blue-500" },
  { id: "saifallah", nom: "Saifallah", couleur: "bg-purple-500", border: "border-purple-500" },
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [profilActif, setProfilActif] = useState<string>("")

  useEffect(() => {
    const saved = localStorage.getItem("autop_profil")
    if (saved) setProfilActif(saved)
  }, [])

  const choisirProfil = (nom: string) => {
    setProfilActif(nom)
    localStorage.setItem("autop_profil", nom)
  }

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Chargement...</div>
  }

  if (status === "unauthenticated") {
    router.push("/connexion")
    return null
  }

  // === SÉLECTEUR DE PROFIL ===
  if (!profilActif) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-4">
        <div className="text-center max-w-lg">
          <div className="text-5xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur AUTOP Admin</h1>
          <p className="text-slate-400 mb-8">Qui est en ligne aujourd'hui ?</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {COMMERCIAUX.map((c) => (
              <button
                key={c.id}
                onClick={() => choisirProfil(c.nom)}
                className={`w-36 h-36 rounded-2xl bg-slate-800 border-2 ${c.border} border-opacity-30 hover:border-opacity-100 hover:scale-105 transition-all flex flex-col items-center justify-center gap-3`}
              >
                <div className={`w-14 h-14 rounded-full ${c.couleur} flex items-center justify-center text-xl font-bold text-white`}>
                  {c.nom[0]}
                </div>
                <span className="font-semibold text-lg">{c.nom}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: "📊" },
    { id: "products", label: "Produits", icon: "📦" },
    { id: "orders", label: "Commandes", icon: "🛒" },
    { id: "customers", label: "Clients", icon: "👥" },
    { id: "quotes", label: "Devis", icon: "📄" },
    { id: "settings", label: "Paramètres", icon: "⚙️" },
  ]

  const commercial = COMMERCIAUX.find(c => c.nom === profilActif)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-blue-500">⚡ AUTOP</Link>
          <p className="text-xs text-slate-400 mt-1">Espace Administrateur</p>
        </div>
        
        {/* Profil actif */}
        <div className="mx-4 mb-4 p-3 bg-slate-700/50 rounded-xl border border-slate-600">
          <p className="text-xs text-slate-400 mb-1">Commercial en ligne</p>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${commercial?.couleur || 'bg-gray-500'} flex items-center justify-center text-sm font-bold`}>
              {profilActif[0]}
            </div>
            <span className="font-semibold">{profilActif}</span>
          </div>
          <button 
            onClick={() => { setProfilActif(""); localStorage.removeItem("autop_profil") }}
            className="text-xs text-slate-400 hover:text-white mt-2 underline"
          >
            Changer de profil
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-slate-400">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Connecté en tant que <span className={`font-semibold ${commercial?.couleur.replace('bg-', 'text-') || 'text-white'}`}>{profilActif}</span>
            </p>
          </div>
          <Link href="/" className="px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-colors">
            ← Retour au site
          </Link>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Chiffre d'affaires</div>
                <div className="text-3xl font-bold">24,580 €</div>
                <div className="text-green-400 text-sm mt-1">↑ +12.5%</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Commandes</div>
                <div className="text-3xl font-bold">186</div>
                <div className="text-green-400 text-sm mt-1">↑ +8.2%</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Produits</div>
                <div className="text-3xl font-bold">1,247</div>
                <div className="text-orange-400 text-sm mt-1">↓ 3 en rupture</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Clients</div>
                <div className="text-3xl font-bold">892</div>
                <div className="text-green-400 text-sm mt-1">↑ +24 nouveaux</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 font-semibold">Produits récents</div>
                <table className="w-full">
                  <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Produit</th>
                      <th className="px-6 py-3 text-left">Catégorie</th>
                      <th className="px-6 py-3 text-left">Prix</th>
                      <th className="px-6 py-3 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">Disque de frein AV</div>
                        <div className="text-xs text-slate-400">REF-2847</div>
                      </td>
                      <td className="px-6 py-4 text-sm">Freinage</td>
                      <td className="px-6 py-4 font-medium">89,90 €</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">En stock</span></td>
                    </tr>
                    <tr className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">Kit embrayage</div>
                        <div className="text-xs text-slate-400">REF-1923</div>
                      </td>
                      <td className="px-6 py-4 text-sm">Transmission</td>
                      <td className="px-6 py-4 font-medium">245,00 €</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">Faible</span></td>
                    </tr>
                    <tr className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">Filtre à huile</div>
                        <div className="text-xs text-slate-400">REF-7782</div>
                      </td>
                      <td className="px-6 py-4 text-sm">Entretien</td>
                      <td className="px-6 py-4 font-medium">12,90 €</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Rupture</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="font-semibold mb-4">Activité récente</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                    <div>
                      <p className="text-sm">Nouvelle commande <strong>#CMD-4821</strong></p>
                      <p className="text-xs text-slate-400">Il y a 5 min</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                    <div>
                      <p className="text-sm">Nouveau devis <strong>Ahmed K.</strong></p>
                      <p className="text-xs text-slate-400">Il y a 12 min</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2"></div>
                    <div>
                      <p className="text-sm">Stock faible : Filtre à huile</p>
                      <p className="text-xs text-slate-400">Il y a 1h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-semibold">Tous les produits</h2>
              <button className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                + Ajouter un produit
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 text-left">Produit</th>
                  <th className="px-6 py-3 text-left">Catégorie</th>
                  <th className="px-6 py-3 text-left">Prix</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr className="hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="font-medium">Disque de frein AV</div>
                    <div className="text-xs text-slate-400">REF-2847</div>
                  </td>
                  <td className="px-6 py-4 text-sm">Freinage</td>
                  <td className="px-6 py-4 font-medium">89,90 €</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">124 en stock</span></td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">✏️</button>
                    <button className="text-red-400 hover:text-red-300">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-semibold">Commandes clients</h2>
              <button 
                onClick={() => {
                  localStorage.removeItem("autop_orders")
                  window.location.reload()
                }}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20"
              >
                Vider les commandes
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 text-left">N°</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Montant</th>
                  <th className="px-6 py-3 text-left">État paiement</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {(() => {
                  const orders = JSON.parse(localStorage.getItem("autop_orders") || "[]")
                  if (orders.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          Aucune commande pour le moment
                        </td>
                      </tr>
                    )
                  }
                  return orders.map((order: any, idx: number) => (
                    <tr key={order.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-medium text-blue-400">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.client?.name}</div>
                        <div className="text-xs text-slate-400">{order.client?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 font-medium">{order.total.toFixed(2)} €</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.paymentStatus === "Payé" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-orange-500/20 text-orange-400"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            const allOrders = JSON.parse(localStorage.getItem("autop_orders") || "[]")
                            allOrders[idx].paymentStatus = allOrders[idx].paymentStatus === "Payé" ? "Non payé" : "Payé"
                            localStorage.setItem("autop_orders", JSON.stringify(allOrders))
                            window.location.reload()
                          }}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30"
                        >
                          {order.paymentStatus === "Payé" ? "Marquer non payé" : "Marquer payé"}
                        </button>
                      </td>
                    </tr>
                  ))
                })()}
              </tbody>
            </table>
          </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 font-semibold">Clients</div>
            <table className="w-full">
              <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 text-left">Nom</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Inscrit le</th>
                  <th className="px-6 py-3 text-left">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <tr className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium">Admin AUTOP</td>
                  <td className="px-6 py-4 text-sm">admin@autop.tn</td>
                  <td className="px-6 py-4 text-sm text-slate-400">08/07/2026</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">admin</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* DEVIS */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            {(() => {
              const devis = JSON.parse(localStorage.getItem("autop_devis") || "[]")
              if (devis.length === 0) {
                return <div className="text-slate-500 text-center py-12">Aucun devis en attente</div>
              }
              return devis.map((d: any, idx: number) => (
                <div key={d.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-blue-400">{d.id}</h3>
                      <p className="text-slate-400">{d.client?.name} — {d.client?.email}</p>
                      <p className="text-sm text-slate-500">{new Date(d.date).toLocaleString("fr-FR")}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      d.status === "Traité" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-400">Véhicule</p>
                      <p className="font-medium">{d.marque} {d.modele} ({d.annee})</p>
                      <p className="text-xs text-slate-500">{d.immatriculation}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-400">Pièces demandées</p>
                      <p className="font-medium">{d.pieces}</p>
                    </div>
                  </div>

                  {d.description && (
                    <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-slate-400">Description :</p>
                      <p className="text-sm">{d.description}</p>
                    </div>
                  )}

                  {d.status === "En attente" ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Réponse au client : prix, disponibilité, délai..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white h-24"
                        id={`reponse-${idx}`}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const reponse = (document.getElementById(`reponse-${idx}`) as HTMLTextAreaElement)?.value
                            const allDevis = JSON.parse(localStorage.getItem("autop_devis") || "[]")
                            allDevis[idx].status = "Traité"
                            allDevis[idx].reponse = reponse
                            allDevis[idx].produits = [
                              { id: "REF-2847", name: "Disque de frein AV", price: 89.90 },
                              { id: "REF-1923", name: "Kit embrayage", price: 245.00 },
                            ]
                            localStorage.setItem("autop_devis", JSON.stringify(allDevis))
                            window.location.reload()
                          }}
                          className="px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700"
                        >
                          Envoyer le devis au client
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-sm text-slate-400 mb-1">Réponse envoyée :</p>
                      <p className="text-sm">{d.reponse}</p>
                      {d.produits && (
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <p className="text-xs text-slate-400 mb-2">Propositions :</p>
                          {d.produits.map((p: any) => (
                            <div key={p.id} className="flex justify-between text-sm">
                              <span>{p.name}</span>
                              <span className="font-bold text-blue-400">{p.price.toFixed(2)} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            })()}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Informations boutique</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nom de la boutique</label>
                  <input type="text" defaultValue="AUTOP - Pièces Auto" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email de contact</label>
                  <input type="email" defaultValue="contact@autop.tn" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                </div>
                <button className="px-6 py-3 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors">Sauvegarder</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}