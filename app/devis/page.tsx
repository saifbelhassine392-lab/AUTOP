'use client';

import { useState } from 'react';
import { Download, CheckCircle, MessageCircle, FileText, Plus, FileSpreadsheet } from 'lucide-react';

export default function DevisPage() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [vin, setVin] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  
  const [items, setItems] = useState([{ reference: '', designation: '', quantity: 1 }]);

  const handleAddItem = () => {
    setItems([...items, { reference: '', designation: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Convertisseur PDF en Base64
  const getPDFBase64 = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("fr-FR");

    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("AUTOP TUNISIE", 20, 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("COMPTOIR DE DISTRIBUTION DE PIÈCES DE RECHANGE - TUNIS", 20, 31);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Date : ${dateStr}`, 140, 20);

    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text("DEMANDE DE DEVIS CLIENT", 20, 55);
    
    autoTable(doc, {
      startY: 65,
      head: [["Information", "Détail"]],
      body: [
        ["Nom du Client", clientName || "Non renseigné"],
        ["Email du Client", clientEmail || "Non renseigné"],
        ["Véhicule", `${brand} ${model}`.trim() || "Non renseigné"],
        ["Numéro VIN (Châssis)", vin || "Non renseigné"],
        ["Remarques / Infos", remarks || "Aucune"],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text("LISTE DES PIÈCES DEMANDÉES", 20, finalY + 15);

    autoTable(doc, {
      startY: finalY + 22,
      head: [["N°", "Référence", "Désignation", "Quantité"]],
      body: items.map((item, idx) => [
        (idx + 1).toString(),
        item.reference || "Générique / Autre",
        item.designation,
        item.quantity.toString()
      ]),
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] },
    });

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 280, 210, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("AUTOP - Pieces Auto Charguia 2 - Tunis | Tel: +216 98 774 525 | Email: comptoir.distribution@autop.tn", 30, 290);

    const dataUri = doc.output('datauristring');
    return dataUri.split(',')[1];
  };

  // Convertisseur Excel/CSV en Base64
  const getExcelBase64 = () => {
    const csvContent = [
      ["Information", "Detail"],
      ["Nom du Client", clientName],
      ["Email du Client", clientEmail],
      ["Vehicule", `${brand} ${model}`],
      ["Numero VIN", vin || "N/A"],
      ["Remarques", remarks || "N/A"],
      [],
      ["Index", "Reference", "Designation", "Quantite"],
      ...items.map((item, idx) => [
        (idx + 1).toString(),
        item.reference || "Generique",
        item.designation,
        item.quantity.toString()
      ])
    ]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const bomCsv = "\uFEFF" + csvContent;
    return btoa(unescape(encodeURIComponent(bomCsv)));
  };

  // Téléchargement Local PDF
  const downloadPDF = async (quoteId: string) => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("fr-FR");
    const ref = `DEVIS-${quoteId.slice(-6).toUpperCase()}`;

    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("AUTOP TUNISIE", 20, 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("COMPTOIR DE DISTRIBUTION DE PIÈCES DE RECHANGE - TUNIS", 20, 31);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Référence : ${ref}`, 140, 20);
    doc.text(`Date : ${dateStr}`, 140, 26);

    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text("DEMANDE DE DEVIS CLIENT", 20, 55);
    
    autoTable(doc, {
      startY: 65,
      head: [["Information", "Détail"]],
      body: [
        ["Nom du Client", clientName || "Non renseigné"],
        ["Email du Client", clientEmail || "Non renseigné"],
        ["Véhicule", `${brand} ${model}`.trim() || "Non renseigné"],
        ["Numéro VIN (Châssis)", vin || "Non renseigné"],
        ["Remarques / Infos", remarks || "Aucune"],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text("LISTE DES PIÈCES DEMANDÉES", 20, finalY + 15);

    autoTable(doc, {
      startY: finalY + 22,
      head: [["N°", "Référence", "Désignation", "Quantité"]],
      body: items.map((item, idx) => [
        (idx + 1).toString(),
        item.reference || "Générique / Autre",
        item.designation,
        item.quantity.toString()
      ]),
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] },
    });

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 280, 210, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("AUTOP - Pieces Auto Charguia 2 - Tunis | Tel: +216 98 774 525 | Email: comptoir.distribution@autop.tn", 30, 290);

    doc.save(`Demande_Devis_AUTOP_${ref}.pdf`);
  };

  // Téléchargement Local Excel
  const downloadExcel = (quoteId: string) => {
    const ref = quoteId.slice(-6).toUpperCase();
    const csvContent = [
      ["Information", "Detail"],
      ["Nom du Client", clientName],
      ["Email du Client", clientEmail],
      ["Vehicule", `${brand} ${model}`],
      ["Numero VIN", vin || "N/A"],
      ["Remarques", remarks || "N/A"],
      [],
      ["Index", "Reference", "Designation", "Quantite"],
      ...items.map((item, idx) => [
        (idx + 1).toString(),
        item.reference || "Generique",
        item.designation,
        item.quantity.toString()
      ])
    ]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Demande_Devis_AUTOP_#${ref}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = (phoneNumber: string, quoteId: string) => {
    // Télécharge automatiquement le format choisi en local
    if (selectedFormat === 'pdf') {
      downloadPDF(quoteId);
    } else {
      downloadExcel(quoteId);
    }

    const text = `🚗 *NOUVELLE DEMANDE DE DEVIS - AUTOP TUNISIE*
🆔 *Référence:* #DEVIS-${quoteId.slice(-6).toUpperCase()}
👤 *Client:* ${clientName} (${clientEmail})
🚙 *Véhicule:* ${brand} ${model}
🆔 *VIN (Châssis):* ${vin || 'Non renseigné'}
📝 *Remarques:* ${remarks || 'Aucune'}

📎 _Le document de devis au format ${selectedFormat.toUpperCase()} a été téléchargé sur votre appareil. Veuillez le joindre à cette discussion._`;

    window.open(`https://wa.me/216${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleConfirmAndSubmit = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      alert("Veuillez remplir le nom et l'email du client.");
      return;
    }

    setIsSubmitting(true);

    try {
      let fileBase64 = '';
      let fileName = '';

      if (selectedFormat === 'pdf') {
        fileBase64 = await getPDFBase64();
        fileName = `Devis_AUTOP_${Date.now()}.pdf`;
      } else {
        fileBase64 = getExcelBase64();
        fileName = `Devis_AUTOP_${Date.now()}.csv`;
      }

      const payload = {
        clientName,
        clientEmail,
        brand,
        model,
        vin,
        remarks,
        photo: photoBase64,
        photoName: photoName,
        items: items.map(i => ({ 
          reference: i.reference, 
          designation: i.designation, 
          quantity: Number(i.quantity) 
        })),
        fileBase64,
        fileFormat: selectedFormat === 'pdf' ? 'pdf' : 'csv',
        fileName
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      setSubmittedQuoteId(data.id);

    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setClientName('');
    setClientEmail('');
    setBrand('');
    setModel('');
    setVin('');
    setRemarks('');
    setItems([{ reference: '', designation: '', quantity: 1 }]);
    setPhotoBase64(null);
    setPhotoName('');
    setSubmittedQuoteId(null);
  };

  if (submittedQuoteId) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-[#0a0e1a] min-h-screen text-slate-100 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-white mb-2">Demande Confirmée !</h2>
          <p className="text-sm text-slate-400 mb-6">
            Votre demande a été enregistrée. L'e-mail a été envoyé avec le fichier **{selectedFormat.toUpperCase()}** joint au client et à notre comptoir (**comptoir.distribution@autop.tn**).
          </p>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => downloadPDF(submittedQuoteId)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              Télécharger le devis en format PDF
            </button>

            <button
              onClick={() => downloadExcel(submittedQuoteId)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Télécharger le devis en format Excel (.csv)
            </button>

            <button
              onClick={() => handleWhatsAppShare('98774525', submittedQuoteId)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Envoyer par WhatsApp (Comptoir 98 774 525)
            </button>

            <button
              onClick={() => handleWhatsAppShare('95576525', submittedQuoteId)}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Envoyer par WhatsApp (Comptoir 95 576 525)
            </button>
          </div>

          <button
            onClick={handleResetForm}
            className="text-xs text-slate-400 hover:text-white font-semibold transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <Plus className="w-3 h-3" />
            Faire une autre demande de devis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0e1a] min-h-screen text-slate-100">
      <h1 className="text-3xl font-black mb-8 tracking-tight text-white border-b border-slate-800 pb-4">
        Formulaire de Devis
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 mb-1">NOM COMPLET *</label>
          <input 
            type="text" 
            placeholder="Nom complet" 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 mb-1">EMAIL DU CLIENT *</label>
          <input 
            type="email" 
            placeholder="votre@email.com" 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500" 
            value={clientEmail} 
            onChange={(e) => setClientEmail(e.target.value)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 mb-1">MARQUE DU VÉHICULE</label>
          <input 
            type="text" 
            placeholder="Ex: Peugeot, Renault..." 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500" 
            value={brand} 
            onChange={(e) => setBrand(e.target.value)} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-400 mb-1">MODÈLE DU VÉHICULE</label>
          <input 
            type="text" 
            placeholder="Ex: 308, Clio..." 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500" 
            value={model} 
            onChange={(e) => setModel(e.target.value)} 
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs font-semibold text-slate-400 mb-1">NUMÉRO VIN (CHÂSSIS) - CONSEILLÉ</label>
          <input 
            type="text" 
            placeholder="Numéro VIN (17 caractères)" 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 font-mono tracking-wider" 
            value={vin} 
            onChange={(e) => setVin(e.target.value)} 
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs font-semibold text-slate-400 mb-1">REMARQUES ET INFORMATIONS COMPLÉMENTAIRES</label>
          <textarea 
            placeholder="Précisez ici toute information utile (motorisation, année de mise en circulation, etc.)..." 
            rows={3} 
            className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 resize-none" 
            value={remarks} 
            onChange={(e) => setRemarks(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex flex-col mb-6 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
        <label className="text-xs font-semibold text-slate-400 mb-2">FORMAT DE PIÈCE JOINTE REQUIS *</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input 
              type="radio" 
              name="docFormat" 
              checked={selectedFormat === 'pdf'} 
              onChange={() => setSelectedFormat('pdf')} 
              className="text-red-500 focus:ring-red-500" 
            />
            Document PDF (.pdf)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input 
              type="radio" 
              name="docFormat" 
              checked={selectedFormat === 'excel'} 
              onChange={() => setSelectedFormat('excel')} 
              className="text-red-500 focus:ring-red-500" 
            />
            Feuille de calcul Excel (.csv)
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 mb-2">LISTE DES PIÈCES DEMANDÉES</label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                placeholder="Réf" 
                className="w-1/3 bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 font-mono text-sm" 
                value={item.reference} 
                onChange={(e) => handleItemChange(idx, 'reference', e.target.value)} 
              />
              <input 
                placeholder="Désignation (ex: Plaquettes de frein...)" 
                className="flex-1 bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 text-sm" 
                value={item.designation} 
                onChange={(e) => handleItemChange(idx, 'designation', e.target.value)} 
              />
              <input 
                type="number" 
                min={1} 
                className="w-16 bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 text-center font-bold text-sm" 
                value={item.quantity} 
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} 
              />
              <button 
                onClick={() => handleRemoveItem(idx)} 
                className="text-red-500 hover:text-red-400 p-2 font-bold transition-colors"
                title="Supprimer la ligne"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={handleAddItem} 
          className="text-xs text-red-500 hover:text-red-400 font-bold mt-3 inline-block transition-colors"
        >
          ➕ Ajouter une autre pièce
        </button>
      </div>

      <div className="flex flex-col mb-8 bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
        <label className="text-xs font-semibold text-slate-400 mb-2">PHOTOS DU VÉHICULE OU DE LA PIÈCE (OPTIONNEL)</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="text-slate-400 text-xs file:bg-slate-800 file:text-slate-100 file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 file:hover:bg-slate-700 file:cursor-pointer" 
        />
        {photoName && <span className="text-xs text-green-400 mt-2">Fichier prêt : {photoName}</span>}
      </div>

      <button 
        disabled={isSubmitting}
        onClick={handleConfirmAndSubmit}
        className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold transition-all disabled:bg-red-800 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        {isSubmitting ? 'Enregistrement...' : 'CONFIRMER ET ENVOYER LA DEMANDE'}
      </button>
    </div>
  );
}