'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { User, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const images = ['/1.webp', '/2.webp', '/3.webp', '/4.webp'];

export function HeroImage() {
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 10000, stopOnInteraction: false }), []);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplayPlugin]);

  useEffect(() => {
    // On définit la fonction ici, à l'intérieur du useEffect
    async function fetchUserName(userId: string) {
    const { data, error } = await supabase
      .from('client') // Nom exact de ta table
      .select('nom_client') // Colonne à récupérer
      .eq('id_client', userId) // Vérifie que ta colonne s'appelle bien id_client
      .single();
    
    if (error) {
      console.error("Erreur Supabase :", error); // Regarde la console pour voir le détail de l'erreur
      return;
    }
    
    if (data) setUserName(data.nom_client);
  }

    // 1. Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserName(session.user.id);
    });

    // 2. Écouter les changements
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserName(session.user.id);
      } else {
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Dépendances vides : ok car la fonction est déclarée dedans

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh]">
      {/* 1. Le Carrousel */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div key={index} className="relative h-full w-full flex-[0_0_100%] min-w-0">
              <Image src={src} alt={`Slide ${index + 1}`} fill priority={index === 0} className="object-cover object-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay sombre */}
<div className="absolute inset-0 bg-black/35 z-1" />

{/* Vignette */}
<div
  className="absolute inset-0 z-2"
  style={{
    background:
      "radial-gradient(circle, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.75) 100%)",
  }}
/>

      {/* 2. Le Logo */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Image src="/logo.png" alt="Logo" width={200} height={200} priority className="w-16 md:w-24 lg:w-25 h-auto drop-shadow-md" />
      </div>

      {/* 3. Les Liens */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex gap-3 md:gap-4">
        <Link 
          href={session ? "/espace-client" : "/inscription"} 
          className="flex items-center gap-2 text-white font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-sm hover:bg-black/60 transition-all"
        >
          <User size={16} />
          <span className="">
            {session ? (userName || "Mon compte") : "Mon espace"}
          </span>
        </Link>
        <Link href="/espace-client" className="flex items-center gap-2 text-white font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-sm hover:bg-black/60 transition-all">
          <ShoppingBag size={16} />
          <span className="">Panier</span>
        </Link>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-4">
        <h5 className="text-white font-serif italic text-xl md:text-2xl lg:text-4xl text-center leading-tight filter-[drop-shadow(0px_8px_4px_rgba(0,0,0,0.8))]">
          Découvrez toutes nos variétés de<br/>t-shirts de qualité
        </h5>
      </div>
    </div>
  );
}