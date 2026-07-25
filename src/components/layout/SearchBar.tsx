'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(window.location.pathname); // Réinitialise si vide
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="flex items-stretch bg-gray-50 rounded-[100px] w-full max-w-[90vw] md:max-w-xl lg:max-w-2xl border border-gray-200 filter-[drop-shadow(0px_8px_4px_rgba(0,0,0,0.8))] overflow-hidden mx-auto h-10 md:h-14"
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
  );
};