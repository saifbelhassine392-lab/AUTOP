"use client";

import { useApp } from '@/lib/context';
import { Search } from 'lucide-react';

// Type pour les items du sidebar
type SidebarItem = {
  id: string;
  label: string;
  badge?: number;
  badgeColor?: string;
  isButton?: boolean;
};

type SidebarSection = {
  title: string;
  color?: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Demandes Clients",
    items: [
      { id: 'reception', label: 'Reception Demandes', badge: 3, badgeColor: 'bg-accent-red' },
      { id: 'traitement', label: 'En Traitement', badge: 5, badgeColor: 'bg-accent-blue' },
      { id: 'devis-gen', label: 'Devis Genere', badge: 12, badgeColor: 'bg-accent-green' },
      { id: 'bons', label: 'Bons de Commande', badge: 8, badgeColor: 'bg-accent-purple' },
    ]
  },
  {
    title: "Gestion Devis",
    items: [
      { id: 'creer-devis', label: 'Creer / Modifier Devis' },
      { id: 'generer-pdf', label: 'Generer PDF' },
      { id: 'envoi', label: 'Envoi Email / WhatsApp' },
    ]
  },
  {
    title: "Fournisseurs",
    color: "text-accent-green",
    items: [
      { id: 'recherche-four', label: 'Recherche Fournisseurs', isButton: true },
      { id: 'comparatif', label: 'Comparatif Prix' },
    ]
  },
  {
    title: "Gestion Articles",
    items: [
      { id: 'ajouter-article', label: 'Ajouter Article' },
      { id: 'modifier-article', label: 'Modifier / Supprimer' },
      { id: 'liste-articles', label: 'Liste Complete' },
    ]
  },
  {
    title: "Statistiques",
    color: "text-accent-red",
    items: [
      { id: 'tableau-bord', label: 'Tableau de Bord' },
      { id: 'chiffre', label: "Chiffre d'Affaires" },
    ]
  }
];

export default function AdminSidebar() {
  const { adminSection, setAdminSection } = useApp();

  return (
    <aside className="bg-bg-card border-r border-border-custom p-4 md:p-5 w-[240px] md:w-[280px] hidden md:block overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-4 md:mb-6">
          <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[1.5px] mb-2 md:mb-3 pl-2 ${section.color || 'text-gold'}`}>
            {section.title}
          </div>
          {section.items.map((item: SidebarItem) => (
            item.isButton ? (
              <button
                key={item.id}
                onClick={() => setAdminSection(item.id)}
                className="w-full bg-gradient-to-br from-accent-green to-emerald-600 text-white py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-green/30 transition-all"
              >
                <Search size={12} /> {item.label}
              </button>
            ) : (
              <div
                key={item.id}
                onClick={() => setAdminSection(item.id)}
                className={`flex items-center gap-2 md:gap-2.5 px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl text-xs md:text-[13px] cursor-pointer mb-0.5 md:mb-1 transition-all ${
                  adminSection === item.id
                    ? 'bg-gold/10 text-gold'
                    : 'text-text-muted hover:bg-gold/10 hover:text-gold'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className={`ml-auto ${item.badgeColor} text-white text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-bold`}>
                    {item.badge}
                  </span>
                )}
              </div>
            )
          ))}
        </div>
      ))}
    </aside>
  );
}