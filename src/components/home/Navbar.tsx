'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { name: 'Produit', href: '/produits' },
  { name: 'Avis', href: '/avis' },
  { name: 'Partager', href: '/partager' },
  { name: 'Mon espace', href: '/compte' },
  { name: 'Panier', href: '/panier' },
];

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(window.location.pathname);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="hidden lg:flex items-center bg-gray-100 rounded-[100px] mx-8 max-w-md w-full shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="pl-4 text-slate-900">
        <Search size={20} />
      </div>
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher un t-shirt..." 
        className="bg-transparent text-gray-800 px-3 py-2 focus:outline-none w-full placeholder:text-gray-500" 
      />
      <button 
        type="submit"
        className="bg-[#1e1e8a] hover:bg-blue-900 text-white px-6 py-2 font-medium whitespace-nowrap"
      >
        Rechercher
      </button>
    </form>
  );
};

export const Navbar = ({ isVisible, showSearchBar }: { isVisible: boolean; showSearchBar: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    async function fetchUserData(userId: string) {
      const { data } = await supabase.from('client').select('nom_client').eq('id_client', userId).single();
      if (data) setUserName(data.nom_client);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) fetchUserData(session.user.id);
      else setUserName(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex justify-between items-center text-white shadow-[0_10px_6px_-1px_rgba(0,0,0,0.3)] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <Link href="/" onClick={closeMenu} className="z-50 ms-5">
          <Image src="/logo.png" alt="Logo" width={150} height={50} priority className="w-14 md:w-20 h-auto" />
        </Link>

        {showSearchBar && (
           <div className="hidden md:block flex-1 mx-8 max-w-md">
             <SearchBar />
           </div>
        )}

        <ul className="hidden md:flex items-center gap-8 me-5 font-medium">
          {navLinks.map((link) => {
            const isUserLink = link.name === 'Mon espace';
            const displayName = isUserLink && isLoggedIn ? (userName || 'Mon compte') : link.name;
            const displayHref = isUserLink && isLoggedIn ? '/espace-client' : link.href;

            return (
              <li key={link.name}>
                <Link href={displayHref} className="hover:text-blue-400 text-[18px] font-bold transition-colors">
                  {displayName}
                </Link>
              </li>
            );
          })}
        </ul>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden z-50 p-2 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      <div className={`fixed top-0 left-0 bottom-0 backdrop-blur-sm z-40 w-64 bg-slate-900/65 p-6 pt-24 shadow-2xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ul className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map((link) => {
             const isUserLink = link.name === 'Mon espace';
             const displayName = isUserLink && isLoggedIn ? (userName || 'Mon compte') : link.name;
             const displayHref = isUserLink && isLoggedIn ? '/espace-client' : link.href;
             
             return (
              <li key={link.name}>
                <Link 
                  href={displayHref} 
                  onClick={closeMenu}
                  className="block py-3 text-white border-b border-slate-700 hover:text-blue-400"
                >
                  {displayName}
                </Link>
              </li>
             );
          })}
        </ul>
      </div>
    </>
  );
};