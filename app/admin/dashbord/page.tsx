'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminContent from '@/components/AdminContent';
import Image from 'next/image';
import { Settings, Bell } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          <span className="text-slate-400 font-black uppercase text-sm tracking-widest">CHARGEMENT...</span>
        </div>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  const isAdmin = role === 'admin' || role === 'ADMIN' || role === 'PROFESSIONAL';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 relative mx-auto mb-6">
            <Image src="/logo.png" alt="AUTOP" fill style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">ACCÈS RÉSERVÉ</h2>
          <p className="text-slate-400 uppercase text-sm mb-6">CET ESPACE EST RÉSERVÉ AUX ADMINISTRATEURS AUTOP.</p>
          <button onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-wide transition">
            RETOUR À L'ACCUEIL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-white antialiased">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 relative">
              <Image src="/logo.png" alt="AUTOP" fill style={{ objectFit: 'contain' }} />
            </div>
            <span className="text-white font-black uppercase tracking-widest text-sm">AUTOP — CONSOLE ADMINISTRATION</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition p-1.5">
              <Bell className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-white transition p-1.5">
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-white font-black text-xs uppercase leading-none">{session?.user?.name?.toUpperCase()}</p>
                <p className="text-slate-500 text-[9px] uppercase">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-950">
          <AdminContent />
        </main>
      </div>
    </div>
  );
}