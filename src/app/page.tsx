import { NavbarWrapper } from '@/components/home/NavbarWrapper';
import { HeroImage } from '@/components/home/HeroImage';
import { SearchBar } from '@/components/layout/SearchBar';
import { FilterBar } from '@/components/home/FilterBar';
import { ProductCard } from '@/components/home/ProductCard';
import { Conectshar } from '@/components/home/Conectshar';
import { Footer } from '@/components/layout/Footer';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Tshirt } from '@/types/database';

export default async function ShopPage() {
  // 1. Récupération des données typées
  const { data: tshirts, error } = await supabase
    .from('tshirt')
    .select('*')
    .order('date_tshirt', { ascending: false });

  // 2. Gestion de l'erreur (si elle existe, tshirts sera null)
  if (error) {
    console.error("Erreur Supabase:", error);
    return <div className="text-white text-center pt-20">Erreur de chargement des t-shirts.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <NavbarWrapper />
      <HeroImage />
      <main>
        <div className="relative z-20 -mt-24 mx-4 md:mx-12 lg:mx-24 bg-white rounded-[50px] shadow-[0_-6px_30px_rgba(0,0,0,0.5)] min-h-screen p-8 md:p-12">
          <div className="text-center">
          <h2 className="text-orange-600 font-medium text-sm">Habillez vous avec style</h2>
          <h1 className="text-base md:text-2xl lg:text-3xl filter-[drop-shadow(0px_10px_50px_rgba(0,0,0,0.8))] font-bold text-gray-900 mt-2 mb-7 lg:mb-15">
            Trouvez votre style avec nos<br/>t-shirts de qualité
          </h1>
          <SearchBar />
          <FilterBar />
        </div>

        <div className="mt-8 mb-4 bg-purple-700 text-white px-6 py-3 rounded-full flex justify-between items-center shadow-md">
          <span className="font-medium text-sm md:text-base">t-shirts trouvés</span>
          <span className="font-bold text-lg">{tshirts?.length || 0}</span>
        </div>

        {/* Grille des produits en bas du FilterBar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {tshirts?.map((item: Tshirt) => (
            <Link 
              key={item.id_tshirt} 
              href={`/produits/${item.id_tshirt}`} 
              className="block hover:scale-100 transition-transform duration-300">
              <ProductCard tshirt={item} />
            </Link>
          ))}
        </div>
        </div>


        <div className="relative z-20 mt-12 lg:mt-10 mx-4 h-150 md:h-120 lg:h-115 md:mx-12 lg:mx-24 bg-white rounded-[50px] shadow-[0_-6px_30px_rgba(0,0,0,0.5)] p-8 md:p-12">
          <div className="text-center">
          <h2 className="text-orange-600 font-medium text-sm">Restez à la mode</h2>
          <h1 className="text-base md:text-2xl lg:text-3xl filter-[drop-shadow(0px_10px_50px_rgba(0,0,0,0.8))] font-bold text-gray-900 mt-2 mb-7 lg:mb-15">
            N&apos;oubiez pas de partager<br/>et de vous connecter
          </h1>
          <Conectshar/>
        </div>
        </div>

        
        <div className="relative z-20 mt-11 lg:mt-10 mx-4 md:mx-12 lg:mx-24 bg-white rounded-[50px] shadow-[0_-6px_30px_rgba(0,0,0,0.5)] p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-orange-600 font-medium text-sm">Nos chiffres</h2>
            <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
              La communauté grandit
          </h1>
      </div>

      {/* Grille des 3 indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    
      {/* T-shirt */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
          +{tshirts?.length || 0}
        </div>
      <h3 className="font-semibold text-gray-900">Modèles créés</h3>
    </div>

      {/* Avis (Valeur statique pour l'instant) */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
          +150
          </div>
        <h3 className="font-semibold text-gray-900">Avis clients</h3>
      </div>

      {/* Achats */}
      <div className="flex flex-col items-center">
        <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
          +400
          </div>
        <h3 className="font-semibold text-gray-900">T-shirts vendus</h3>
      </div>
      </div>
    </div>
    </main>
    <Footer />
    </div>
  );
}