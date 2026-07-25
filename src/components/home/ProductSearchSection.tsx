'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/home/ProductCard';
import { Tshirt } from '@/types/database';
import Link from 'next/link';

interface ProductSearchSectionProps {
  initialTshirts: Tshirt[];
}

export const ProductSearchSection = ({ initialTshirts }: ProductSearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTshirts, setFilteredTshirts] = useState<Tshirt[]>(initialTshirts);

  // Fonction déclenchée lors de la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredTshirts(initialTshirts);
      return;
    }

    const results = initialTshirts.filter((item) =>
      item.nom_tshirt?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTshirts(results);
  };

  return (
    <>
      {/* Barre de recherche interactive */}
      <form 
        onSubmit={handleSearch}
        className="flex items-stretch bg-gray-50 rounded-[100px] w-full max-w-[90vw] md:max-w-xl lg:max-w-2xl border border-gray-200 overflow-hidden mx-auto h-10 md:h-14 shadow-md mb-8"
      >
        <div className="flex items-center pl-3 md:pl-6 text-gray-400">
          <Search size={18} className="md:size-5" />
        </div>
        
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un t-shirt..." 
          className="bg-transparent text-gray-800 px-2 md:px-4 focus:outline-none w-full placeholder:text-gray-400 text-[11px] md:text-base" 
        />
        
        <button 
          type="submit"
          className="bg-[#1e1e8a] hover:bg-blue-900 text-white px-4 md:px-8 font-medium whitespace-nowrap text-[11px] md:text-base transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Compteur dynamique */}
      <div className="mt-8 mb-4 bg-purple-700 text-white px-6 py-3 rounded-full flex justify-between items-center shadow-md">
        <span className="font-medium text-sm md:text-base">t-shirts trouvés</span>
        <span className="font-bold text-lg">{filteredTshirts.length}</span>
      </div>

      {/* Grille des produits utilisant ton ProductCard */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTshirts.length > 0 ? (
          filteredTshirts.map((item: Tshirt) => (
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
    </>
  );
};