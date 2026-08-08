import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-black text-gray-400">
      {/* Partie Haute */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            
            {/* Logo / Marque */}
            <div className="col-span-2 lg:col-span-1">
                <Link href="/" className="block">
                <Image 
                  src="/logo.png" // Ton fichier dans le dossier public
                  alt="KingShop Logo"
                  width={62}  // Ajuste la largeur selon ton logo
                  height={15}  // Ajuste la hauteur selon ton logo
                  className="w-auto h-auto"
                />
              </Link>
              <span className="text-white font-bold text-2xl">KingShop</span>
              <p className="mt-4 text-sm">Tout style de t-shirt réunis dans un seul endroit.</p>
            </div>

            {/* Colonne Coordonnées (Alignée à droite sur PC) */}
            <div className="col-span-2 md:col-span-1 md:col-start-4 lg:col-start-5">
              <h3 className="text-white font-semibold mb-4">Coordonnées</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-orange-500 cursor-pointer">Abidjan, Yopougon Maroc</span></li>
                <li><span className="hover:text-orange-500 cursor-pointer">05 75 07 48 20</span></li>
                <li><span className="hover:text-orange-500 cursor-pointer">07 98 21 58 59</span></li>
                <li><span className="hover:text-orange-500 cursor-pointer">dibyjeanyves02@gmail.com</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          
          {/* Copyright et Développeur */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <p>&copy; 2026 MyTeeShop, Inc.</p>
            <p className="hidden md:block">|</p>
            <p>Développé par Dan Diby</p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-500 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};