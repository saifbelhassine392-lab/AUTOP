"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      // Redirection vers la page de connexion après succès
      router.push("/connexion?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#0a0e1a] px-6 py-12 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
        <p className="mt-2 text-sm text-slate-400">
          Ou{" "}
          <Link href="/connexion" className="font-semibold text-blue-500 hover:text-blue-400">
            connectez-vous à votre compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#131a2e] px-6 py-8 shadow sm:rounded-lg sm:px-10 border border-slate-800">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Nom complet</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-[#0a0e1a] px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Ex: Saif Belhassine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-[#0a0e1a] px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Ex: test@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-[#0a0e1a] px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-[#0a0e1a] px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}