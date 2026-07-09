export interface Article {
  id: string;
  title: string;
  ref: string;
  vehicle: string;
  price: number;
  stock: 'in-stock' | 'order';
  icon: string;
  brand: string;
}

export interface Fournisseur {
  name: string;
  ref: string;
  subRef: string;
  brand: string;
  stock: string;
  price: number;
  icon: string;
}

export interface Demande {
  id: string;
  client: string;
  initials: string;
  phone: string;
  email: string;
  date: string;
  vehicle: string;
  vin: string;
  request: string;
  photos?: number;
  avatarColor: string;
}

export interface Order {
  id: string;
  title: string;
  vehicle: string;
  date: string;
  status: string;
  statusColor: string;
  timeline: { label: string; active: boolean }[];
}

export const articles: Article[] = [
  { id: '1', title: "Kit Embrayage", ref: "1611273080", vehicle: "Peugeot 308 / 3008", price: 210, stock: 'in-stock', icon: "🔧", brand: "ORIGINE" },
  { id: '2', title: "Disque Frein Avant", ref: "4246W7", vehicle: "Renault Clio 4", price: 85, stock: 'in-stock', icon: "🛑", brand: "BOSCH" },
  { id: '3', title: "Filtre a Huile", ref: "1109AY", vehicle: "Peugeot / Citroen", price: 12, stock: 'in-stock', icon: "🛢️", brand: "PURFLUX" },
  { id: '4', title: "Bougies Allumage", ref: "5960L5", vehicle: "Renault / Dacia", price: 45, stock: 'in-stock', icon: "⚡", brand: "BOSCH" },
  { id: '5', title: "Kit d'embrayage complet", ref: "1611273080", vehicle: "Peugeot 308 / 3008", price: 210, stock: 'in-stock', icon: "🔧", brand: "ORIGINE" },
  { id: '6', title: "Disque de frein avant", ref: "4246.W7", vehicle: "Renault Clio 4", price: 185, stock: 'in-stock', icon: "🛑", brand: "BOSCH" },
  { id: '7', title: "Amortisseur AR gaz", ref: "5202.HQ", vehicle: "Renault / Peugeot", price: 320, stock: 'order', icon: "🔧", brand: "MONROE" },
  { id: '8', title: "Pompe a eau + kit dist.", ref: "8200266947", vehicle: "Renault Clio 4", price: 445, stock: 'in-stock', icon: "💧", brand: "GATES" },
  { id: '9', title: "Bougies allumage (x4)", ref: "0242240655", vehicle: "Renault / Dacia", price: 95, stock: 'in-stock', icon: "⚡", brand: "BOSCH" },
  { id: '10', title: "Filtre a huile", ref: "1109AY", vehicle: "Peugeot / Citroen", price: 12, stock: 'in-stock', icon: "🛢️", brand: "PURFLUX" },
];

export const marques = [
  "Peugeot", "Renault", "Volkswagen", "Citroen", "Toyota",
  "Ford", "BMW", "Mercedes", "Audi", "Fiat", "Hyundai", "Kia"
];

export const modeles = [
  "308 (Peugeot)", "3008 (Peugeot)", "208 (Peugeot)",
  "Clio 4 (Renault)", "Clio 5 (Renault)", "Megane (Renault)",
  "Golf 7 (VW)", "Polo (VW)", "Tiguan (VW)",
  "C3 (Citroen)", "C4 (Citroen)", "Cactus (Citroen)",
  "Yaris (Toyota)", "Corolla (Toyota)", "RAV4 (Toyota)"
];

export const suggestions = [
  { title: "Kit embrayage", vehicle: "Peugeot 308 / 3008" },
  { title: "Disque de frein avant", vehicle: "Renault Clio 4" },
  { title: "Filtre a huile", vehicle: "Volkswagen Golf 7" },
  { title: "Amortisseur arriere", vehicle: "Peugeot 3008" },
  { title: "Pompe a eau", vehicle: "Renault Clio 4" },
];

export const fournisseurs: Fournisseur[] = [
  { name: "EUROPIECES TUNISIE", ref: "1611273080", subRef: "ORIGINE PSA", brand: "ORIGINE PSA", stock: "EN STOCK (15)", price: 210, icon: "🏭" },
  { name: "AUTO PIECES SFAX", ref: "1611273080-EQ", subRef: "EQUIVALENT", brand: "EQUIVALENT", stock: "SUR COMMANDE", price: 185, icon: "🏭" },
  { name: "PIECES AUTO PLUS", ref: "1611273080-VAL", subRef: "VALEO", brand: "VALEO", stock: "EN STOCK (8)", price: 241, icon: "🏭" },
];

export const demandes: Demande[] = [
  {
    id: "D-2026-001",
    client: "Mohamed Ben Ali",
    initials: "MB",
    phone: "98 123 456",
    email: "mohamed@email.com",
    date: "07/07/2026 a 14:30",
    vehicle: "Peugeot 308 (2019)",
    vin: "VF1RFA00512345678",
    request: "Kit embrayage complet + disques de frein avant + plaquettes",
    avatarColor: "from-blue-500 to-cyan-400"
  },
  {
    id: "D-2026-002",
    client: "Sami Trabelsi",
    initials: "ST",
    phone: "97 654 321",
    email: "sami@email.com",
    date: "07/07/2026 a 10:15",
    vehicle: "Renault Clio 4 (2018)",
    vin: "VF1RFA00587654321",
    request: "Filtre a huile + filtre a air + bougies d'allumage",
    photos: 2,
    avatarColor: "from-green-500 to-emerald-600"
  },
  {
    id: "D-2026-003",
    client: "Karim Jaziri",
    initials: "KJ",
    phone: "96 789 012",
    email: "karim@email.com",
    date: "06/07/2026 a 16:45",
    vehicle: "Volkswagen Golf 7 (2020)",
    vin: "WVWZZZAUZJW123456",
    request: "Kit distribution + pompe a eau + courroie accessoire",
    avatarColor: "from-purple-500 to-violet-600"
  }
];

export const orders: Order[] = [
  {
    id: "CMD-001",
    title: "Kit Embrayage + Disques",
    vehicle: "Peugeot 308",
    date: "15/07/2026",
    status: "EN PREPARATION",
    statusColor: "bg-accent-orange",
    timeline: [
      { label: "Devis envoye", active: true },
      { label: "En preparation", active: true },
      { label: "Pret a livrer", active: false },
      { label: "Livre", active: false }
    ]
  },
  {
    id: "CMD-002",
    title: "Filtres + Bougies",
    vehicle: "Renault Clio 4",
    date: "10/07/2026",
    status: "LIVRE",
    statusColor: "bg-accent-green",
    timeline: [
      { label: "Devis envoye", active: true },
      { label: "En preparation", active: true },
      { label: "Pret a livrer", active: true },
      { label: "Livre", active: true }
    ]
  }
];

export const devisItems = [
  { designation: "Kit d'embrayage complet", qty: 1, ref: "1611273080", pu: 210.00, total: 210.00 },
  { designation: "Disque de frein avant (x2)", qty: 1, ref: "4246.W7", pu: 185.00, total: 185.00 },
  { designation: "Plaquettes de frein", qty: 1, ref: "4254.41", pu: 65.00, total: 65.00 },
];
