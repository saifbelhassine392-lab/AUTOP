"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { 
  Wrench, Package, TrendingUp, Users, DollarSign, 
  Bell, Search, Filter, Download, Plus,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

const STATS = [
  { label: "Devis ce mois", value: "24", change: "+12%", up: true, icon: DollarSign },
  { label: "Commandes actives", value: "8", change: "+3", up: true, icon: Package },
  { label: "Clients actifs", value: "15", change: "+5", up: true, icon: Users },
  { label: "CA estimé", value: "12,450 TND", change: "+18%", up: true, icon: TrendingUp },
];

const RECENT_QUOTES = [
  { id: "D-001", client: "Garage Central", vehicle: "Peugeot 308", amount: "450 TND", status: "en_attente", date: "07/07/2026" },
  { id: "D-002", client: "Auto Service", vehicle: "Renault Clio 4", amount: "280 TND", status: "approuve", date: "06/07/2026" },
  { id: "D-003", client: "Mécanique Plus", vehicle: "VW Golf 7", amount: "620 TND", status: "livre", date: "05/07/2026" },
  { id: "D-004", client: "Speed Garage", vehicle: "Fiat Tipo", amount: "190 TND", status: "en_attente", date: "05/07/2026" },
];

const INVENTORY = [
  { ref: "BRK-308-01", name: "Kit Frein Avant Peugeot 308", stock: 12, price: "145 TND", alert: false },
  { ref: "EMB-CLIO-02", name: "Kit Embrayage Renault Clio 4", stock: 5, price: "320 TND", alert: true },
  { ref: "FIL-001", name: "Filtre à Huile Universel", stock: 45, price: "25 TND", alert: false },
  { ref: "BOU-BOSCH", name: "Bougie Bosch Iridium", stock: 3, price: "45 TND", alert: true },
];

export default function EspacePro() {
  const { user, isPro } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isPro) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Wrench className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès Réservé</h2>
          <p className="text-gray-400 mb-6">Cet espace est réservé aux professionnels.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "approuve": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "livre": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente": return "En attente";
      case "approuve": return "Approuvé";
      case "livre": return "Livré";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Pro */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Espace Commercial Pro</h1>
                <p className="text-gray-400 text-sm">{user?.company || user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-white transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <span className="px-3 py-1 bg-amber-600/20 text-amber-400 rounded-full text-xs font-semibold">
                PRO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: TrendingUp },
            { id: "devis", label: "Mes Devis", icon: DollarSign },
            { id: "stock", label: "Inventaire", icon: Package },
            { id: "clients", label: "Clients", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition
                ${activeTab === tab.id 
                  ? "bg-amber-600 text-white" 
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-5 h-5 text-amber-500" />
                    <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? "text-green-400" : "text-red-400"}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-semibold">Devis Récents</h3>
                <button className="text-amber-400 text-sm hover:text-amber-300 transition">
                  Voir tout
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Référence</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Client</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Véhicule</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Montant</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Statut</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {RECENT_QUOTES.map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4 text-white font-mono text-sm">{quote.id}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{quote.client}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{quote.vehicle}</td>
                        <td className="px-6 py-4 text-white font-semibold text-sm">{quote.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(quote.status)}`}>
                            {getStatusLabel(quote.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{quote.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stock" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Inventaire / Stock</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition">
                <Plus className="w-4 h-4" />
                Ajouter Produit
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Référence</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Produit</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Stock</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Prix</th>
                    <th className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase">Alerte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {INVENTORY.map((item) => (
                    <tr key={item.ref} className="hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 text-white font-mono text-sm">{item.ref}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.stock <= 5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {item.stock} unités
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold text-sm">{item.price}</td>
                      <td className="px-6 py-4">
                        {item.alert ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Stock Faible
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "devis" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Gestion des Devis</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition">
                <Plus className="w-4 h-4" />
                Nouveau Devis
              </button>
            </div>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher un devis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm transition">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm transition">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Base Clients</h3>
            <p className="text-gray-400 text-sm">Gestion de la base clients professionnels...</p>
          </div>
        )}
      </div>
    </div>
  );
}