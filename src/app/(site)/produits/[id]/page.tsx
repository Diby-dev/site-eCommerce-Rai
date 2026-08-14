import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Tshirt } from '@/types/database';
import { Montserrat } from 'next/font/google';
import { RecordHistory } from '@/components/user/RecordHistory';
import { AddToFavoriteButton } from '@/components/user/AddToFavoriteButton'; // <--- Import du composant favoris
import { AddToCartButton } from '@/components/user/AddToCartButton';
import { BuyModalButton } from '@/components/user/BuyModalButton';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/site';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'] });

const formatCfaPrice = (value: number) =>
  Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

async function getTshirt(id: string) {
  const { data: tshirt, error } = await supabase
    .from('tshirt')
    .select('*')
    .eq('id_tshirt', id)
    .single<Tshirt>();

  return { tshirt, error };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { tshirt } = await getTshirt(id);

  if (!tshirt) {
    return { title: 'Produit introuvable', robots: { index: false, follow: false } };
  }

  const description = tshirt.detail_tshirt || `T-shirt ${tshirt.nom_tshirt}, disponible chez E-Shirt-R.`;
  const productUrl = `/produits/${tshirt.id_tshirt}`;

  return {
    title: tshirt.nom_tshirt,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      type: 'website',
      url: productUrl,
      title: tshirt.nom_tshirt,
      description,
      images: tshirt.image_url ? [{ url: tshirt.image_url, alt: `T-shirt ${tshirt.nom_tshirt}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: tshirt.nom_tshirt,
      description,
      images: tshirt.image_url ? [tshirt.image_url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { tshirt, error } = await getTshirt(id);

  if (error || !tshirt) notFound();

  const siteUrl = getSiteUrl();
  const productUrl = siteUrl
    ? new URL(`/produits/${tshirt.id_tshirt}`, siteUrl).toString()
    : `/produits/${tshirt.id_tshirt}`;
  const productDescription = tshirt.detail_tshirt || `T-shirt ${tshirt.nom_tshirt}, disponible chez E-Shirt-R.`;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tshirt.nom_tshirt,
    description: productDescription,
    image: tshirt.image_url ? [tshirt.image_url] : undefined,
    url: productUrl,
    color: tshirt.couleur_tshirt,
    size: tshirt.taille_tshirt || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'XOF',
      price: tshirt.prix_tshirt,
      availability: tshirt.nombre_tshirt > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: productUrl,
    },
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-32 px-6 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, '\\u003c'),
        }}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <RecordHistory tshirtId={tshirt.id_tshirt} />
        
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
            {/* Utilisation du composant interactif favoris */}
            <AddToFavoriteButton tshirtId={tshirt.id_tshirt} />
            
            <AddToCartButton tshirtId={tshirt.id_tshirt} />
          </div>

          <div className="w-full mt-2">
            <BuyModalButton tshirtName={tshirt.nom_tshirt} />
          </div>
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
