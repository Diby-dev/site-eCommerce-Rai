import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Lock, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;
  const errorMessage = resolvedParams?.error;

  // Server Action pour traiter la connexion
  async function handleAdminLogin(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      redirect('/admin/login?error=Veuillez remplir tous les champs.');
    }

    // 1. Authentification Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      redirect('/admin/login?error=Email ou mot de passe incorrect.');
    }

    // 2. Vérification dans la table personnalisée "admis"
    const { data: adminData, error: adminError } = await supabase
      .from('admis')
      .select('*')
      .eq('email_admis', email)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      redirect('/admin/login?error=Acces refuse : vous n etes pas administrateur.');
    }

    // 3. Redirection vers le dashboard admin en cas de succès
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-[url('/fond.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        
        {/* En-tête / Icône Cadenas */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center mb-4 shadow-inner">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Espace Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Connectez-vous pour gérer la boutique</p>
        </div>

        {/* Message d'erreur éventuel passé par l'URL */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        {/* Formulaire rattaché à la Server Action */}
        <form action={handleAdminLogin} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-gray-300 font-medium">Email administrateur</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 pointer-events-none">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                name="email"
                required
                placeholder="dibyadmis@gmail.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-gray-300 font-medium">Mot de passe</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 pointer-events-none">
                <KeyRound size={18} />
              </span>
              <input 
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/20"
          >
            Se connecter
          </button>

        </form>

        {/* Lien de retour discret */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Retourner à la boutique
          </Link>
        </div>

      </div>
    </div>
  );
}