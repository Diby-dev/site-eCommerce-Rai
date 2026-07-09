// src/components/home/NavbarWrapper.tsx
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// On importe la vraie Navbar dynamiquement en désactivant le SSR.
// Ainsi, le composant ne s'exécutera QUE sur le client, réglant l'erreur #418 et l'alerte ESLint.
const DynamicNavbar = dynamic(
  () => import('./Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

export const NavbarWrapper = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 120);
      setShowSearchBar(window.scrollY > 700);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <DynamicNavbar isVisible={showNavbar} showSearchBar={showSearchBar} />;
};