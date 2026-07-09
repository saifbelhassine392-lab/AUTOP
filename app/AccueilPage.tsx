import Link from 'next/link'

export default function AccueilPage() {
  return (
    <div className="text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Vos pièces auto au meilleur prix
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Trouvez toutes les pièces détachées pour votre véhicule. Devis gratuit, livraison rapide et garantie incluse.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/pieces" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Rechercher une pièce
          </Link>
          <Link 
            href="/devis" 
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </div>
  )
}