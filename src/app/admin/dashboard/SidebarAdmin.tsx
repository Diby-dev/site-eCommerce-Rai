'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, PlusCircle, Edit, LogOut } from 'lucide-react';

interface SidebarAdminProps {
  adminName?: string;
}

export function SidebarAdmin({ adminName = "Admin" }: SidebarAdminProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* SIDEBAR PC (Bleu nuit, arrondie à droite, s'étend au survol)      */}
      {/* ----------------------------------------------------------------- */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden md:flex flex-col justify-between fixed left-0 top-0 h-screen bg-slate-950 text-white transition-all duration-300 z-50 py-8 shadow-2xl rounded-r-[35px] ${
          isExpanded ? 'w-64 px-6' : 'w-20 px-4 items-center'
        }`}
      >
        <div className="flex flex-col gap-8 w-full">
          {/* Logo / Entrée Admin */}
          <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-orange-500">
              <User size={24} />
            </div>
            <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <p className="text-xs text-gray-400">Connecté en tant que</p>
              <p className="font-bold text-sm truncate">{adminName}</p>
            </div>
          </div>

          {/* Liens de navigation */}
          <nav className="flex flex-col gap-4 w-full">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors w-full group"
            >
              <User size={22} className="shrink-0 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className={`whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Profil Admin
              </span>
            </Link>

            <Link 
              href="/admin/dashboard/ajouter" 
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors w-full group"
            >
              <PlusCircle size={22} className="shrink-0 text-green-400 group-hover:scale-110 transition-transform" />
              <span className={`whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Ajouter un t-shirt
              </span>
            </Link>

            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors w-full group"
            >
              <Edit size={22} className="shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className={`whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Modifier les articles
              </span>
            </Link>
          </nav>
        </div>

        {/* Déconnexion */}
        <div className="w-full">
          <Link 
            href="/admin/login" 
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors w-full"
          >
            <LogOut size={22} className="shrink-0" />
            <span className={`whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Déconnexion
            </span>
          </Link>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* BARRE MOBILE (Parfaitement collée tout en bas, pleine largeur)     */}
      {/* ----------------------------------------------------------------- */}
      <nav 
        aria-label="Navigation mobile" 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-30px_80px_rgba(255,255,255,1)] py-3 px-12 flex justify-between items-end z-50 border-t border-gray-100"
      >
        {/* Option Profil */}
        <Link 
          href="/admin/dashboard" 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>

        {/* Bouton Plus au centre (Cercle vert, icône blanche, texte en bas) */}
        <Link 
          href="/admin/dashboard/ajouter" 
          className="flex flex-col items-center gap-1 group -mt-6"
        >
          <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-105 transition-transform">
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-semibold text-green-700">Ajouter</span>
        </Link>

        {/* Option Modifier */}
        <Link 
          href="/admin/dashboard" 
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-sky-600 transition-colors"
        >
          <Edit size={20} />
          <span className="text-[10px] font-medium">Modifier</span>
        </Link>
      </nav>
    </>
  );
}