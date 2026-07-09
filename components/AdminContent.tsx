"use client";

import { useApp } from '@/lib/context';
import { useState } from 'react';
import { Search, Filter, Edit3, FileText, Mail, MessageCircle, Phone } from 'lucide-react';
import { demandes, fournisseurs, devisItems } from '@/lib/data';

export default function AdminContent() {
  const { adminSection } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const renderReception = () => (
    <div className="animate-fade-in">
      <div className="text-lg md:text-xl font-extrabold mb-1">DEMANDES CLIENTS EN ATTENTE</div>
      <div className="text-xs md:text-[13px] text-text-muted mb-4 md:mb-6">Traitez les demandes recues en temps reel</div>

      <div className="flex gap-2 md:gap-2.5 mb-4 md:mb-5">
        <input
          type="text"
          placeholder="Rechercher par client, vehicule, N demande..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 bg-bg-card border border-border-custom rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-text text-xs md:text-[13px] outline-none focus:border-accent-blue transition-colors"
        />
        <select className="bg-bg-card border border-border-custom rounded-xl px-2.5 md:px-3.5 py-2 md:py-2.5 text-text text-xs md:text-[13px] outline-none min-w-[100px] md:min-w-[140px]">
          <option>Tous statuts</option>
          <option>Nouveau</option>
          <option>En traitement</option>
        </select>
        <button className="bg-accent-blue text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs hover:opacity-90 transition-opacity">
          <Filter size={12}  className="inline mr-1" /> Filtrer
        </button>
      </div>

      {demandes.filter(d =>
        d.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(d => (
        <div key={d.id} className="bg-bg-card border border-border-custom rounded-2xl p-4 md:p-6 mb-3 md:mb-4 animate-slide-in">
          <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${d.avatarColor} flex items-center justify-center font-bold text-sm md:text-base text-white`}>
              {d.initials}
            </div>
            <div>
              <h4 className="text-sm md:text-[15px] font-bold">{d.client}</h4>
              <div className="text-[10px] md:text-xs text-text-muted flex gap-2 md:gap-3 flex-wrap">
                <span>{d.phone}</span>
                <span>{d.email}</span>
                <span className="hidden md:inline">Recu le {d.date}</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-dark rounded-xl p-3 md:p-4 mb-3 md:mb-4">
            <div className="text-xs md:text-sm font-bold mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2 flex-wrap">
              {d.vehicle} | VIN: {d.vin}
            </div>
            <div className="text-xs md:text-[13px] text-text-muted leading-relaxed">
              Demande: {d.request} {d.photos && `| ${d.photos} photos jointes`}
            </div>
          </div>
          <div className="flex gap-1.5 md:gap-2.5 flex-wrap">
            <button className="bg-accent-red text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
              <Edit3 size={12}  /> CREER DEVIS
            </button>
            <button className="bg-accent-blue text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
              <Search size={12}  /> CONSULTER FOURNISSEURS
            </button>
            <button className="bg-bg-card-hover border border-border-light text-text px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:border-accent-blue transition-colors">
              <Phone size={12}  /> CONTACTER CLIENT
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreerDevis = () => {
    const totalHT = devisItems.reduce((sum, item) => sum + item.total, 0);
    const tva = totalHT * 0.19;
    const totalTTC = totalHT + tva;

    return (
      <div className="animate-fade-in">
        <div className="text-lg md:text-xl font-extrabold mb-1">CREER / MODIFIER DEVIS</div>
        <div className="text-xs md:text-[13px] text-text-muted mb-4 md:mb-6">Generez et modifiez vos devis clients</div>

        <div className="bg-bg-card border border-border-custom rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm md:text-base text-white">MB</div>
            <div>
              <h4 className="text-sm md:text-[15px] font-bold">Mohamed Ben Ali - Peugeot 308</h4>
              <div className="text-[10px] md:text-xs text-text-muted">98 123 456 | mohamed@email.com</div>
            </div>
          </div>

          <div className="bg-bg-dark rounded-xl p-4 md:p-5 my-3 md:my-4 border-2 border-accent-red/30">
            <div className="flex justify-between items-center mb-3 md:mb-4 pb-3 md:pb-4 border-b-2 border-accent-red">
              <div className="text-xl md:text-[22px] font-black text-accent-red">AUTOP</div>
              <div className="text-right text-[10px] md:text-xs text-text-muted">
                <div className="font-bold text-text">DEVIS N DV-2026-003</div>
                <div>Date: 07/07/2026</div>
                <div>Valable 15 jours</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-[13px]">
                <thead>
                  <tr className="bg-accent-red">
                    <th className="p-1.5 md:p-2.5 text-left text-white text-[10px] md:text-[11px]">DESIGNATION</th>
                    <th className="p-1.5 md:p-2.5 text-center text-white text-[10px] md:text-[11px]">QTE</th>
                    <th className="p-1.5 md:p-2.5 text-left text-white text-[10px] md:text-[11px]">REF.</th>
                    <th className="p-1.5 md:p-2.5 text-right text-white text-[10px] md:text-[11px]">P.U. HT</th>
                    <th className="p-1.5 md:p-2.5 text-right text-white text-[10px] md:text-[11px]">TOTAL HT</th>
                  </tr>
                </thead>
                <tbody>
                  {devisItems.map((item, i) => (
                    <tr key={i} className="border-b border-border-custom">
                      <td className="p-2 md:p-3">{item.designation}</td>
                      <td className="p-2 md:p-3 text-center">{item.qty}</td>
                      <td className="p-2 md:p-3">{item.ref}</td>
                      <td className="p-2 md:p-3 text-right font-bold">{item.pu.toFixed(2)} TND</td>
                      <td className="p-2 md:p-3 text-right font-bold">{item.total.toFixed(2)} TND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-3 md:mt-4 pt-3 md:pt-4 border-t-2 border-accent-red">
              <div className="flex justify-end gap-6 md:gap-10 mb-1 md:mb-1.5 text-xs md:text-sm">
                <span className="text-text-muted">Total HT:</span>
                <span className="font-bold">{totalHT.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-end gap-6 md:gap-10 mb-1 md:mb-1.5 text-xs md:text-sm">
                <span className="text-text-muted">TVA 19%:</span>
                <span className="font-bold">{tva.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-end gap-6 md:gap-10 text-lg md:text-xl font-extrabold">
                <span>TOTAL TTC:</span>
                <span className="text-accent-red">{totalTTC.toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 md:gap-2.5 flex-wrap mt-3 md:mt-4">
            <button className="bg-accent-red text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
              <Edit3 size={12}  /> MODIFIER DEVIS
            </button>
            <button className="bg-accent-blue text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
              <FileText size={12}  /> GENERER PDF
            </button>
            <button className="bg-bg-card-hover border border-border-light text-text px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:border-accent-blue transition-colors">
              <Mail size={12}  /> ENVOYER CLIENT
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRechercheFour = () => (
    <div className="animate-fade-in">
      <div className="text-lg md:text-xl font-extrabold mb-1">CONSULTATION FOURNISSEURS</div>
      <div className="text-xs md:text-[13px] text-text-muted mb-4 md:mb-6">Comparez les prix et approvisionnez les pieces demandees</div>

      <div className="flex gap-2 md:gap-2.5 mb-4 md:mb-5">
        <input
          type="text"
          placeholder="Rechercher une piece par reference ou designation..."
          className="flex-1 bg-bg-card border border-border-custom rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-text text-xs md:text-[13px] outline-none focus:border-accent-blue transition-colors"
        />
        <select className="bg-bg-card border border-border-custom rounded-xl px-2.5 md:px-3.5 py-2 md:py-2.5 text-text text-xs md:text-[13px] outline-none min-w-[120px] md:min-w-[160px]">
          <option>Tous fournisseurs</option>
          <option>Europieces Tunisie</option>
          <option>Auto Pieces Sfax</option>
          <option>Pieces Auto Plus</option>
        </select>
        <button className="bg-accent-blue text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs hover:opacity-90 transition-opacity">
          <Search size={12}  className="inline mr-1" /> Rechercher
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-[13px] mb-3 md:mb-4">
          <thead>
            <tr className="bg-bg-dark">
              <th className="p-2.5 md:p-3.5 text-left font-bold text-accent-green uppercase text-[10px] md:text-[11px] tracking-wider">FOURNISSEUR</th>
              <th className="p-2.5 md:p-3.5 text-left font-bold text-accent-green uppercase text-[10px] md:text-[11px] tracking-wider">REFERENCE</th>
              <th className="p-2.5 md:p-3.5 text-left font-bold text-accent-green uppercase text-[10px] md:text-[11px] tracking-wider">MARQUE</th>
              <th className="p-2.5 md:p-3.5 text-left font-bold text-accent-green uppercase text-[10px] md:text-[11px] tracking-wider">DISPO</th>
              <th className="p-2.5 md:p-3.5 text-left font-bold text-accent-green uppercase text-[10px] md:text-[11px] tracking-wider">PRIX HT</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((f, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-border-custom">
                <td className="p-3 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 font-bold">
                    <span className="text-base md:text-lg">ðŸ­</span> {f.name}
                  </div>
                </td>
                <td className="p-3 md:p-4">
                  <div className="font-bold text-[10px] md:text-xs">{f.ref}</div>
                  <div className="text-text-muted text-[9px] md:text-xs">{f.subRef}</div>
                </td>
                <td className="p-3 md:p-4 text-[10px] md:text-xs">{f.brand}</td>
                <td className={`p-3 md:p-4 text-[10px] md:text-xs font-bold ${f.stock.includes('STOCK') ? 'text-accent-green' : 'text-accent-orange'}`}>
                  {f.stock.includes('STOCK') ? 'EN STOCK' : 'SUR COMMANDE'}
                </td>
                <td className="p-3 md:p-4 text-accent-cyan font-extrabold text-sm md:text-[15px]">{f.price} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-br from-accent-green to-emerald-600 rounded-xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-center gap-1.5 md:gap-2.5 font-bold text-xs md:text-sm text-white">
        MEILLEUR PRIX SELECTIONNE : EUROPIECES TUNISIE - 210 TND HT - ORIGINE PSA - DISPONIBLE
      </div>
    </div>
  );

  const renderTableauBord = () => (
    <div className="animate-fade-in">
      <div className="text-lg md:text-xl font-extrabold mb-1">TABLEAU DE BORD</div>
      <div className="text-xs md:text-[13px] text-text-muted mb-4 md:mb-6">Vue d'ensemble de votre activite</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-green mb-1">12</div>
          <div className="text-[9px] md:text-[11px] text-text-muted uppercase tracking-wider">DEMANDES EN ATTENTE</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-blue mb-1">5</div>
          <div className="text-[9px] md:text-[11px] text-text-muted uppercase tracking-wider">EN TRAITEMENT</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-orange mb-1">8</div>
          <div className="text-[9px] md:text-[11px] text-text-muted uppercase tracking-wider">BONS DE COMMANDE</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-purple mb-1">24</div>
          <div className="text-[9px] md:text-[11px] text-text-muted uppercase tracking-wider">DEVIS GENERES</div>
        </div>
      </div>
    </div>
  );

  const sections: Record<string, React.ReactNode> = {
    'reception': renderReception(),
    'traitement': renderReception(),
    'devis-gen': renderCreerDevis(),
    'bons': renderReception(),
    'creer-devis': renderCreerDevis(),
    'generer-pdf': renderCreerDevis(),
    'envoi': renderCreerDevis(),
    'recherche-four': renderRechercheFour(),
    'comparatif': renderRechercheFour(),
    'ajouter-article': renderReception(),
    'modifier-article': renderReception(),
    'liste-articles': renderReception(),
    'tableau-bord': renderTableauBord(),
    'chiffre': renderTableauBord(),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 overflow-y-auto">
      {sections[adminSection] || renderReception()}
    </div>
  );
}
