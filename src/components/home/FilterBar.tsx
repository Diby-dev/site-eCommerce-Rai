'use client';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterBarProps {
  couleurs: string[];
  statuts: string[];
  tailles: string[];
}

export const FilterBar = ({ couleurs, statuts, tailles }: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCouleur = searchParams.get('couleur') || '';
  const currentStatut = searchParams.get('statut') || '';
  const currentTaille = searchParams.get('taille') || '';
  const currentPrix = searchParams.get('prix') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full">
      {/* Icône de filtre */}
      <div className="flex items-center gap-1 text-gray-700 font-medium">
        <Filter size={18} />
        <span>Filter :</span>
      </div>

      {/* Liste des filtres dynamiques */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Filtre Couleur */}
        <select 
          value={currentCouleur}
          onChange={(e) => handleFilterChange('couleur', e.target.value)}
          className="bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none capitalize"
        >
          <option value="">Couleur</option>
          {couleurs.map((couleur) => (
            <option key={couleur} value={couleur}>
              {couleur}
            </option>
          ))}
        </select>

        {/* Filtre Statut */}
        <select 
          value={currentStatut}
          onChange={(e) => handleFilterChange('statut', e.target.value)}
          className="w-24 bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none capitalize"
        >
          <option value="">Statut</option>
          {statuts.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </select>

        {/* Filtre Prix (Tri) */}
        <select 
          value={currentPrix}
          onChange={(e) => handleFilterChange('prix', e.target.value)}
          className="w-20 bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none"
        >
          <option value="">Prix</option>
          <option value="asc">Croissant</option>
          <option value="desc">Décroissant</option>
        </select>

        {/* Filtre Taille */}
        <select 
          value={currentTaille}
          onChange={(e) => handleFilterChange('taille', e.target.value)}
          className="bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none uppercase"
        >
          <option value="">Taille</option>
          {tailles.map((taille) => (
            <option key={taille} value={taille}>
              {taille}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton principal */}
      <Link href="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-sm font-medium transition-colors">
          tout afficher
        </button>
      </Link>
    </div>
  );
};