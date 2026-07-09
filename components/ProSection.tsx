"use client";

import { useApp } from '@/lib/context';
import { Lock, FileText, Mail, MessageCircle, Edit3 } from 'lucide-react';

export default function ProSection() {
  const { setIsAdmin, setCurrentPage, setAdminSection } = useApp();

  return (
    <div className="bg-bg-card border-2 border-gold rounded-[20px] p-5 md:p-6 mb-8 md:mb-10">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2 md:gap-2.5 text-sm md:text-base font-extrabold text-gold">
          <Lock size={16} /> ESPACE COMMERCIAL (PRO)
        </div>
        <button
          onClick={() => { setIsAdmin(true); setCurrentPage('admin'); setAdminSection('reception'); }}
          className="bg-accent-red text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold hover:bg-accent-red-hover transition-colors cursor-pointer"
        >
          ACCES PRIVE
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-green mb-1">12</div>
          <div className="text-[10px] text-accent-green uppercase tracking-wider">DEMANDES EN ATTENTE</div>
        </div>
        <div className="bg-bg-dark rounded-xl md:rounded-[14px] p-4 md:p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-accent-blue mb-1">8</div>
          <div className="text-[10px] text-accent-blue uppercase tracking-wider">EN PREPARATION</div>
        </div>
      </div>

      <div className="text-xs md:text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2.5 md:mb-3 flex items-center gap-1.5 md:gap-2">
        TABLEAU COMPARATIF PRIX FOURNISSEURS
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs md:text-[13px] mb-3 md:mb-4">
          <thead>
            <tr className="bg-bg-dark">
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">DESIGNATION</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">QTE</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">REFERENCE</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">DISPO</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">MARQUE</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">FOUR 1</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">FOUR 2</th>
              <th className="p-2 md:p-3 text-left font-bold text-gold uppercase text-[10px] md:text-[11px] tracking-wider border-b-2 border-border-custom">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-2 md:p-3.5 border-b border-border-custom font-bold">Kit Embrayage</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom">1</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom">1611273080</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom text-accent-green font-bold">OUI</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom">ORIGINE</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom text-accent-cyan font-bold">210 HT</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom text-accent-cyan font-bold">241 HT</td>
              <td className="p-2 md:p-3.5 border-b border-border-custom">
                <button className="bg-accent-blue text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
                  <Edit3 size={10} /> MODIFIER
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 md:gap-2.5 flex-wrap mb-5 md:mb-0">
        <button className="bg-accent-red text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
          <FileText size={12} /> GENERER PDF
        </button>
        <button className="bg-accent-green text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
          <Mail size={12} /> ENVOYER EMAIL
        </button>
        <button className="bg-accent-green text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 hover:opacity-90 transition-opacity">
          <MessageCircle size={12} /> ENVOYER WHATSAPP
        </button>
      </div>

      <div className="text-center mt-5 md:mt-8 md:hidden">
        <button
          onClick={() => { setIsAdmin(true); setCurrentPage('admin'); setAdminSection('reception'); }}
          className="bg-accent-red text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl font-bold text-xs md:text-sm hover:bg-accent-red-hover transition-colors pulse-glow"
        >
          ACCEDER A L'ESPACE COMMERCIAL PRO
        </button>
      </div>
    </div>
  );
}