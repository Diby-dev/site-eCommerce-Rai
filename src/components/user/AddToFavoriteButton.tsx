'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react'; // Icône moderne fournie par Lucide

interface AddToFavoriteButtonProps {
  tshirtId: number;
}

export function AddToFavoriteButton({ tshirtId }: AddToFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier au chargement si le produit est déjà dans les favoris
  useEffect(() => {
    async function checkFavoriteStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favori')
        .select('id_favori')
        .eq('id_client', session.user.id)
        .eq('id_tshirt', tshirtId)
        .single();

      if (data) {
        setIsFavorite(true);
      }
      setLoading(false);
    }

    checkFavoriteStatus();
  }, [tshirtId]);

  const handleToggleFavorite = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    if (isFavorite) {
      // Retirer des favoris si on clique à nouveau dessus
      const { error } = await supabase
        .from('favori')
        .delete()
        .eq('id_client', session.user.id)
        .eq('id_tshirt', tshirtId);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      // Ajouter aux favoris
      const { error } = await supabase.from('favori').insert([
        {
          id_client: session.user.id,
          id_tshirt: tshirtId,
          date_favori: new Date().toISOString(),
        }
      ]);

      if (!error) {
        setIsFavorite(true);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <button disabled className="w-64 bg-white text-black py-3 rounded font-bold border-2 border-slate-500 opacity-50">
        Chargement...
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggleFavorite}
      className={`w-64 py-3 rounded font-bold border-2 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
        isFavorite 
          ? 'bg-black text-white border-black hover:shadow-[0_0_15px_rgba(21,128,61,0.5)]' 
          : 'bg-white text-black border-slate-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]'
      }`}
    >
      {isFavorite ? (
        <>
          <span>Ajouté aux favoris</span>
          {/* Icône de check ronde, moderne, verte un peu plus sombre */}
          <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Check size={14} strokeWidth={3} />
          </div>
        </>
      ) : (
        "Ajouter aux favoris"
      )}
    </button>
  );
}