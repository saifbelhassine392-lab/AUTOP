"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"

interface Props {
  id: string
  name: string
  price: number
}

export default function AddToCartButton({ id, name, price }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        added
          ? "bg-green-500 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {added ? "✅ Ajouté !" : "🛒 Ajouter au panier"}
    </button>
  )
}