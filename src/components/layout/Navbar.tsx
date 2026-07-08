import Link from 'next/link';
import Image from 'next/image';
import { User, ShoppingBag } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO (Gauche) */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={120} height={40} priority className="w-14 md:w-15 h-auto" />
        </Link>

        {/* LIENS (Droite) */}
        <div className="flex items-center gap-6">
          <Link href="/compte" className="flex items-center gap-2 hover:text-blue-400 text-[18px] font-bold transition-colors">
            <User size={20} />
            <span className="hidden md:inline">Mon espace</span>
          </Link>
          
          <Link href="/panier" className="flex items-center gap-2 hover:text-blue-400 text-[18px] font-bold transition-colors">
            <ShoppingBag size={20} />
            <span className="hidden md:inline">Panier</span>
          </Link>
        </div>

      </div>
    </nav>
  );
};