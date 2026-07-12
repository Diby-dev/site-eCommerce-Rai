import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Tshirt } from '@/types/database';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'] });

const formatCfaPrice = (value: number) =>
  Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: tshirt, error } = await supabase
    .from('tshirt')
    .select('*')
    .eq('id_tshirt', id)
    .single<Tshirt>();

  if (error || !tshirt) return <div className="text-black pt-20 text-center">T-shirt introuvable.</div>;

  return (
    // Pas de Navbar, pas de Footer ici ! 
    // Le layout gère tout cela automatiquement.
    <main className="min-h-screen bg-white text-gray-900 pt-32 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* IMAGE */}
        <div className="w-full">
          <Image
            src={tshirt.image_url || '/placeholder.png'}
            alt={`T-shirt ${tshirt.nom_tshirt}`}
            width={800}
            height={800}
            priority={true}
            className="w-full h-auto shadow-sm"
          />
        </div>

        {/* INFORMATIONS */}
        <div className="flex flex-col items-start gap-4">
          <h1 className={`${montserrat.className} text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter text-black leading-none`}>
            {tshirt.nom_tshirt}
          </h1>

          <p className="text-3xl font-semibold text-gray-800">
            {formatCfaPrice(tshirt.prix_tshirt)} FCFA
          </p>

          <div className="flex flex-col gap-2 w-full text-sm">
            <p className="px-3 py-1 font-semibold bg-slate-800 text-white w-fit">
              {tshirt.couleur_tshirt}
            </p>
            <p className="px-3 py-1 font-semibold bg-sky-700 text-white w-fit">
              {tshirt.taille_tshirt || 'Unique'}
            </p>
            <p className="text-xl text-slate-900">
              {tshirt.nombre_tshirt} restants
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mt-6 items-start">
            <button className="w-64 bg-white text-black py-3 rounded font-bold border-2 border-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              Ajouter aux favoris
            </button>
            <button className="w-64 bg-white text-black py-3 rounded font-bold border-2 border-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              Ajouter au panier
            </button>
          </div>

          <button className="w-full bg-orange-600 text-white py-4 rounded font-bold text-lg hover:bg-orange-700 transition-all">
            ACHETER MAINTENANT
          </button>
        </div>
      </div>

      {/* CARTE DESCRIPTION */}
      <div className="mt-16 mb-20 w-full max-w-7xl mx-auto p-8 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Description du produit</h2>
        <p className="leading-relaxed">
          Découvrez notre modèle {tshirt.nom_tshirt}. Un design exclusif disponible en couleur {tshirt.couleur_tshirt}.
        </p>
      </div>
      <div className='bg-white text-amber-50'>S</div>
    </main>
  );
}