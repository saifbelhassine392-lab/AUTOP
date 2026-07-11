"use client";

import { useApp } from '@/lib/context';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  Search, Edit3, FileText, Mail, Phone,
  Plus, Trash2, Save, X, Send,
  Building2, UserPlus, List, ClipboardList, Package,
  CheckCircle, AlertTriangle, Printer,
  ShoppingBag, BarChart2
} from 'lucide-react';

// ─── Input style helper ───────────────────────────────────────────────────────
const inputCls = "w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 uppercase placeholder:text-slate-400 placeholder:font-normal placeholder:normal-case";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1";
const cardCls = "bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4";

// ─── SECTION: RÉCEPTION DEMANDES ──────────────────────────────────────────────
interface SectionReceptionProps {
  onTreatQuote?: (q: any) => void;
}

function SectionReception({ onTreatQuote }: SectionReceptionProps) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TOUS STATUTS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotes').then(r => r.json()).then(d => {
      setQuotes(Array.isArray(d) ? d : d.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = quotes.filter(q => {
    const matchesSearch = 
      q.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      q.brand?.toLowerCase().includes(search.toLowerCase()) ||
      q.id?.includes(search);
    
    if (statusFilter === 'EN ATTENTE') {
      return matchesSearch && q.status !== 'TREATED';
    }
    if (statusFilter === 'TRAITÉ') {
      return matchesSearch && q.status === 'TREATED';
    }
    return matchesSearch;
  });

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1">DEMANDES CLIENTS EN ATTENTE</h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">TRAITEZ LES DEMANDES REÇUES EN TEMPS RÉEL</p>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="RECHERCHER PAR CLIENT, VÉHICULE, N° DEMANDE..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white text-black font-semibold pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:border-red-500 uppercase placeholder:normal-case placeholder:font-normal" />
        </div>
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white text-black font-bold text-xs px-3 rounded-xl border border-slate-300"
        >
          <option value="TOUS STATUTS">TOUS STATUTS</option>
          <option value="EN ATTENTE">EN ATTENTE</option>
          <option value="TRAITÉ">TRAITÉ</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500 font-bold uppercase">CHARGEMENT...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-600 font-bold uppercase">AUCUNE DEMANDE TROUVÉE</div>
      ) : (
        filtered.map((q) => (
          <div key={q.id} className={cardCls}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-black text-red-400 text-sm uppercase font-mono">#{q.id?.slice(-6).toUpperCase()}</span>
                <h4 className="font-black text-white uppercase text-sm mt-0.5">{q.clientName?.toUpperCase()}</h4>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                  {q.clientEmail} · {q.createdAt ? new Date(q.createdAt).toLocaleDateString('fr-FR') : ''}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                q.status === 'TREATED' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>{q.status === 'TREATED' ? 'TRAITÉ' : 'EN ATTENTE'}</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 mb-3">
              <div className="text-xs font-black text-white uppercase mb-1">{q.brand} {q.model} {q.vin && `· VIN: ${q.vin}`}</div>
              <div className="text-xs text-slate-400 uppercase">
                {q.items?.map((it: any) => `${it.designation} (x${it.quantity})`).join(' · ')}
              </div>
              {q.remarks && <div className="text-xs text-slate-500 mt-1 uppercase">NOTE: {q.remarks}</div>}
            </div>

            <div className="flex gap-2 flex-wrap">
              {q.status !== 'TREATED' && (
                <button 
                  onClick={() => onTreatQuote && onTreatQuote(q)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition shadow shadow-red-600/20"
                >
                  <Edit3 className="w-3.5 h-3.5" /> CRÉER DEVIS
                </button>
              )}
              <a 
                href={`https://wa.me/${q.phone || '21698774525'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5" /> CONTACTER
              </a>
              <a 
                href={`mailto:${q.clientEmail}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition"
              >
                <Mail className="w-3.5 h-3.5" /> ENVOYER EMAIL
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── SECTION: CRÉER / MODIFIER DEVIS ─────────────────────────────────────────
interface SectionCreerDevisProps {
  quoteToLoad?: any;
  onClearQuote?: () => void;
}

function SectionCreerDevis({ quoteToLoad, onClearQuote }: SectionCreerDevisProps) {
  const { data: session } = useSession();
  const [items, setItems] = useState<any[]>([
    { designation: '', reference: '', qty: 1, puHT: 0, discount: 0 }
  ]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [vin, setVin] = useState('');
  const [notes, setNotes] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Charger la demande de devis si elle est sélectionnée
  useEffect(() => {
    if (quoteToLoad) {
      setClientName(quoteToLoad.clientName || '');
      setClientEmail(quoteToLoad.clientEmail || '');
      setVehicle(`${quoteToLoad.brand || ''} ${quoteToLoad.model || ''}`.trim());
      setVin(quoteToLoad.vin || '');
      setNotes(`Proposition commerciale pour la demande #${quoteToLoad.id.slice(-6).toUpperCase()}`);
      if (Array.isArray(quoteToLoad.items) && quoteToLoad.items.length > 0) {
        setItems(quoteToLoad.items.map((it: any) => ({
          designation: it.designation || '',
          reference: it.reference || '',
          qty: it.quantity || 1,
          puHT: 0,
          discount: 0
        })));
      }
    }
  }, [quoteToLoad]);

  const addLine = () => setItems(prev => [...prev, { designation: '', reference: '', qty: 1, puHT: 0, discount: 0 }]);
  const removeLine = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: string, val: any) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const subtotalHT = items.reduce((sum, it) => {
    const lineTotal = it.qty * it.puHT;
    const lineDiscount = lineTotal * (it.discount / 100);
    return sum + (lineTotal - lineDiscount);
  }, 0);
  const globalDiscountAmt = subtotalHT * (globalDiscount / 100);
  const afterDiscount = subtotalHT - globalDiscountAmt;
  const tva = afterDiscount * 0.19;
  const totalTTC = afterDiscount + tva;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveDevis = async (sendNotification = false) => {
    if (!clientName.trim()) { alert('LE NOM DU CLIENT EST REQUIS.'); return; }
    if (!clientEmail.trim()) { alert('L\'EMAIL DU CLIENT EST REQUIS.'); return; }
    if (items.length === 0 || items.every(it => !it.designation.trim())) {
      alert('VEUILLEZ RENSEIGNER AU MOINS UN ARTICLE.');
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: clientEmail.trim(),
          vehicleBrand: vehicle.split(' ')[0] || 'Générique',
          vehicleModel: vehicle.split(' ').slice(1).join(' ') || 'N/A',
          vehicleYear: 2024,
          vehicleVin: vin,
          notes: notes,
          totalPrice: totalTTC,
          responseNote: `Proposition commerciale établie par l'administrateur.\nRemise globale de ${globalDiscount}%.`,
          items: items.filter(it => it.designation.trim()),
          quoteId: quoteToLoad?.id || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur de création");
      }

      setSaved(true);
      alert(`✅ DEVIS ENREGISTRÉ AVEC SUCCÈS ! ${sendNotification ? 'E-mail de confirmation envoyé au client.' : ''}`);
      
      // Reset form
      setClientName('');
      setClientEmail('');
      setVehicle('');
      setVin('');
      setNotes('');
      setItems([{ designation: '', reference: '', qty: 1, puHT: 0, discount: 0 }]);
      setGlobalDiscount(0);
      
      if (onClearQuote) onClearQuote();
      setTimeout(() => setSaved(false), 5000);

    } catch (err: any) {
      console.error(err);
      alert(`Erreur : ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1">CRÉER / MODIFIER DEVIS</h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">GÉNÉREZ ET MODIFIEZ VOS DEVIS CLIENTS</p>

      {/* Client Info */}
      <div className={cardCls}>
        <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">INFORMATIONS CLIENT</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>NOM CLIENT *</label>
            <input type="text" className={inputCls} placeholder="NOM COMPLET" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>EMAIL CLIENT *</label>
            <input type="email" className="w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 placeholder:text-slate-400 font-sans" placeholder="email@client.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>VÉHICULE</label>
            <input type="text" className={inputCls} placeholder="EX: PEUGEOT 208 1.2" value={vehicle} onChange={e => setVehicle(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>NUMÉRO VIN</label>
            <input type="text" className={inputCls} placeholder="VIN / CHASSIS" value={vin} onChange={e => setVin(e.target.value)} />
          </div>
        </div>
        <div className="mt-3">
          <label className={labelCls}>NOTES / OBSERVATIONS</label>
          <textarea rows={2} className="w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 resize-none" placeholder="Notes additionnelles..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>

      {/* Items Table */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">LIGNES DU DEVIS</div>
          <button onClick={addLine} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase rounded-lg transition">
            <Plus className="w-3.5 h-3.5" /> AJOUTER LIGNE
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-950 text-[10px] font-black uppercase text-slate-400">
                <th className="px-3 py-2.5 text-left rounded-l-lg">DÉSIGNATION</th>
                <th className="px-3 py-2.5 text-left">RÉFÉRENCE</th>
                <th className="px-3 py-2.5 text-center">QTÉ</th>
                <th className="px-3 py-2.5 text-right">P.U. HT</th>
                <th className="px-3 py-2.5 text-right">REMISE %</th>
                <th className="px-3 py-2.5 text-right">TOTAL HT</th>
                <th className="px-3 py-2.5 text-center rounded-r-lg">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const lineTotal = it.qty * it.puHT;
                const discounted = lineTotal - lineTotal * (it.discount / 100);
                return (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="px-2 py-2">
                      <input type="text" value={it.designation} onChange={e => updateLine(i, 'designation', e.target.value)}
                        className="w-full bg-white text-black font-semibold text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 uppercase min-w-[150px]" placeholder="DÉSIGNATION" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={it.reference} onChange={e => updateLine(i, 'reference', e.target.value)}
                        className="w-full bg-white text-black font-semibold text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 uppercase min-w-[100px]" placeholder="RÉF." />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={it.qty} min={1} onChange={e => updateLine(i, 'qty', parseFloat(e.target.value) || 1)}
                        className="w-16 bg-white text-black font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 text-center" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={it.puHT} min={0} step={0.01} onChange={e => updateLine(i, 'puHT', parseFloat(e.target.value) || 0)}
                        className="w-24 bg-white text-black font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 text-right" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={it.discount} min={0} max={100} step={1} onChange={e => updateLine(i, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-white text-black font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 text-center" />
                    </td>
                    <td className="px-2 py-2 text-right font-black text-cyan-400">{discounted.toFixed(2)} TND</td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => removeLine(i)} className="text-slate-500 hover:text-red-400 transition p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className={cardCls}>
        <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">RÉCAPITULATIF</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelCls}>REMISE GLOBALE (%)</label>
            <input type="number" min={0} max={100} value={globalDiscount} onChange={e => setGlobalDiscount(parseFloat(e.target.value) || 0)}
              className="w-full bg-white text-black font-black text-sm px-3 py-2.5 rounded-lg border border-red-500 focus:outline-none text-center text-xl" />
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase text-xs">SOUS-TOTAL HT</span>
              <span className="font-black text-white">{subtotalHT.toFixed(2)} TND</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-red-400 font-bold uppercase text-xs">REMISE GLOBALE ({globalDiscount}%)</span>
                <span className="font-black text-red-400">-{globalDiscountAmt.toFixed(2)} TND</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase text-xs">APRÈS REMISE HT</span>
              <span className="font-black text-white">{afterDiscount.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase text-xs">TVA 19%</span>
              <span className="font-black text-white">{tva.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-amber-400 font-black uppercase">TOTAL TTC</span>
              <span className="font-black text-amber-400 text-lg">{totalTTC.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-xs font-black uppercase mb-3">
            <CheckCircle className="w-4 h-4" /> DEVIS ENREGISTRÉ AVEC SUCCÈS
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" /> IMPRIMER / PDF
          </button>
          <button
            onClick={() => handleSaveDevis(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase transition disabled:opacity-50 font-sans"
          >
            <Mail className="w-3.5 h-3.5" /> {saving ? 'ENVOI...' : 'ENVOYER CLIENT'}
          </button>
          <button
            onClick={() => handleSaveDevis(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase transition disabled:opacity-50 font-sans"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER DEVIS'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: AJOUTER FOURNISSEUR ────────────────────────────────────────────
function SectionAjouterFournisseur() {
  const [form, setForm] = useState({ name: '', contactName: '', phone: '', email: '', address: '', city: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name) { setError('LE NOM DU FOURNISSEUR EST REQUIS'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSaved(true);
        setForm({ name: '', contactName: '', phone: '', email: '', address: '', city: '' });
        setTimeout(() => setSaved(false), 3000);
      } else {
        const d = await res.json();
        setError(d.error || 'ERREUR LORS DE LA CRÉATION');
      }
    } catch (e) {
      setError('ERREUR RÉSEAU');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-green-400" /> AJOUTER FOURNISSEUR
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">ENREGISTREZ UN NOUVEAU FOURNISSEUR DANS LA BASE</p>

      <div className={cardCls}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'NOM FOURNISSEUR *', key: 'name', type: 'text', placeholder: 'EX: EUROPIECES TUNISIE' },
            { label: 'CONTACT / RESPONSABLE', key: 'contactName', type: 'text', placeholder: 'NOM DU CONTACT' },
            { label: 'TÉLÉPHONE', key: 'phone', type: 'tel', placeholder: 'EX: 98 XXX XXX' },
            { label: 'EMAIL', key: 'email', type: 'email', placeholder: 'contact@fournisseur.tn' },
            { label: 'ADRESSE', key: 'address', type: 'text', placeholder: 'ADRESSE COMPLÈTE' },
            { label: 'VILLE', key: 'city', type: 'text', placeholder: 'EX: TUNIS' },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className={f.key === 'email' ? "w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-green-500" : inputCls.replace('focus:border-red-500', 'focus:border-green-500')} />
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-black uppercase">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}
        {saved && (
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-black uppercase">
            <CheckCircle className="w-4 h-4" /> FOURNISSEUR ENREGISTRÉ AVEC SUCCÈS !
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={() => setForm({ name: '', contactName: '', phone: '', email: '', address: '', city: '' })}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase border border-slate-700 transition">
            <X className="w-3.5 h-3.5" /> RÉINITIALISER
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[11px] font-black uppercase transition disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER FOURNISSEUR'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: LISTE FOURNISSEURS ─────────────────────────────────────────────
function SectionListeFournisseurs() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/suppliers').then(r => r.json()).then(d => {
      setSuppliers(d.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('SUPPRIMER CE FOURNISSEUR ?')) return;
    await fetch(`/api/suppliers?id=${id}`, { method: 'DELETE' });
    setSuppliers(p => p.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <List className="w-5 h-5 text-green-400" /> LISTE FOURNISSEURS
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">GÉREZ VOS FOURNISSEURS ENREGISTRÉS</p>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="RECHERCHER UN FOURNISSEUR..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white text-black font-semibold pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none uppercase placeholder:normal-case placeholder:font-normal" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">CHARGEMENT...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-600">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="uppercase font-bold text-sm">AUCUN FOURNISSEUR ENREGISTRÉ</p>
          <p className="text-xs text-slate-600 mt-1 uppercase">UTILISEZ "AJOUTER FOURNISSEUR" DANS LE MENU GAUCHE</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(s => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm">
                  {s.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-white uppercase text-sm">{s.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{s.contactName && `CONTACT: ${s.contactName} · `}{s.phone && `TÉL: ${s.phone}`}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{s.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {s.isActive ? 'ACTIF' : 'INACTIF'}
                </span>
                <button onClick={() => handleDelete(s.id)} className="text-slate-500 hover:text-red-400 transition p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SECTION: CONSULTATION FOURNISSEUR + BON DE COMMANDE ─────────────────────
function SectionConsultationFournisseur() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'order' | 'comparison'>('order');

  // Tab 1: Bon de commande
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([{ reference: '', designation: '', quantity: 1, unitPrice: 0 }]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedOrder, setSavedOrder] = useState<any>(null);

  // Tab 2: Comparateur & Consultation
  const [compItems, setCompItems] = useState([{ reference: '', designation: '', quantity: 1 }]);
  const [selectedSuppIds, setSelectedSuppIds] = useState<string[]>([]);
  // Prices mapping: { [supplierId]: { [itemIndex]: price } }
  const [compPrices, setCompPrices] = useState<Record<string, Record<number, number>>>({});

  useEffect(() => {
    fetch('/api/suppliers').then(r => r.json()).then(d => setSuppliers(d.data || []));
  }, []);

  const addLine = () => setItems(p => [...p, { reference: '', designation: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, val: any) =>
    setItems(p => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const totalAmount = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  const handleCreateOrder = async () => {
    if (!selectedSupplier) { alert('VEUILLEZ SÉLECTIONNER UN FOURNISSEUR'); return; }
    if (items.every(it => !it.designation)) { alert('VEUILLEZ RENSEIGNER AU MOINS UN ARTICLE'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: selectedSupplier,
          items: items.filter(it => it.designation),
          notes,
          status: 'DRAFT'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedOrder(data.data);
      }
    } finally { setSaving(false); }
  };

  const handlePrint = async () => {
    if (!savedOrder) { await handleCreateOrder(); }
    window.print();
  };

  const supplier = suppliers.find(s => s.id === selectedSupplier);

  // Comparateur actions
  const addCompLine = () => setCompItems(p => [...p, { reference: '', designation: '', quantity: 1 }]);
  const removeCompLine = (i: number) => setCompItems(p => p.filter((_, idx) => idx !== i));
  const updateCompItem = (i: number, field: string, val: any) =>
    setCompItems(p => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const handleToggleSupplier = (id: string) => {
    setSelectedSuppIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePriceChange = (suppId: string, itemIdx: number, val: number) => {
    setCompPrices(prev => ({
      ...prev,
      [suppId]: {
        ...(prev[suppId] || {}),
        [itemIdx]: val
      }
    }));
  };

  // Trouver le prix le plus bas pour une ligne
  const getLowestPriceInfo = (itemIdx: number) => {
    let minPrice = Infinity;
    let bestSuppId = '';
    selectedSuppIds.forEach(id => {
      const p = compPrices[id]?.[itemIdx] || 0;
      if (p > 0 && p < minPrice) {
        minPrice = p;
        bestSuppId = id;
      }
    });
    return { minPrice: minPrice === Infinity ? null : minPrice, bestSuppId };
  };

  const handleGeneratePOFromComparison = (suppId: string) => {
    const supp = suppliers.find(s => s.id === suppId);
    if (!supp) return;

    setSelectedSupplier(suppId);
    setItems(compItems.map((item, idx) => ({
      reference: item.reference,
      designation: item.designation,
      quantity: item.quantity,
      unitPrice: compPrices[suppId]?.[idx] || 0
    })));
    setNotes(`Généré à partir du tableau comparatif. Meilleur prix fournisseur.`);
    setActiveTab('order');
    alert(`✅ ARTICLES CHARGÉS DANS L'ONGLET BON DE COMMANDE POUR : ${supp.name.toUpperCase()}`);
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-green-400" /> CONSULTATION FOURNISSEURS
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-4">LANCEZ DES CONSULTATIONS ET CRÉEZ VOS BONS DE COMMANDE</p>

      {/* Onglets */}
      <div className="flex gap-2 mb-4 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('order')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
            activeTab === 'order' ? 'bg-green-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          📝 Bon de Commande
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
            activeTab === 'comparison' ? 'bg-green-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          📊 Comparateur de Prix
        </button>
      </div>

      {activeTab === 'order' && (
        <div className="space-y-4">
          {savedOrder && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400 font-black uppercase text-sm">
                <CheckCircle className="w-5 h-5" /> BON DE COMMANDE #{savedOrder.orderNumber} CRÉÉ !
              </div>
              <button onClick={() => setSavedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sélection fournisseur */}
          <div className={cardCls}>
            <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-3">SÉLECTION FOURNISSEUR</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>FOURNISSEUR *</label>
                <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}
                  className="w-full bg-white text-black font-black text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-green-500 uppercase">
                  <option value="">-- CHOISIR UN FOURNISSEUR --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              {supplier && (
                <div className="bg-slate-950 rounded-lg p-3 text-xs">
                  <p className="font-black text-white uppercase">{supplier.name}</p>
                  {supplier.phone && <p className="text-slate-400 uppercase font-sans">TÉL: {supplier.phone}</p>}
                  {supplier.email && <p className="text-slate-400 font-sans">{supplier.email}</p>}
                  {supplier.city && <p className="text-slate-500 uppercase">{supplier.city}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Articles */}
          <div className={cardCls}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-green-400">ARTICLES À COMMANDER</div>
              <button onClick={addLine}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-black uppercase rounded-lg transition">
                <Plus className="w-3.5 h-3.5" /> AJOUTER LIGNE
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950 text-[10px] font-black uppercase text-slate-400">
                    <th className="px-3 py-2.5 text-left rounded-l-lg">RÉFÉRENCE</th>
                    <th className="px-3 py-2.5 text-left">DÉSIGNATION *</th>
                    <th className="px-3 py-2.5 text-center">QTÉ</th>
                    <th className="px-3 py-2.5 text-right">P.U. HT (TND)</th>
                    <th className="px-3 py-2.5 text-right">TOTAL</th>
                    <th className="px-3 py-2.5 rounded-r-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="px-2 py-2">
                        <input type="text" value={it.reference} onChange={e => updateItem(i, 'reference', e.target.value)}
                          className="w-full bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none uppercase min-w-[90px]" placeholder="RÉF." />
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" value={it.designation} onChange={e => updateItem(i, 'designation', e.target.value)}
                          className="w-full bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none uppercase min-w-[160px]" placeholder="DÉSIGNATION ARTICLE" />
                      </td>
                      <td className="px-2 py-2">
                        <input type="number" value={it.quantity} min={1} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-14 bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none text-center" />
                      </td>
                      <td className="px-2 py-2">
                        <input type="number" value={it.unitPrice} min={0} step={0.01} onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none text-right" />
                      </td>
                      <td className="px-2 py-2 text-right font-black text-cyan-400">{(it.quantity * it.unitPrice).toFixed(2)} TND</td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => removeLine(i)} className="text-slate-500 hover:text-red-400 p-1 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-3 pt-3 border-t border-slate-800">
              <div className="text-right">
                <span className="text-slate-400 uppercase text-xs font-bold">TOTAL BON DE COMMANDE : </span>
                <span className="text-amber-400 font-black text-lg ml-2">{totalAmount.toFixed(2)} TND HT</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={cardCls}>
            <label className={labelCls}>NOTES / CONDITIONS</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none resize-none" placeholder="Délai de livraison, conditions paiement..." />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" /> IMPRIMER BON DE COMMANDE
            </button>
            <button onClick={handleCreateOrder} disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[11px] font-black uppercase transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'CRÉATION...' : 'CRÉER & ENREGISTRER BON DE COMMANDE'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className={cardCls}>
            <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-3 border-b border-slate-800 pb-2">1. SÉLECTIONNER LES FOURNISSEURS À COMPARER</div>
            <div className="flex gap-2 flex-wrap">
              {suppliers.map(s => (
                <label key={s.id} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer text-xs font-black uppercase text-white hover:border-green-500/50 select-none">
                  <input type="checkbox" checked={selectedSuppIds.includes(s.id)} onChange={() => handleToggleSupplier(s.id)} className="rounded border-slate-700 text-green-600 focus:ring-green-500 bg-slate-900" />
                  {s.name}
                </label>
              ))}
              {suppliers.length === 0 && (
                <p className="text-slate-500 font-bold uppercase text-[10px]">Aucun fournisseur disponible. Veuillez en ajouter dans le menu.</p>
              )}
            </div>
          </div>

          <div className={cardCls}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-green-400">2. SAISIR LES ARTICLES À CONSULTER</div>
              <button onClick={addCompLine} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-black uppercase rounded-lg transition font-sans">
                <Plus className="w-3.5 h-3.5" /> AJOUTER LIGNE
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950 text-[10px] font-black uppercase text-slate-400">
                    <th className="px-3 py-2.5 text-left rounded-l-lg">DÉSIGNATION ARTICLE *</th>
                    <th className="px-3 py-2.5 text-left">RÉFÉRENCE</th>
                    <th className="px-3 py-2.5 text-center">QTÉ</th>
                    <th className="px-3 py-2.5 text-center rounded-r-lg">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {compItems.map((it, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="px-2 py-2">
                        <input type="text" value={it.designation} onChange={e => updateCompItem(i, 'designation', e.target.value)} className="w-full bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none uppercase min-w-[160px]" placeholder="DÉSIGNATION ARTICLE" />
                      </td>
                      <td className="px-2 py-2">
                        <input type="text" value={it.reference} onChange={e => updateCompItem(i, 'reference', e.target.value)} className="w-full bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none uppercase min-w-[90px]" placeholder="RÉF." />
                      </td>
                      <td className="px-2 py-2">
                        <input type="number" value={it.quantity} min={1} onChange={e => updateCompItem(i, 'quantity', parseInt(e.target.value) || 1)} className="w-14 bg-white text-black font-bold text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none text-center" />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => removeCompLine(i)} className="text-slate-500 hover:text-red-400 p-1 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedSuppIds.length > 0 && compItems.some(it => it.designation) && (
            <div className={cardCls}>
              <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-4 border-b border-slate-800 pb-2">3. TABLEAU COMPARATIF DES OFFRES</div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-[10px] font-black uppercase text-slate-500 border-b border-slate-855">
                      <th className="px-4 py-3">ARTICLE</th>
                      {selectedSuppIds.map(id => {
                        const s = suppliers.find(x => x.id === id);
                        return <th key={id} className="px-4 py-3 text-center text-white">{s?.name.toUpperCase()}</th>;
                      })}
                      <th className="px-4 py-3 text-right text-green-450">MEILLEURE OFFRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compItems.map((it, idx) => {
                      if (!it.designation) return null;
                      const { minPrice, bestSuppId } = getLowestPriceInfo(idx);
                      return (
                        <tr key={idx} className="border-b border-slate-850 hover:bg-slate-950/10">
                          <td className="px-4 py-3">
                            <span className="font-bold text-white uppercase">{it.designation}</span>
                            {it.reference && <span className="block text-[10px] text-slate-400">REF: {it.reference.toUpperCase()}</span>}
                          </td>
                          {selectedSuppIds.map(id => {
                            const val = compPrices[id]?.[idx] || '';
                            const isCheapest = bestSuppId === id && minPrice !== null;
                            return (
                              <td key={id} className={`px-4 py-3 text-center transition ${isCheapest ? 'bg-green-500/10' : ''}`}>
                                <div className="flex items-center gap-1 justify-center">
                                  <input type="number" min={0} step={0.01} value={val} onChange={e => handlePriceChange(id, idx, parseFloat(e.target.value) || 0)} className="w-20 bg-white text-black font-bold text-center text-xs px-1.5 py-1 rounded border border-slate-350 focus:outline-none" placeholder="0.00" />
                                  <span className="text-[10px] text-slate-450 font-bold">DT</span>
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-right font-black text-green-400 text-sm">
                            {minPrice ? `${minPrice.toFixed(2)} TND` : '-'}
                            {minPrice && (
                              <span className="block text-[9px] text-slate-450 uppercase font-sans">
                                PAR: {suppliers.find(x => x.id === bestSuppId)?.name}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Ligne Totaux par Fournisseur */}
                    <tr className="bg-slate-950/60 font-black border-t border-slate-800">
                      <td className="px-4 py-3.5 text-slate-400 uppercase text-[10px]">TOTAL DE LA CONSULTATION</td>
                      {selectedSuppIds.map(id => {
                        const total = compItems.reduce((sum, it, idx) => {
                          const price = compPrices[id]?.[idx] || 0;
                          return sum + (it.quantity * price);
                        }, 0);
                        return (
                          <td key={id} className="px-4 py-3.5 text-center text-sm text-cyan-400">
                            {total.toFixed(2)} TND
                            <button onClick={() => handleGeneratePOFromComparison(id)} className="block mx-auto mt-2 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[8px] uppercase tracking-wide transition font-black">
                              Commander chez lui
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3.5 text-right text-slate-500">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTION: GESTION STOCK ET ARTICLES ─────────────────────────────────────
function SectionGestionArticles() {
  const { adminSection } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulaire manuel
  const [form, setForm] = useState({
    reference: '',
    name: '',
    brand: '',
    vehicleCompat: '',
    costPrice: 0,
    price: 0,
    stock: 0,
    description: ''
  });

  // Mode Édition
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products').then(r => r.json()).then(d => {
      setProducts(Array.isArray(d) ? d : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [adminSection]);

  const handleManualSubmit = async () => {
    if (!form.reference.trim() || !form.name.trim()) {
      setError('LA RÉFÉRENCE ET LA DÉSIGNATION SONT REQUISES.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess('ARTICLE ENREGISTRÉ EN STOCK AVEC SUCCÈS !');
        setForm({
          reference: '',
          name: '',
          brand: '',
          vehicleCompat: '',
          costPrice: 0,
          price: 0,
          stock: 0,
          description: ''
        });
        fetchProducts();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        const err = await res.json();
        setError(err.error || 'Erreur lors de la création de l\'article.');
      }
    } catch (e) {
      setError('Une erreur réseau est survenue.');
    }
  };

  const handleEditSubmit = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/products/${editingProduct.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          reference: editingProduct.reference,
          brand: editingProduct.brand,
          vehicleCompat: editingProduct.vehicleCompat,
          stock: editingProduct.stock,
          costPrice: editingProduct.costPrice,
          price: editingProduct.price
        })
      });
      if (res.ok) {
        alert('ARTICLE MIS À JOUR AVEC SUCCÈS !');
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert('Erreur lors de la mise à jour.');
      }
    } catch (e) {
      alert('Erreur serveur.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('VOULEZ-VOUS VRAIMENT RETIRER CET ARTICLE DU STOCK ?')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch (e) {
      alert('Erreur serveur.');
    }
  };

  // Parsing CSV
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length <= 1) return;

      const headerLine = lines[0].split(/[;,]/).map(h => h.trim().toUpperCase().replace(/["]/g, ''));
      
      const refIdx = headerLine.findIndex(h => h.includes('REFERENCE') || h.includes('REF'));
      const desIdx = headerLine.findIndex(h => h.includes('DESIGNATION') || h.includes('NOM'));
      const qteIdx = headerLine.findIndex(h => h.includes('QTE') || h.includes('STOCK') || h.includes('QUANT'));
      const mrqIdx = headerLine.findIndex(h => h.includes('MARQUE') || h.includes('BRAND'));
      const vehIdx = headerLine.findIndex(h => h.includes('VEHICULE') || h.includes('COMPATIBILITE'));
      const coutIdx = headerLine.findIndex(h => h.includes('COUT') || h.includes('REVIENT') || h.includes('ACHAT'));
      const venteIdx = headerLine.findIndex(h => h.includes('VENTE') || h.includes('PRIX'));

      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const row = line.split(/[;,]/).map(c => c.trim().replace(/["]/g, ''));
        
        const reference = refIdx !== -1 && row[refIdx] ? row[refIdx] : '';
        const designation = desIdx !== -1 && row[desIdx] ? row[desIdx] : '';
        if (!reference || !designation) continue;

        parsed.push({
          reference,
          designation,
          stock: qteIdx !== -1 ? parseInt(row[qteIdx]) || 0 : 0,
          brand: mrqIdx !== -1 ? row[mrqIdx] : '',
          vehicleCompat: vehIdx !== -1 ? row[vehIdx] : '',
          costPrice: coutIdx !== -1 ? parseFloat(row[coutIdx]) || 0 : 0,
          sellingPrice: venteIdx !== -1 ? parseFloat(row[venteIdx]) || 0 : 0
        });
      }
      setCsvPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleLaunchImport = async () => {
    if (csvPreview.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: csvPreview })
      });
      if (res.ok) {
        alert(`✅ IMPORTATION DE ${csvPreview.length} ARTICLES RÉUSSIE AVEC SUCCÈS !`);
        setCsvPreview([]);
        setCsvFile(null);
        fetchProducts();
      } else {
        alert('Erreur lors de l\'importation des articles.');
      }
    } catch (e) {
      alert('Erreur de communication avec le serveur.');
    } finally {
      setImporting(false);
    }
  };

  const filtered = products.filter(p =>
    p.reference?.toLowerCase().includes(search.toLowerCase()) ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.vehicleCompat?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* ─── AJOUTER ARTICLE ─── */}
      {adminSection === 'ajouter-article' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" /> AJOUTER UN NOUVEL ARTICLE
          </h2>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">SÉLECTIONNEZ LE MODE D'ENTRÉE DES NOUVELLES PIÈCES</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire Saisie manuelle */}
            <div className={cardCls}>
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4 border-b border-slate-800 pb-2">SAISIE MANUELLE</div>
              
              {error && <p className="text-red-500 font-bold text-xs uppercase mb-3 font-mono">⚠️ {error}</p>}
              {success && <p className="text-green-400 font-bold text-xs uppercase mb-3 font-mono">✅ {success}</p>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>RÉFÉRENCE *</label>
                    <input type="text" className={inputCls} placeholder="EX: 432551-A" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelCls}>DÉSIGNATION ARTICLE *</label>
                    <input type="text" className={inputCls} placeholder="EX: FILTRE À HUILE" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>MARQUE</label>
                    <input type="text" className={inputCls} placeholder="EX: BOSCH" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelCls}>VÉHICULES CONCERNÉS</label>
                    <input type="text" className={inputCls} placeholder="EX: PEUGEOT 208, CITROEN C3" value={form.vehicleCompat} onChange={e => setForm({...form, vehicleCompat: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>QTÉ EN STOCK</label>
                    <input type="number" className={inputCls} placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className={labelCls}>COÛT DE REVIENT (HT)</label>
                    <input type="number" className={inputCls} placeholder="0.00" value={form.costPrice} onChange={e => setForm({...form, costPrice: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className={labelCls}>PRIX DE VENTE (HT)</label>
                    <input type="number" className={inputCls} placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>

                <button onClick={handleManualSubmit} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-cyan-600/20">
                  💾 ENREGISTRER L'ARTICLE
                </button>
              </div>
            </div>

            {/* Importation Excel / CSV */}
            <div className={cardCls}>
              <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-4 border-b border-slate-800 pb-2">IMPORTER DEPUIS UN FICHIER EXCEL (CSV)</div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed uppercase">
                IMPORTEZ DES CENTAINES DE PIÈCES D'UN SEUL COUP. LE FICHIER CSV DOIT EN TÊTE DES COLONNES COMPORTER :<br />
                <code className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] text-cyan-400 font-mono tracking-normal block mt-2 text-center uppercase">REFERENCE | DESIGNATION | QTE | MARQUE | VEHICULES CONCERNEES | COUT REVIENT | PRIX VENTE</code>
              </p>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-cyan-500/50 transition">
                  <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" id="csv-file-upload" />
                  <label htmlFor="csv-file-upload" className="cursor-pointer block">
                    <Package className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                    <div className="text-xs font-black text-slate-300 uppercase">SÉLECTIONNER UN FICHIER CSV</div>
                    <div className="text-[9px] text-slate-555 mt-1 uppercase">CLIQUEZ POUR CHOISIR UN FICHIER DE VOTRE ETAT DES PIÈCES</div>
                  </label>
                </div>

                {csvFile && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 font-mono">{csvFile.name} ({csvPreview.length} articles reconnus)</span>
                    <button onClick={() => { setCsvFile(null); setCsvPreview([]); }} className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase">ANNULER</button>
                  </div>
                )}

                {csvPreview.length > 0 && (
                  <button onClick={handleLaunchImport} disabled={importing} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-green-600/20 disabled:opacity-50 font-sans">
                    {importing ? 'IMPORTATION EN COURS...' : `🚀 CONFIRMER L'IMPORTATION DE ${csvPreview.length} PIÈCES`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LISTE DES ARTICLES ─── */}
      {(adminSection === 'liste-articles' || adminSection === 'modifier-article') && (
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" /> GESTION DU STOCK DE PIÈCES
          </h2>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">RECHERCHEZ, MODIFIEZ ET SUPPRIMEZ LES ARTICLES DU STOCK DE PIÈCES</p>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="RECHERCHER DANS LES ARTICLES (RÉF, NOM, MARQUE, VÉHICULE)..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white text-black font-semibold pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:border-red-500 uppercase placeholder:normal-case placeholder:font-normal" />
            </div>
          </div>

          {editingProduct && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-left relative">
                <button onClick={() => setEditingProduct(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950/60 border border-slate-800 transition">
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-base font-black text-white mb-4 uppercase tracking-widest text-cyan-400">ÉDITER LA PIÈCE</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>DÉSIGNATION DE LA PIÈCE</label>
                    <input type="text" className={inputCls} value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>RÉFÉRENCE *</label>
                      <input type="text" className={inputCls} value={editingProduct.reference || ''} onChange={e => setEditingProduct({...editingProduct, reference: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>MARQUE</label>
                      <input type="text" className={inputCls} value={editingProduct.brand || ''} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>VÉHICULES COMPATIBLES</label>
                    <input type="text" className={inputCls} value={editingProduct.vehicleCompat || ''} onChange={e => setEditingProduct({...editingProduct, vehicleCompat: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>STOCK EN COURS</label>
                      <input type="number" className={inputCls} value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className={labelCls}>PRIX REVIENT</label>
                      <input type="number" className={inputCls} value={editingProduct.costPrice || editingProduct.oldPrice || 0} onChange={e => setEditingProduct({...editingProduct, costPrice: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className={labelCls}>PRIX VENTE</label>
                      <input type="number" className={inputCls} value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setEditingProduct(null)} className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase">ANNULER</button>
                    <button onClick={handleEditSubmit} className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-black uppercase">ENREGISTRER MODIFICATIONS</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 text-slate-500 font-bold uppercase">CHARGEMENT DES PIÈCES DU STOCK...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-650 font-bold uppercase">AUCUN ARTICLE TROUVÉ</div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-950 text-[10px] font-black uppercase text-slate-500 border-b border-slate-800">
                      <th className="px-4 py-3">RÉFÉRENCE</th>
                      <th className="px-4 py-3">DÉSIGNATION</th>
                      <th className="px-4 py-3">MARQUE</th>
                      <th className="px-4 py-3">VÉHICULES</th>
                      <th className="px-4 py-3 text-center">QUANTITÉ STOCK</th>
                      <th className="px-4 py-3 text-right text-red-400">P. REVIENT (HT)</th>
                      <th className="px-4 py-3 text-right text-green-400">P. VENTE (HT)</th>
                      <th className="px-4 py-3 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-b border-slate-850 hover:bg-slate-950/20 transition">
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-300">{p.reference}</td>
                        <td className="px-4 py-2.5 font-bold text-white uppercase">{p.name}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-400 uppercase">{p.brand || '-'}</td>
                        <td className="px-4 py-2.5 text-slate-400 uppercase">{p.vehicleCompat || '-'}</td>
                        <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-300">{p.stock}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-red-450/90">{(p.costPrice || p.oldPrice || 0).toFixed(2)} TND</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-green-400">{p.price.toFixed(2)} TND</td>
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button onClick={() => setEditingProduct(p)} className="p-1.5 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg border border-cyan-500/10 transition">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(p.slug)} className="p-1.5 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg border border-red-500/10 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTION: SUIVI DES BONS DE COMMANDE ET LIVRAISONS ───────────────────────
function SectionBonsEtLivraisons() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // États d'édition des statuts & notes
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders').then(r => r.json()).then(d => {
      if (d && d.success) {
        setOrders(d.data || []);
        const newStatuses: Record<string, string> = {};
        const newNotes: Record<string, string> = {};
        d.data?.forEach((o: any) => {
          newStatuses[o.id] = o.status;
          newNotes[o.id] = o.customerNote || '';
        });
        setStatusMap(newStatuses);
        setNoteMap(newNotes);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: statusMap[orderId],
          trackingNote: noteMap[orderId]
        })
      });
      const d = await res.json();
      if (d.success) {
        alert('✅ STATUT DE LIVRAISON MIS À JOUR AVEC SUCCÈS !');
        fetchOrders();
      } else {
        alert('Erreur: ' + d.error);
      }
    } catch (e) {
      alert('Erreur serveur lors de la mise à jour.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-purple-400" /> BONS DE COMMANDE & LIVRAISONS
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">MISES À JOUR DES STATUTS DE PRÉPARATION ET DE LIVRAISON CLIENTS</p>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="RECHERCHER PAR N° COMMANDE, NOM CLIENT, EMAIL..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white text-black font-semibold pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:border-red-500 uppercase placeholder:normal-case placeholder:font-normal" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500 font-bold uppercase">CHARGEMENT DES BONS DE COMMANDE...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-600 font-bold uppercase">AUCUNE COMMANDE TROUVÉE</div>
      ) : (
        filtered.map(o => (
          <div key={o.id} className={cardCls}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-800/40">
              <div>
                <span className="font-mono text-green-400 font-black text-sm uppercase">#{o.orderNumber}</span>
                <h4 className="font-black text-white uppercase text-sm mt-0.5">{o.user?.name || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'CLIENT'}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{o.user?.email} · CRÉÉ LE: {new Date(o.createdAt).toLocaleDateString('fr-FR')}</p>
                {o.shippingAddress && <p className="text-[10px] text-cyan-400 mt-1 uppercase font-bold">📍 ADRESSE: {o.shippingAddress}</p>}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">MONTANT TOTAL TTC</span>
                <span className="font-black text-white text-base font-mono">{o.total.toFixed(2)} TND</span>
              </div>
            </div>

            {/* Articles list */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 mb-4 text-xs">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">ARTICLES DU BON DE COMMANDE :</span>
              {o.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-800/20 pb-1.5 last:border-0 last:pb-0 mb-1.5 last:mb-0">
                  <span className="text-slate-350 uppercase font-bold">{item.productName}</span>
                  <span className="font-black text-slate-400 font-mono">x{item.quantity} | {item.price.toFixed(2)} TND</span>
                </div>
              ))}
            </div>

            {/* Formulaire statut préparé par admin */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className={labelCls}>STATUT DE LIVRAISON</label>
                <select 
                  value={statusMap[o.id] || o.status}
                  onChange={e => setStatusMap({...statusMap, [o.id]: e.target.value})}
                  className="w-full bg-white text-black font-black text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 uppercase"
                >
                  <option value="PENDING">EN ATTENTE DE VALIDATION</option>
                  <option value="CONFIRMED">CONFIRMÉE / EN PRÉPARATION</option>
                  <option value="SHIPPED">EXPÉDIÉE / EN COURS DE LIVRAISON</option>
                  <option value="DELIVERED">LIVRÉE</option>
                  <option value="CANCELLED">ANNULÉE</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>NOTE DE SUIVI POUR LE CLIENT</label>
                <input 
                  type="text" 
                  value={noteMap[o.id] || ''}
                  onChange={e => setNoteMap({...noteMap, [o.id]: e.target.value})}
                  placeholder="Ex: COMMANDE PRÊTE AU COMPTOIR / COLIS EN ROUTE" 
                  className="w-full bg-white text-black font-semibold text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 uppercase"
                />
              </div>
              <div>
                <button 
                  onClick={() => handleUpdateStatus(o.id)}
                  disabled={updatingId === o.id}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow shadow-purple-650/20 disabled:opacity-50 font-sans"
                >
                  {updatingId === o.id ? 'MISE À JOUR...' : 'METTRE À JOUR LE STATUT'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── SECTION: TABLEAU DE BORD ─────────────────────────────────────────────────
function SectionTableauBord() {
  const [stats, setStats] = useState({ quotes: 0, orders: 0, suppliers: 0, products: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/quotes').then(r => r.json()),
      fetch('/api/orders?limit=1').then(r => r.json()),
      fetch('/api/suppliers').then(r => r.json()),
      fetch('/api/products?limit=1').then(r => r.json()),
    ]).then(([q, o, s, p]) => {
      setStats({
        quotes: Array.isArray(q) ? q.length : 0,
        orders: o.pagination?.total || 0,
        suppliers: s.data?.length || 0,
        products: p.pagination?.total || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'DEMANDES EN ATTENTE', value: stats.quotes, color: 'from-red-600 to-red-400', icon: FileText },
    { label: 'BONS DE COMMANDE', value: stats.orders, color: 'from-blue-600 to-blue-400', icon: ShoppingBag },
    { label: 'FOURNISSEURS', value: stats.suppliers, color: 'from-green-600 to-green-400', icon: Building2 },
    { label: 'ARTICLES EN STOCK', value: stats.products, color: 'from-amber-600 to-amber-400', icon: Package },
  ];

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-pink-400" /> TABLEAU DE BORD
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">VUE D'ENSEMBLE DE VOTRE ACTIVITÉ</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 text-white shadow-lg`}>
              <Icon className="w-6 h-6 mb-3 opacity-80" />
              <div className="text-4xl font-black mb-1">{c.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{c.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminContent() {
  const { adminSection, setAdminSection } = useApp();
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const sectionMap: Record<string, React.ReactNode> = {
    'reception': <SectionReception onTreatQuote={(q) => { setSelectedQuote(q); setAdminSection('creer-devis'); }} />,
    'traitement': <SectionReception onTreatQuote={(q) => { setSelectedQuote(q); setAdminSection('creer-devis'); }} />,
    'devis-gen': <SectionCreerDevis quoteToLoad={selectedQuote} onClearQuote={() => setSelectedQuote(null)} />,
    'bons': <SectionBonsEtLivraisons />,
    'creer-devis': <SectionCreerDevis quoteToLoad={selectedQuote} onClearQuote={() => setSelectedQuote(null)} />,
    'generer-pdf': <SectionCreerDevis quoteToLoad={selectedQuote} onClearQuote={() => setSelectedQuote(null)} />,
    'envoi': <SectionCreerDevis quoteToLoad={selectedQuote} onClearQuote={() => setSelectedQuote(null)} />,
    'ajouter-fournisseur': <SectionAjouterFournisseur />,
    'liste-fournisseurs': <SectionListeFournisseurs />,
    'consultation-fournisseur': <SectionConsultationFournisseur />,
    'recherche-four': <SectionConsultationFournisseur />,
    'comparatif': <SectionConsultationFournisseur />,
    'ajouter-article': <SectionGestionArticles />,
    'modifier-article': <SectionGestionArticles />,
    'liste-articles': <SectionGestionArticles />,
    'tableau-bord': <SectionTableauBord />,
    'chiffre': <SectionTableauBord />,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 overflow-y-auto min-h-screen">
      {sectionMap[adminSection] || <SectionReception onTreatQuote={(q) => { setSelectedQuote(q); setAdminSection('creer-devis'); }} />}
    </div>
  );
}
