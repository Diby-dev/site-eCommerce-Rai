'use client';

import { Filter } from 'lucide-react';

export const FilterBar = () => {
  const filters = ['Couleur', 'Status', 'Prix', 'Taille'];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full">
      {/* Icône de filtre */}
      <div className="flex items-center gap-1 text-gray-700 font-medium">
        <Filter size={18} />
        <span>Filter :</span>
      </div>

      {/* Liste des filtres : flex-wrap permet le passage à la ligne sur mobile */}
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((filter) => (
          <select 
            key={filter}
            className="bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <option>{filter}</option>
          </select>
        ))}
      </div>

      {/* Bouton principal */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-sm font-medium transition-colors">
        tout afficher
      </button>
    </div>
  );
};