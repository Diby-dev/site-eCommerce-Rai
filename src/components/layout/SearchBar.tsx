'use client';

import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    // 1. w-full avec max-w-[90vw] (mobile) laisse de la place sur les côtés.
    // 2. md:max-w-xl lg:max-w-2xl redonne la largeur complète sur PC/Tablette.
    // 3. h-10 (mobile) et md:h-14 (PC/Tablette) gère la hauteur.
    <div className="flex items-stretch bg-gray-50 rounded-[100px] w-full max-w-[90vw] md:max-w-xl lg:max-w-2xl border border-gray-200 shadow-lg overflow-hidden mx-auto h-10 md:h-14">
      
      {/* Icône */}
      <div className="flex items-center pl-3 md:pl-6 text-gray-400">
        {/* Taille fixe adaptée */}
        <Search size={18} className="md:size-5" />
      </div>
      
      {/* Input */}
      <input 
        type="text" 
        placeholder="Rechercher un t-shirt..." 
        className="bg-transparent text-gray-800 px-2 md:px-4 focus:outline-none w-full placeholder:text-gray-400 text-[11px] md:text-base" 
      />
      
      {/* Bouton */}
      <button className="bg-[#1e1e8a] hover:bg-blue-900 text-white px-4 md:px-8 font-medium whitespace-nowrap text-[11px] md:text-base transition-colors">
        Rechercher
      </button>
    </div>
  );
};