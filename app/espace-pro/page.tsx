"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EspaceProPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user?.role !== "pro" && session.user?.role !== "admin")) {
      router.push("/connexion");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">Chargement de votre espace pro...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Espace Professionnel</h1>
      <p className="mb-4">Bienvenue, {session?.user?.name || "Partenaire AUTOP"}.</p>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vos Commandes et Devis</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">Aucune commande en cours.</p>
        ) : (
          <div className="overflow-x-auto">
            <p className="text-green-600">{orders.length} commande(s) trouvée(s).</p>
          </div>
        )}
      </div>
    </div>
  );
}