"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Utilisation de signIn de NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // On gère la redirection nous-mêmes
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const { data: user } = await meRes.json();
          if (user?.role === "ADMIN") {
            router.push("/admin/dashbord");
          } else if (user?.role === "PROFESSIONAL") {
            router.push("/espace-pro");
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      }
      router.refresh(); // Rafraîchit l'état de la session
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md w-96">
        <h1 className="mb-4 text-2xl font-bold">Connexion</h1>
        
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}