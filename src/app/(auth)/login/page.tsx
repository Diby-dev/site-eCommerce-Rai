'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Loginpage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string; // Toujours requis par Supabase
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/espace-client');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 text-center">Connexion</h2>
      <p className="text-sm text-gray-500 text-center mt-2 mb-8">Ravi de vous revoir sur KingShop.</p>

      <div className="space-y-5">
        {/* Email toujours nécessaire pour Supabase */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Adresse email</label>
          <input name="email" type="email" required className="w-full border text-slate-950 border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none transition" />
        </div>

        {/* Ton champ mot de passe */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Entrez le mot de passe que vous avez créé sur notre site</label>
          <input name="password" type="password" required className="w-full border text-slate-950 border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none transition" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-sky-400 hover:bg-sky-950 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <div className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-sky-600 font-semibold hover:underline">
          Créer un compte
        </Link>
      </div>

      {error && (
        <div className="mt-5 p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}
    </form>
    </main>
  );
}