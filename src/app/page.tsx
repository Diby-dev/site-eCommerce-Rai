import { NavbarWrapper } from '@/components/home/NavbarWrapper';
import { HeroImage } from '@/components/home/HeroImage';
import { SearchBar } from '@/components/layout/SearchBar';
import { FilterBar } from '@/components/home/FilterBar';
import { ProductCard } from '@/components/home/ProductCard';
import { Conectshar } from '@/components/home/Conectshar';
import { Footer } from '@/components/layout/Footer';
import { CommentSection } from '@/components/home/CommentSection';

import Link from 'next/link';
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tshirt } from '@/types/database';

interface ShopPageProps {
  searchParams: Promise<{ 
    query?: string;
    couleur?: string;
    statut?: string;
    taille?: string;
    prix?: string;
    page?: string;
  }>;
}

// Fonction pour générer une liste de pages intelligente avec des "..."
function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.query || '';
  const couleurQuery = resolvedParams?.couleur || '';
  const statutQuery = resolvedParams?.statut || '';
  const tailleQuery = resolvedParams?.taille || '';
  const prixQuery = resolvedParams?.prix || '';
  
  const currentPage = Number(resolvedParams?.page) || 1;
  const ITEMS_PER_PAGE = 9;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('tshirt')
    .select('*', { count: 'exact' });

  if (searchQuery) query = query.ilike('nom_tshirt', `%${searchQuery}%`);
  if (couleurQuery) query = query.eq('couleur_tshirt', couleurQuery);
  if (statutQuery) query = query.eq('statut_tshirt', statutQuery);
  if (tailleQuery) query = query.eq('taille_tshirt', tailleQuery);

  if (prixQuery === 'asc') {
    query = query.order('prix_tshirt', { ascending: true });
  } else if (prixQuery === 'desc') {
    query = query.order('prix_tshirt', { ascending: false });
  } else {
    query = query.order('id_tshirt', { ascending: false });
  }

  query = query.range(start, end);

  const { data: tshirts, count, error } = await query;
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  const { data: allTshirts } = await supabase.from('tshirt').select('couleur_tshirt, statut_tshirt, taille_tshirt');

  const couleursDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.couleur_tshirt).filter(Boolean))) as string[];
  const statutsDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.statut_tshirt).filter(Boolean))) as string[];
  const taillesDisponibles: string[] = Array.from(new Set(allTshirts?.map(t => t.taille_tshirt).filter(Boolean))) as string[];

  if (error) {
    console.error("Erreur Supabase:", error);
    return <div className="text-white text-center pt-20">Erreur de chargement des t-shirts.</div>;
  }

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (couleurQuery) params.set('couleur', couleurQuery);
    if (statutQuery) params.set('statut', statutQuery);
    if (tailleQuery) params.set('taille', tailleQuery);
    if (prixQuery) params.set('prix', prixQuery);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}#produits`;
  };

  const paginationPages = generatePagination(currentPage, totalPages);

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
            <span className="font-bold text-lg">{count || 0}</span>
          </div>

          {/* Grille des produits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" id="produits">
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

          {/* Barre de Pagination Intelligente */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-12 mb-4 flex-wrap">
              {/* Bouton Précédent */}
              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white transition-all font-semibold"
                >
                  <ChevronLeft size={14} className="md:w-4 md:h-4" />
                  <span>Précédent</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-xl bg-gray-100 text-gray-300 cursor-not-allowed font-semibold">
                  <ChevronLeft size={14} className="md:w-4 md:h-4" />
                  <span>Précédent</span>
                </span>
              )}

              {/* Numéros de pages dynamiques */}
              <div className="flex items-center gap-1.5 px-1">
                {paginationPages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400 font-bold">
                        ...
                      </span>
                    );
                  }

                  const pageNum = Number(page);
                  const isActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={createPageUrl(pageNum)}
                      className={`min-w-[2.2rem] h-9 md:min-w-2.5rem md:h-10 px-3 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {/* Bouton Suivant */}
              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(currentPage + 1)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white transition-all font-semibold"
                >
                  <span>Suivant</span>
                  <ChevronRight size={14} className="md:w-4 md:h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-xl bg-gray-100 text-gray-300 cursor-not-allowed font-semibold">
                  <span>Suivant</span>
                  <ChevronRight size={14} className="md:w-4 md:h-4" />
                </span>
              )}
            </div>
          )}
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
                +{count || 0}
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
        
        <div className="bg-sky-50 px-7 lg:px-15 py-10 mt-10 relative">
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

          <div className="absolute bottom-4 right-4">
            <Link 
              href="/admin/login" 
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-800 transition-all shadow-xs"
              title="Espace Administrateur"
            >
              <Lock size={14} />
            </Link>
          </div>
        </div>
        <CommentSection />
      </main>
      <Footer />
    </div>
  );
}