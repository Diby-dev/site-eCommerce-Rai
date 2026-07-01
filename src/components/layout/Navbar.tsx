// src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'Produit', href: '/produits' },
  { name: 'Avis', href: '/avis' },
  { name: 'Partager', href: '/partager' },
  { name: 'Mon espace', href: '/compte' },
  { name: 'Panier', href: '/panier' },
];

export const Navbar = ({ isVisible }: { isVisible: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex justify-between items-center text-white shadow-[0_10px_6px_-1px_rgba(0,0,0,0.3)] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="z-50 ms-5">
          <Image src="/logo.png" alt="Logo" width={150} height={50} priority className="w-14 md:w-20 h-auto" />
        </Link>

        {/* --- LISTE DES LIENS (Desktop) --- */}
        <ul className="hidden md:flex items-center gap-10 me-5 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="hover:text-blue-400 text-[18px] font-bold transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* --- BOUTON BURGER (Corrigé et visible) --- */}
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

      {/* --- MENU MOBILE (Ajusté pour ne pas être trop massif) --- */}
      <div className={`fixed top-0 left-0 bottom-0 backdrop-blur-sm z-40 w-64 bg-slate-900/65 p-6 pt-24 shadow-2xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ul className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                onClick={closeMenu}
                className="block py-3 text-white border-b  border-slate-700 hover:text-blue-400"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};