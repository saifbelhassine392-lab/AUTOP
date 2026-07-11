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
function SectionReception() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotes').then(r => r.json()).then(d => {
      setQuotes(Array.isArray(d) ? d : d.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = quotes.filter(q =>
    q.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    q.brand?.toLowerCase().includes(search.toLowerCase()) ||
    q.id?.includes(search)
  );

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
        <select className="bg-white text-black font-bold text-xs px-3 rounded-xl border border-slate-300">
          <option>TOUS STATUTS</option>
          <option>EN ATTENTE</option>
          <option>TRAITÉ</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">CHARGEMENT...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-600">AUCUNE DEMANDE TROUVÉE</div>
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
              <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition">
                <Edit3 className="w-3.5 h-3.5" /> CRÉER DEVIS
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition border border-slate-700">
                <Phone className="w-3.5 h-3.5" /> CONTACTER
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition">
                <Mail className="w-3.5 h-3.5" /> ENVOYER EMAIL
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── SECTION: CRÉER / MODIFIER DEVIS ─────────────────────────────────────────
function SectionCreerDevis() {
  const { data: session } = useSession();
  const [items, setItems] = useState([
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

  const user = session?.user as any;

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
            <label className={labelCls}>EMAIL CLIENT</label>
            <input type="email" className="w-full bg-white text-black font-semibold text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 placeholder:text-slate-400" placeholder="email@client.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
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

        {/* Mention admin */}
        {session && (
          <div className="bg-slate-950 rounded-lg p-3 text-xs text-slate-400 border border-slate-800 mb-4">
            <span className="font-black uppercase">PRÉPARÉ PAR :</span> {(session.user as any)?.name?.toUpperCase()} · TÉL: {(session.user as any)?.phone || 'N/A'}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-xs font-black uppercase mb-3">
            <CheckCircle className="w-4 h-4" /> DEVIS ENREGISTRÉ AVEC SUCCÈS
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase border border-slate-700 transition">
            <Printer className="w-3.5 h-3.5" /> IMPRIMER / PDF
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase transition">
            <Mail className="w-3.5 h-3.5" /> ENVOYER CLIENT
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase transition">
            <Save className="w-3.5 h-3.5" /> ENREGISTRER DEVIS
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
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([{ reference: '', designation: '', quantity: 1, unitPrice: 0 }]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedOrder, setSavedOrder] = useState<any>(null);

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

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-green-400" /> CONSULTATION FOURNISSEUR
      </h2>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-5">CRÉEZ UN BON DE COMMANDE FOURNISSEUR MODIFIABLE</p>

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
              {supplier.phone && <p className="text-slate-400 uppercase">TÉL: {supplier.phone}</p>}
              {supplier.email && <p className="text-slate-400">{supplier.email}</p>}
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
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-black uppercase border border-slate-700 transition">
          <Printer className="w-3.5 h-3.5" /> IMPRIMER BON DE COMMANDE
        </button>
        <button onClick={handleCreateOrder} disabled={saving}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[11px] font-black uppercase transition disabled:opacity-50">
          <Save className="w-3.5 h-3.5" /> {saving ? 'CRÉATION...' : 'CRÉER & ENREGISTRER BON DE COMMANDE'}
        </button>
      </div>
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
  const { adminSection } = useApp();

  const sectionMap: Record<string, React.ReactNode> = {
    'reception': <SectionReception />,
    'traitement': <SectionReception />,
    'devis-gen': <SectionCreerDevis />,
    'bons': <SectionReception />,
    'creer-devis': <SectionCreerDevis />,
    'generer-pdf': <SectionCreerDevis />,
    'envoi': <SectionCreerDevis />,
    'ajouter-fournisseur': <SectionAjouterFournisseur />,
    'liste-fournisseurs': <SectionListeFournisseurs />,
    'consultation-fournisseur': <SectionConsultationFournisseur />,
    'recherche-four': <SectionConsultationFournisseur />,
    'comparatif': <SectionConsultationFournisseur />,
    'ajouter-article': <SectionTableauBord />,
    'modifier-article': <SectionTableauBord />,
    'liste-articles': <SectionTableauBord />,
    'tableau-bord': <SectionTableauBord />,
    'chiffre': <SectionTableauBord />,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 overflow-y-auto min-h-screen">
      {sectionMap[adminSection] || <SectionReception />}
    </div>
  );
}
