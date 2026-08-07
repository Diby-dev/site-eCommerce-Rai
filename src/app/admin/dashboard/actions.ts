'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { revalidatePath } from 'next/cache';

export async function deleteTshirt(id: number) {
  try {
    if (typeof id !== 'number' || !Number.isInteger(id) || id < 1) {
      return { success: false, error: 'Identifiant de produit invalide.' };
    }

    // Une Server Action peut être appelée sans passer par l'interface :
    // l'autorisation doit donc être contrôlée à nouveau ici.
    const { supabase } = await requireAdmin();

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
