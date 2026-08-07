import { supabase } from '@/lib/supabase';
import { SidebarAdmin } from './SidebarAdmin';
import { Shirt, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Récupération du comptage des t-shirts depuis Supabase
  const { count: countTshirts } = await supabase
    .from('tshirt')
    .select('*', { count: 'exact', head: true });

  // Récupération sécurisée de l'utilisateur connecté via getUser()
  const { data: { user } } = await supabase.auth.getUser();
  let adminName = "Administrateur";

  if (user?.email) {
    const { data: adminData } = await supabase
      .from('admis')
      .select('nom_admis')
      .eq('email_admis', user.email)
      .single();
    
    if (adminData) {
      adminName = adminData.nom_admis;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Responsive */}
      <SidebarAdmin adminName={adminName} />

      {/* Corps de la page */}
      <main className="flex-1 md:ml-20 p-6 lg:p-12 pb-24 md:pb-12 transition-all">
        
        {/* En-tête avec le raccourci vers la boutique et le bouton d'ajout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-500 mt-1">
              Bienvenue sur votre espace de gestion, <span className="font-semibold text-gray-800">{adminName}</span>.
            </p>
          </div>

          {/* Groupe de boutons d'action */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Bouton pour ajouter un t-shirt */}
            <Link 
              href="/admin/dashboard/ajouter" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all text-sm font-semibold"
            >
              <Plus size={18} />
              <span>Ajouter un t-shirt</span>
            </Link>

            {/* Raccourci vers la page principale */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 hover:shadow-sm transition-all text-sm font-semibold"
            >
              <span>Voir la boutique</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* Bloc Stylé et Unique pour les T-shirts */}
        <div className="max-w-xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-8 lg:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Effet lumineux décoratif en arrière-plan */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-6 z-10">
            <div className="w-20 h-20 rounded-2xl bg-orange-600/20 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/30 shadow-inner">
              <Shirt size={38} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-orange-400 font-semibold">Catalogue de la boutique</p>
              <h2 className="text-xl font-bold text-white mt-1">Total des T-shirts en base</h2>
              <p className="text-gray-400 text-sm mt-0.5">Articles actuellement enregistrés et disponibles</p>
            </div>
          </div>

          <div className="z-10 bg-slate-800/80 border border-slate-700 px-6 py-4 rounded-2xl text-center shrink-0 shadow-md">
            <span className="text-4xl lg:text-5xl font-extrabold text-orange-500">{countTshirts || 0}</span>
          </div>

        </div>

      </main>
    </div>
  );
}