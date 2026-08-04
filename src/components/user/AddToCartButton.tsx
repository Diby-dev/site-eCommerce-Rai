'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface AddToCartButtonProps {
  tshirtId: number;
}

export function AddToCartButton({ tshirtId }: AddToCartButtonProps) {
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkCartStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('panier')
        .select('id_panier')
        .eq('id_client', session.user.id)
        .eq('id_tshirt', tshirtId)
        .maybeSingle(); // Utiliser maybeSingle évite une erreur si aucun enregistrement n'est trouvé

      if (data) {
        setIsInCart(true);
      }
      setLoading(false);
    }

    checkCartStatus();
  }, [tshirtId]);

  const handleToggleCart = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    if (isInCart) {
      // Retirer du panier si on clique à nouveau
      const { error } = await supabase
        .from('panier')
        .delete()
        .eq('id_client', session.user.id)
        .eq('id_tshirt', tshirtId);

      if (error) {
        console.error("Erreur lors de la suppression du panier :", error.message);
      } else {
        setIsInCart(false);
      }
    } else {
      // Ajouter au panier en incluant la quantité (ex: 1) et date_panier
      const { error } = await supabase.from('panier').insert([
        {
          id_client: session.user.id,
          id_tshirt: tshirtId,
          quantite: 1, // Obligatoire selon la structure de ta table
          date_panier: new Date().toISOString(),
        }
      ]);

      if (error) {
        console.error("Erreur lors de l'ajout au panier :", error.message);
      } else {
        setIsInCart(true);
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
      onClick={handleToggleCart}
      className={`w-64 py-3 rounded font-bold border-2 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
        isInCart 
          ? 'bg-black text-white border-black hover:shadow-[0_0_15px_rgba(21,128,61,0.5)]' 
          : 'bg-white text-black border-slate-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]'
      }`}
    >
      {isInCart ? (
        <>
          <span>Ajouté au panier</span>
          <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Check size={14} strokeWidth={3} />
          </div>
        </>
      ) : (
        "Ajouter au panier"
      )}
    </button>
  );
}