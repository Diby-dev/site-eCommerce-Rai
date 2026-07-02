import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { HeroImage } from '@/components/layout/HeroImage';


export default function ShopPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavbarWrapper />
      <HeroImage />
      <main className="relative z-20 -mt-24 mx-4 md:mx-12 lg:mx-24 bg-white rounded-t-[50px] shadow-2xl min-h-150 p-8 md:p-12">
        {/* Ici viendra ton contenu (recherche, filtres, produits) */}
        <div className="text-center">
          <h2 className="text-gray-500 font-medium">Habillez vous avec style</h2>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            Trouvez le style qui vous correspond parmi nos t-shirt de qualité premium
          </h1>
        </div>
      </main>
    </div>
  );
}