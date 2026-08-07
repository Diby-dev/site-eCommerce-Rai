import { supabase } from '@/lib/supabase';
import { SidebarAdmin } from './SidebarAdmin';
import { Shirt, ExternalLink, Plus, Edit } from 'lucide-react';
import DeleteButton from './DeleteButton';
import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/layout/SearchBar'; // Adapte le chemin selon ton projet

const formatCfaPrice = (value: number) =>
  Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.query || '';

  // 1. Récupération du comptage total des t-shirts
  const { count: countTshirts } = await supabase
    .from('tshirt')
    .select('*', { count: 'exact', head: true });

  // 2. Récupération des t-shirts avec filtrage par nom si une recherche est active
  let query = supabase
    .from('tshirt')
    .select('*')
    .order('id_tshirt', { ascending: false });

  if (searchQuery) {
    query = query.ilike('nom_tshirt', `%${searchQuery}%`);
  }

  const { data: tshirts, error: tshirtsError } = await query;

  // 3. Récupération sécurisée de l'administrateur connecté
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

  const STORAGE_URL = "https://mkqzvhtwopuikjtpxcce.supabase.co/storage/v1/object/public/images-tshirts/";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Responsive */}
      <SidebarAdmin adminName={adminName} />

      {/* Corps de la page */}
      <main className="flex-1 md:ml-20 p-6 lg:p-12 pb-24 md:pb-12 transition-all">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-500 mt-1">
              Bienvenue sur votre espace de gestion, <span className="font-semibold text-gray-800">{adminName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link 
              href="/admin/dashboard/ajouter" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all text-sm font-semibold"
            >
              <Plus size={18} />
              <span>Ajouter un t-shirt</span>
            </Link>

            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 hover:shadow-sm transition-all text-sm font-semibold"
            >
              <span>Voir la boutique</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* Bloc Statistiques */}
        <div className="max-w-xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-8 lg:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
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

        {/* SECTION : Gestion et recherche */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des articles</h2>

          {/* Barre de recherche et bouton "Tout afficher" directement sur la page */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="w-full flex-1">
              <SearchBar />
            </div>

            {/* Le bouton apparaît uniquement si une recherche est en cours */}
            {searchQuery && (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-semibold transition-all text-sm shadow-sm whitespace-nowrap"
              >
                <span>Tout afficher</span>
              </Link>
            )}
          </div>

          {tshirtsError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              Erreur lors du chargement des articles.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tshirts && tshirts.length > 0 ? (
              tshirts.map((item) => {
                const imageUrl = item.image_url 
                  ? (item.image_url.startsWith('http') ? item.image_url : `${STORAGE_URL}${item.image_url}`)
                  : '/placeholder-tshirt.png';

                return (
                  <div 
                    key={item.id_tshirt} 
                    className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full pt-[80%] bg-gray-100 overflow-hidden">
                        <Image 
                          src={imageUrl} 
                          alt={item.nom_tshirt} 
                          fill 
                          className="object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <h3 className="text-gray-900 font-bold text-base line-clamp-1">
                          {item.nom_tshirt}
                        </h3>
                        <p className="text-orange-600 font-extrabold text-lg mt-1">
                          {formatCfaPrice(item.prix_tshirt)} FCFA
                        </p>
                        <div className="flex gap-2 mt-2 text-xs text-gray-500 font-medium">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md">Couleur : {item.couleur_tshirt}</span>
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md">Stock : {item.nombre_tshirt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'action : Modifier (jaune) & Supprimer (rouge via DeleteButton) */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                      <Link 
                        href={`/admin/dashboard/modifier/${item.id_tshirt}`}
                        className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm shadow-sm"
                      >
                        <Edit size={16} />
                        <span>Modifier</span>
                      </Link>

                      {/* Composant DeleteButton interactif */}
                      <DeleteButton id={item.id_tshirt} nom={item.nom_tshirt} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-gray-500 py-8 bg-white rounded-2xl border border-gray-100 text-center">
                Aucun t-shirt ne correspond à votre recherche.
              </p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}