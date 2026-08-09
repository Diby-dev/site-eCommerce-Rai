'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserName(userId: string) {
      const { data, error } = await supabase
        .from('client')
        .select('nom_client')
        .eq('id_client', userId)
        .single();

      if (error) {
        console.error('Erreur Supabase :', error);
        return;
      }

      if (data) {
        setUserName(data.nom_client);
      }
    }

    // Vérifie la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) {
        fetchUserName(session.user.id);
      }
    });

    // Écoute les changements de connexion/déconnexion
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        fetchUserName(session.user.id);
      } else {
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <span className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              priority
              className="w-14 md:w-15 h-auto"
            />
            <p className="text-amber-50 font-bold">KINGSHOP</p>
          </span>
        </Link>

        {/* LIENS */}
        <div className="flex items-center gap-6">

          <Link
            href={session ? '/espace-client' : '/inscription'}
            className="flex items-center gap-2 hover:text-blue-400 text-[18px] font-bold transition-colors"
          >
            <User size={20} />
            <span className="hidden md:inline text-amber-50">
              {session ? (userName || 'Mon compte') : 'Mon espace'}
            </span>
          </Link>

          
        </div>

      </div>
    </nav>
  );
};