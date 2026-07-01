'use client'; // Ce composant est un client component
import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';

export const NavbarWrapper = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowNavbar(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <Navbar isVisible={showNavbar} />;
};