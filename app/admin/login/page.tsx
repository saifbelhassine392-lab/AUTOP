'use client';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();

  const loginAs = (name: string) => {
    localStorage.setItem('adminAuth', name);
    router.push('/admin/dashbord');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e1a] text-white">
      <h1 className="text-4xl font-bold mb-10 text-red-600">AUTOP</h1>
      <div className="grid gap-4 w-64">
        <button 
          onClick={() => loginAs('SAIF')} 
          className="p-4 bg-slate-800 rounded-xl hover:bg-red-600 transition font-bold"
        >
          SAIF
        </button>
        <button 
          onClick={() => loginAs('AMINE')} 
          className="p-4 bg-slate-800 rounded-xl hover:bg-red-600 transition font-bold"
        >
          AMINE
        </button>
      </div>
    </div>
  );
}