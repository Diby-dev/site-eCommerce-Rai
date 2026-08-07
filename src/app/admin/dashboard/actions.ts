'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteTshirt(id: string) {
  try {
    // 1. Récupérer le t-shirt pour trouver l'URL de l'image
    const { data: tshirt, error: fetchError } = await supabase
      .from('tshirt')
      .select('image_url')
      .eq('id_tshirt', id)
      .single();

    if (fetchError) {
      console.error("Erreur lors de la récupération du t-shirt :", fetchError.message);
      return { success: false, error: fetchError.message };
    }

    // 2. Supprimer l'image du Storage Supabase si elle existe
    if (tshirt?.image_url) {
      try {
        const urlParts = tshirt.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];

        if (fileName) {
          await supabase.storage
            .from('images-tshirts')
            .remove([fileName]);
        }
      } catch (storageErr) {
        console.error("Erreur lors de la suppression de l'image du storage :", storageErr);
      }
    }

    // 3. Supprimer la ligne de la base de données
    const { error: deleteError } = await supabase
      .from('tshirt')
      .delete()
      .eq('id_tshirt', id);

    if (deleteError) {
      console.error("Erreur lors de la suppression de la base :", deleteError.message);
      return { success: false, error: deleteError.message };
    }

    // 4. Rafraîchir le cache du dashboard pour refléter la suppression instantanément
    revalidatePath('/admin/dashboard');
    return { success: true };

  } catch (err) {
    console.error("Erreur inattendue :", err);
    return { success: false, error: "Erreur serveur inattendue." };
  }
}