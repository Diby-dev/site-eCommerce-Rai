'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Tshirt {
  id_tshirt: number;
  nom_tshirt: string;
  prix_tshirt: number;
  couleur_tshirt: string;
  taille_tshirt: string;
  statut_tshirt: 'disponible' | 'stock épuisé';
  nombre_tshirt: number;
  detail_tshirt: string | null;
  image_url: string | null;
  marque_tshirt: string | null;
  type_tshirt: string | null;
}

export default function Home() {
  const [tshirts, setTshirts] = useState<Tshirt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTshirts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tshirt')
          .select('*')
          .order('id_tshirt', { ascending: true });

        if (error) throw error;

        if (data) {
          setTshirts(data as Tshirt[]);
        }
      } catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Impossible de charger les produits.';
  setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTshirts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-8 md:p-16">
      {/* Header */}
      <div className="w-full max-w-6xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500 tracking-tight">
          e-tshirt(raissa)
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-sm">
          Aperçu dynamique de la base de données Supabase
        </p>
      </div>

      {/* Zone d'affichage des états (Chargement / Erreur) */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 text-blue-400 font-medium my-12 animate-pulse">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div>Chargement des t-shirts...</div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950 border border-red-800 text-red-200 px-6 py-4 rounded-xl max-w-xl text-center shadow-lg my-6">
          <p className="font-bold">❌ Une erreur est survenue</p>
          <p className="text-sm text-red-400 mt-1 font-mono">{errorMsg}</p>
        </div>
      )}

      {/* Grille de produits */}
      {!loading && !errorMsg && (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tshirts.map((item) => (
            <div 
              key={item.id_tshirt} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:border-slate-700 transition-all duration-300"
            >
              {/* Conteneur de l'image */}
              <div className="relative w-full aspect-square bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.nom_tshirt}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-slate-600 text-xs italic">Aucune image disponible</div>
                )}

                {/* Badge de Statut */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                  item.statut_tshirt === 'disponible' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {item.statut_tshirt}
                </span>
              </div>

              {/* Détails du produit */}
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
                    {item.nom_tshirt}
                  </h2>
                </div>

                <p className="text-sm text-slate-400 grow mb-6 line-clamp-3">
                  {item.detail_tshirt || "Aucune description fournie pour cet article."}
                </p>

                {/* Attributs (Taille, Couleur, Stock) */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono text-slate-300 mb-6 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <div>
                    <span className="block text-slate-500 mb-0.5">Taille</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400 font-bold">{item.taille_tshirt || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-0.5">Couleur</span>
                    <span className="text-slate-200">{item.couleur_tshirt}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-0.5">Stock</span>
                    <span className={item.nombre_tshirt > 5 ? 'text-emerald-400' : 'text-amber-400'}>
                      {item.nombre_tshirt} pcs
                    </span>
                  </div>
                </div>

                {/* Pied de carte : Prix & Action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-mono">Prix</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
                      {item.prix_tshirt.toLocaleString('fr-FR')} <span className="text-xs font-bold">FCFA</span>
                    </span>
                  </div>
                  
                  <button 
                    disabled={item.statut_tshirt !== 'disponible'}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                      item.statut_tshirt === 'disponible'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Si aucune donnée n'est renvoyée */}
      {!loading && !errorMsg && tshirts.length === 0 && (
        <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-2xl max-w-md my-12">
          <p className="text-slate-400 text-lg">La table est vide pour le moment.</p>
        </div>
      )}
    </main>
  );
}