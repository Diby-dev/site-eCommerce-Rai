import { NavbarWrapper } from '@/components/home/NavbarWrapper';
import { HeroImage } from '@/components/home/HeroImage';
import { SearchBar } from '@/components/layout/SearchBar';
import { FilterBar } from '@/components/home/FilterBar';
import { ProductCard } from '@/components/home/ProductCard';
import { Conectshar } from '@/components/home/Conectshar';
import { Footer } from '@/components/layout/Footer';
import { CommentSection } from '@/components/home/CommentSection';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Tshirt } from '@/types/database';

interface ShopPageProps {
  searchParams: Promise<{ 
    query?: string;
    couleur?: string;
    statut?: string;
    taille?: string;
    prix?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.query || '';
  const couleurQuery = resolvedParams?.couleur || '';
  const statutQuery = resolvedParams?.statut || '';
  const tailleQuery = resolvedParams?.taille || '';
  const prixQuery = resolvedParams?.prix || '';

  // Construction de la requête Supabase avec filtres dynamiques
  let query = supabase.from('tshirt').select('*');

  if (searchQuery) {
    query = query.ilike('nom_tshirt', `%${searchQuery}%`);
  }
  if (couleurQuery) {
    query = query.eq('couleur_tshirt', couleurQuery);
  }
  if (statutQuery) {
    query = query.eq('statut_tshirt', statutQuery);
  }
  if (tailleQuery) {
    query = query.eq('taille_tshirt', tailleQuery);
  }

  // Gestion du tri
  if (prixQuery === 'asc') {
    query = query.order('prix_tshirt', { ascending: true });
  } else if (prixQuery === 'desc') {
    query = query.order('prix_tshirt', { ascending: false });
  } else {
    query = query.order('id_tshirt', { ascending: false });
  }

  const { data: tshirts, error } = await query;

  // Récupération de tous les t-shirts pour extraire dynamiquement les filtres uniques
  const { data: allTshirts } = await supabase.from('tshirt').select('couleur_tshirt, statut_tshirt, taille_tshirt');

  const couleursDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.couleur_tshirt).filter(Boolean))) as string[];
  const statutsDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.statut_tshirt).filter(Boolean))) as string[];
  const taillesDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.taille_tshirt).filter(Boolean))) as string[];

  if (error) {
    console.error("Erreur Supabase:", error);
    return <div className="text-white text-center pt-20">Erreur de chargement des t-shirts.</div>;
  }

  return (
    <div className="min-h-screen bg-[url('/fond.jpg')] bg-cover bg-center bg-no-repeat">
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
            <FilterBar 
              couleurs={couleursDisponibles} 
              statuts={statutsDisponibles} 
              tailles={taillesDisponibles} 
            />
          </div>

          <div className="mt-8 mb-4 bg-purple-700 text-white px-6 py-3 rounded-full flex justify-between items-center shadow-md">
            <span className="font-medium text-sm md:text-base">t-shirts trouvés</span>
            <span className="font-bold text-lg">{tshirts?.length || 0}</span>
          </div>

          {/* Grille des produits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tshirts && tshirts.length > 0 ? (
              tshirts.map((item: Tshirt) => (
                <Link 
                  key={item.id_tshirt} 
                  href={`/produits/${item.id_tshirt}`} 
                  className="block hover:scale-100 transition-transform duration-300">
                  <ProductCard tshirt={item} />
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">Aucun t-shirt ne correspond à votre recherche.</p>
            )}
          </div>
        </div>

        {/* Reste de la page inchangé */}
        <div className="relative z-20 mt-12 lg:mt-10 mx-4 h-150 md:h-120 lg:h-115 md:mx-12 lg:mx-24 bg-white rounded-[50px] shadow-[0_-6px_30px_rgba(0,0,0,0.5)] p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-orange-600 font-medium text-sm">Restez à la mode</h2>
            <h1 className="text-base md:text-2xl lg:text-3xl filter-[drop-shadow(0px_10px_50px_rgba(0,0,0,0.8))] font-bold text-gray-900 mt-2 mb-7 lg:mb-15">
              N&apos;oubliez pas de partager<br/>et de vous connecter
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
                +{tshirts?.length || 0}
              </div>
              <h3 className="font-semibold text-gray-900">Modèles créés</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
                +150
              </div>
              <h3 className="font-semibold text-gray-900">Avis clients</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-bold text-3xl mb-4">
                +400
              </div>
              <h3 className="font-semibold text-gray-900">T-shirts vendus</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-sky-50 px-7 lg:px-15 py-10 mt-10">
  <div className="text-center mb-10">
    <h2 className="text-orange-600 font-medium text-sm">Mode de paiement</h2>
    <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
      Comment payer
    </h1>
  </div>

  <div className="max-w-3xl mx-auto text-gray-700 text-sm md:text-base leading-relaxed space-y-4 text-center md:text-left">
    <p>
      Chez <span className="font-bold text-gray-900">E-Shirt-R</span>, les paiements ne se font pas directement en ligne pour privilégier la proximité. Pour commander, il vous suffit de choisir votre article et de cliquer sur le bouton orange <span className="font-bold text-orange-600">&ldquo;Acheter maintenant&rdquo;</span> sur la page du produit.
    </p>
    <p>
      Vous serez directement mis en relation avec le vendeur par <span className="font-bold text-gray-900">WhatsApp</span> ou par <span className="font-bold text-gray-900">téléphone</span>. Cet échange vous permettra de vous mettre d&apos;accord facilement sur le <span className="font-bold text-gray-900">mode de paiement</span>, les <span className="font-bold text-gray-900">modalités de livraison</span> ou un <span className="font-bold text-gray-900">retrait sur site</span>.
    </p>
  </div>
</div>
          <CommentSection />
      </main>
      <Footer />
    </div>
  );
}