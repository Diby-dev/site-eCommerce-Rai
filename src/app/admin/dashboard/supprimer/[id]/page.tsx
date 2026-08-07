import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function DeleteTshirtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Récupérer d'abord le t-shirt pour obtenir le lien/nom de son image
  const { data: tshirt } = await supabase
    .from('tshirt')
    .select('image_url')
    .eq('id_tshirt', id)
    .single();

  if (tshirt?.image_url) {
    // Extraire le nom du fichier du Storage à partir de l'URL publique
    try {
      const urlParts = tshirt.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      if (fileName) {
        // 2. Supprimer l'image du bucket Supabase 'images-tshirts'
        await supabase.storage
          .from('images-tshirts')
          .remove([fileName]);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image du storage :", err);
    }
  }

  // 3. Supprimer la ligne de la base de données
  await supabase
    .from('tshirt')
    .delete()
    .eq('id_tshirt', id);

  // 4. Rediriger vers le tableau de bord
  redirect('/admin/dashboard');
}