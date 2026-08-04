'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface RecordHistoryProps {
  tshirtId: number;
}

export function RecordHistory({ tshirtId }: RecordHistoryProps) {
  useEffect(() => {
    async function saveHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("Utilisateur connecté :", session.user.id);
        console.log("Tentative d'enregistrement du t-shirt :", tshirtId);

        const { error } = await supabase.from('historique').insert([
          {
            id_client: session.user.id,
            id_tshirt: tshirtId,
            type_action: 'visite', // Mets ici le mot exact attendu par ta contrainte
            date_action: new Date().toISOString(),
          }
        ]);

        if (error) {
          console.error("Erreur lors de l'insertion dans l'historique :", error.message);
        } else {
          console.log("Historique enregistré avec succès !");
        }
      } else {
        console.log("Aucun utilisateur connecté, historique non enregistré.");
      }
    }

    saveHistory();
  }, [tshirtId]);

  return null;
}