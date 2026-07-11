"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { 
  Download, CheckCircle, MessageCircle, FileText, 
  Plus, FileSpreadsheet, ClipboardList, Package, Receipt 
} from 'lucide-react'

export default function MesDevisPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'devis' | 'commandes' | 'factures'>('devis')
  const [devis, setDevis] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // États pour le Bon de Commande
  const [orderModalDevis, setOrderModalDevis] = useState<any | null>(null)
  const [shippingAddress, setShippingAddress] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [orderFormat, setOrderFormat] = useState<'pdf' | 'excel'>('pdf')
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  const loadData = async () => {
    if (!session) return;
    try {
      setLoading(true);

      // 1. Charger les devis et demandes
      const devisRes = await fetch("/api/devis");
      const devisData = devisRes.ok ? await devisRes.json() : [];

      const quotesRes = await fetch("/api/quotes");
      const quotesData = quotesRes.ok ? await quotesRes.json() : [];

      const unifiedList = [
        ...(Array.isArray(devisData) ? devisData : []).map((d: any) => ({
          id: d.id,
          date: new Date(d.createdAt).toLocaleDateString('fr-FR'),
          brand: d.vehicleBrand || 'Générique',
          model: d.vehicleModel || 'N/A',
          vin: d.vehicleVin || '',
          remarks: d.notes || '',
          response: d.responseNote || '',
          status: d.status === 'completed' ? 'Traité' : d.status === 'rejected' ? 'Rejeté' : 'En attente',
          isTreated: d.status === 'completed' || d.totalPrice > 0,
          totalPrice: d.totalPrice || 0,
          items: (d.items || []).map((it: any) => ({
            id: it.id,
            productId: it.productId,
            name: it.name,
            price: it.price || 0,
            quantity: it.quantity || 1
          }))
        })),
        ...(Array.isArray(quotesData) ? quotesData : []).map((q: any) => ({
          id: q.id,
          date: new Date(q.createdAt).toLocaleDateString('fr-FR'),
          brand: q.brand || 'Générique',
          model: q.model || 'N/A',
          vin: q.vin || '',
          remarks: q.remarks || '',
          response: '',
          status: q.status === 'TREATED' ? 'Traité' : 'En attente',
          isTreated: q.status === 'TREATED',
          totalPrice: 0,
          items: (q.items || []).map((it: any) => ({
            id: it.id,
            productId: null,
            name: `${it.designation} (Réf: ${it.reference || 'N/A'})`,
            price: 0,
            quantity: it.quantity || 1
          }))
        }))
      ];
      unifiedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDevis(unifiedList);

      // 2. Charger les commandes réelles
      const ordersRes = await fetch("/api/orders");
      const ordersData = ordersRes.ok ? await ordersRes.json() : null;
      if (ordersData && ordersData.success) {
        setOrders(ordersData.data);
      }

    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [session, status]);

  // Convertisseur PDF Bon de Commande
  const getOrderPDFBase64 = async (d: any, orderNumber: string) => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("fr-FR");
    const ref = orderNumber;

    doc.setFillColor(16, 185, 129); // Vert Émeraude
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("AUTOP TUNISIE", 20, 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("BON DE COMMANDE DE PIÈCES DE RECHANGE - TUNIS", 20, 31);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Réf Commande : #${ref}`, 140, 20);
    doc.text(`Date : ${dateStr}`, 140, 26);

    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DU BON DE COMMANDE", 20, 55);
    
    autoTable(doc, {
      startY: 65,
      head: [["Information", "Détail"]],
      body: [
        ["Nom du Client", session?.user?.name || "Client Autop"],
        ["Email", session?.user?.email || ""],
        ["Véhicule", `${d.brand} ${d.model}`.trim()],
        ["Numéro VIN", d.vin || "Non renseigné"],
        ["Adresse de Livraison", shippingAddress || "À spécifier"],
        ["Note client", customerNote || "Aucune"],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text("ARTICLES DU BON DE COMMANDE", 20, finalY + 15);

    autoTable(doc, {
      startY: finalY + 22,
      head: [["N°", "Désignation / Article", "Quantité", "P.U. (TND)", "Total (TND)"]],
      body: d.items.map((item: any, idx: number) => [
        (idx + 1).toString(),
        item.name,
        item.quantity.toString(),
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2)
      ]),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 280, 210, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("AUTOP - Pieces Auto Charguia 2 - Tunis | Tel: +216 98 774 525 | Email: comptoir.distribution@autop.tn", 30, 290);

    const dataUri = doc.output('datauristring');
    return dataUri.split(',')[1];
  };

  // Convertisseur Excel/CSV Bon de Commande
  const getOrderExcelBase64 = (d: any) => {
    const csvContent = [
      ["BON DE COMMANDE AUTOP TUNISIE"],
      ["Nom du Client", session?.user?.name || ""],
      ["Email", session?.user?.email || ""],
      ["Vehicule", `${d.brand} ${d.model}`],
      ["VIN", d.vin || ""],
      ["Adresse de Livraison", shippingAddress],
      ["Note client", customerNote],
      [],
      ["Index", "Designation", "Quantite", "Prix Unitaire (TND)", "Total (TND)"],
      ...d.items.map((item: any, idx: number) => [
        (idx + 1).toString(),
        item.name,
        item.quantity.toString(),
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2)
      ])
    ]
      .map(row => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const bomCsv = "\uFEFF" + csvContent;
    return btoa(unescape(encodeURIComponent(bomCsv)));
  };

  // Soumettre le Bon de Commande
  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Veuillez renseigner une adresse de livraison.");
      return;
    }

    setIsSubmittingOrder(true);
    const d = orderModalDevis;
    const tempOrderNum = 'CMD-' + Date.now().toString().slice(-6).toUpperCase();

    try {
      let fileBase64 = '';
      let fileName = '';

      if (orderFormat === 'pdf') {
        fileBase64 = await getOrderPDFBase64(d, tempOrderNum);
        fileName = `Bon_Commande_AUTOP_${tempOrderNum}.pdf`;
      } else {
        fileBase64 = getOrderExcelBase64(d);
        fileName = `Bon_Commande_AUTOP_${tempOrderNum}.csv`;
      }

      const res = await fetch("/api/orders/from-devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devisId: d.id,
          selectedFormat: orderFormat,
          fileBase64,
          fileName,
          shippingAddress,
          customerNote
        })
      });

      if (!res.ok) throw new Error("Erreur lors de la validation");

      const resData = await res.json();
      alert("✅ Votre bon de commande a été validé ! E-mail envoyé au comptoir.");

      // WhatsApp share redirect
      const text = `🚗 *NOUVEAU BON DE COMMANDE - AUTOP TUNISIE*
🆔 *Commande:* #${tempOrderNum}
👤 *Client:* ${session?.user?.name || ''} (${session?.user?.email || ''})
🚙 *Véhicule:* ${d.brand} ${d.model}
📍 *Adresse:* ${shippingAddress}
📝 *Notes:* ${customerNote || 'Aucune'}

📎 _Le bon de commande au format ${orderFormat.toUpperCase()} a été téléchargé sur votre appareil. Veuillez le transmettre à notre équipe comptoir._`;

      // Télécharger localement
      if (orderFormat === 'pdf') {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        // Just trigger local download of the same file
        await getOrderPDFBase64(d, tempOrderNum); // generated
        doc.save(`Bon_Commande_${tempOrderNum}.pdf`);
      } else {
        const blob = new Blob(["\uFEFF" + atob(fileBase64)], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Bon_Commande_${tempOrderNum}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Ouvrir WhatsApp
      window.open(`https://wa.me/21698774525?text=${encodeURIComponent(text)}`, "_blank");

      // Reset
      setOrderModalDevis(null);
      setShippingAddress('');
      setCustomerNote('');
      loadData(); // Recharger les listes devis et commandes

    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la commande.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente de validation';
      case 'CONFIRMED': return 'Confirmée / En préparation';
      case 'SHIPPED': return 'Expédiée / En cours de livraison';
      case 'DELIVERED': return 'Livrée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Connexion Requise</h2>
          <p className="text-slate-400 mb-6">Veuillez vous connecter pour voir l'espace client.</p>
          <Link href="/connexion" className="bg-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-4 tracking-tight text-white border-b border-slate-800 pb-4">
          Espace Client AUTOP
        </h1>

        {/* Onglets */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: "devis", label: "Mes Devis", icon: ClipboardList },
            { id: "commandes", label: "Suivi Commandes & Livraison", icon: Package },
            { id: "factures", label: "Mes Factures", icon: Receipt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition
                ${activeTab === tab.id 
                  ? "bg-red-600 text-white" 
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODAL POUR CRÉATION DE BON DE COMMANDE */}
        {orderModalDevis && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full">
              <h3 className="text-xl font-black mb-4 text-white">Générer Bon de Commande</h3>
              <p className="text-xs text-slate-400 mb-6">
                Transformez votre Devis #{orderModalDevis.id.slice(-6).toUpperCase()} en un Bon de commande officiel.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">ADRESSE DE LIVRAISON *</label>
                  <input 
                    type="text" 
                    placeholder="Adresse complète (ex: Tunis, Charguia 2...)" 
                    className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-green-500 text-sm"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">NOTE POUR LE COMPTOIR</label>
                  <textarea 
                    placeholder="Instructions supplémentaires..." 
                    rows={2} 
                    className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-green-500 text-sm resize-none"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">FORMAT DE PIÈCE JOINTE REQUIS *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="radio" 
                        name="orderFormat" 
                        checked={orderFormat === 'pdf'} 
                        onChange={() => setOrderFormat('pdf')} 
                        className="text-green-500 focus:ring-green-500" 
                      />
                      Document PDF (.pdf)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="radio" 
                        name="orderFormat" 
                        checked={orderFormat === 'excel'} 
                        onChange={() => setOrderFormat('excel')} 
                        className="text-green-500 focus:ring-green-500" 
                      />
                      Excel (.csv)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setOrderModalDevis(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmittingOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-50"
                >
                  {isSubmittingOrder ? "Création..." : "🛒 Valider Commande"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB DEVIS */}
        {activeTab === 'devis' && (
          <div className="space-y-6">
            {devis.length === 0 && (
              <p className="text-slate-500 py-10 text-center">Aucune demande de devis.</p>
            )}

            {devis.map((d) => (
              <div key={d.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-red-500 font-mono text-sm">DEVIS #{d.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Véhicule : <strong className="text-slate-200">{d.brand} {d.model}</strong> 
                      {d.vin && <> (VIN: <code className="bg-slate-900 px-1 py-0.5 rounded text-[10px]">{d.vin}</code>)</>}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Soumis le : {d.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    d.isTreated 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : d.status === "Rejeté" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="space-y-2 mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Pièces demandées :</span>
                  {d.items?.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-200">{p.name}</span>
                      <span className="font-bold text-slate-400 text-xs font-mono">x{p.quantity}</span>
                    </div>
                  ))}
                </div>

                {d.isTreated && d.status !== 'Traité' && d.status !== 'completed' && (
                  <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-5 mt-5">
                    <h4 className="text-green-400 font-bold text-sm mb-2">Proposition Commerciale</h4>
                    <p className="text-xs text-slate-300 mb-4">{d.response || 'Votre devis est traité par notre comptoir.'}</p>
                    
                    <button
                      onClick={() => setOrderModalDevis(d)}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      🛒 Valider & Générer Bon de Commande
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB COMMANDES */}
        {activeTab === 'commandes' && (
          <div className="space-y-6">
            {orders.length === 0 && (
              <p className="text-slate-500 py-10 text-center">Aucune commande en cours.</p>
            )}

            {orders.map((o) => (
              <div key={o.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-green-400 font-mono text-sm">COMMANDE #{o.orderNumber}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Créée le : <strong className="text-slate-200">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</strong>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Montant Total TTC: <strong>{o.total.toFixed(2)} TND</strong></p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    o.status === 'DELIVERED' 
                      ? "bg-green-500/15 text-green-400 border-green-500/35"
                      : o.status === 'SHIPPED'
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/35"
                      : o.status === 'CANCELLED'
                      ? "bg-red-500/15 text-red-400 border-red-500/35"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/35"
                  }`}>
                    {getOrderStatusLabel(o.status)}
                  </span>
                </div>

                {/* Statut Livraison / Notes de l'admin */}
                <div className="mb-4 text-xs text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">Suivi de livraison (Admin) :</span>
                  <p>{o.customerNote || "En attente de prise en charge par l'administrateur."}</p>
                </div>

                <div className="space-y-2 mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Articles commandés :</span>
                  {o.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-200">{item.productName}</span>
                      <span className="font-bold text-slate-400 text-xs font-mono">x{item.quantity} | {item.price.toFixed(2)} TND</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB FACTURES */}
        {activeTab === 'factures' && (
          <div className="space-y-6">
            {orders.filter(o => o.status === 'DELIVERED').length === 0 && (
              <p className="text-slate-500 py-10 text-center">Aucune facture disponible. Les factures sont émises après livraison.</p>
            )}

            {orders.filter(o => o.status === 'DELIVERED').map((o) => (
              <div key={o.id} className="bg-slate-800/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-white font-mono text-sm">FACTURE #{o.orderNumber.replace('CMD', 'FAC')}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Date d'émission : <strong className="text-slate-300">{new Date(o.updatedAt).toLocaleDateString('fr-FR')}</strong>
                  </p>
                  <p className="text-xs text-slate-400">Montant réglé : <strong className="text-green-400 font-mono">{o.total.toFixed(2)} TND</strong></p>
                </div>
                
                <button
                  onClick={async () => {
                    const { jsPDF } = await import("jspdf");
                    const autoTable = (await import("jspdf-autotable")).default;
                    const doc = new jsPDF();
                    const ref = o.orderNumber.replace('CMD', 'FAC');

                    doc.setFillColor(30, 41, 59);
                    doc.rect(0, 0, 210, 40, "F");
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(24);
                    doc.text("AUTOP TUNISIE", 20, 24);
                    doc.setFontSize(10);
                    doc.text("FACTURE ACQUITTEE - TUNIS", 20, 31);
                    
                    doc.setTextColor(0, 0, 0);
                    doc.text(`Facture : #${ref}`, 140, 20);
                    doc.text(`Date : ${new Date(o.updatedAt).toLocaleDateString('fr-FR')}`, 140, 26);

                    autoTable(doc, {
                      startY: 65,
                      head: [["Information", "Détail"]],
                      body: [
                        ["Nom du Client", session?.user?.name || "Client Autop"],
                        ["Email", session?.user?.email || ""],
                        ["Commande originale", o.orderNumber],
                        ["Adresse de livraison", o.shippingAddress || "N/A"],
                      ],
                      theme: "striped",
                      headStyles: { fillColor: [30, 41, 59] },
                    });

                    autoTable(doc, {
                      startY: (doc as any).lastAutoTable?.finalY + 15,
                      head: [["Désignation", "Quantité", "P.U. (TND)", "Total (TND)"]],
                      body: o.items.map((it: any) => [
                        it.productName,
                        it.quantity.toString(),
                        it.price.toFixed(2),
                        it.total.toFixed(2)
                      ]),
                      theme: "grid",
                      headStyles: { fillColor: [30, 41, 59] },
                    });

                    doc.save(`Facture_AUTOP_${ref}.pdf`);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  <Download className="w-4 h-4" /> Télécharger Facture (PDF)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}