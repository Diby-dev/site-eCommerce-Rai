import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { HeroImage } from '@/components/layout/HeroImage';


export default function ShopPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavbarWrapper />
      <HeroImage />
      <main className="relative z-20 -mt-24 mx-4 md:mx-12 lg:mx-24 bg-white rounded-t-[50px] shadow-[0_-6px_30px_rgba(0,0,0,0.5)] min-h-150 p-8 md:p-12">
        {/* Ici viendra ton contenu (recherche, filtres, produits) */}
        <div className="text-center">
          <h2 className="text-orange-600 font-medium text-sm">Habillez vous avec style</h2>
          <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
            Trouvez votre style avec nos<br/>de t-shirts de qualité
          </h1>
        </div>
      </main>
    </div>
  );
}