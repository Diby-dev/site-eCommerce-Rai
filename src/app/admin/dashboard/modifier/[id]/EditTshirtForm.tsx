'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import Image from 'next/image';
import { Tshirt } from '@/types/database';

interface EditTshirtFormProps {
  tshirt: Tshirt;
}

export default function EditTshirtForm({ tshirt }: EditTshirtFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialisation des états avec les données existantes du T-shirt
  const [nom, setNom] = useState(tshirt.nom_tshirt || '');
  const [prix, setPrix] = useState(tshirt.prix_tshirt ? tshirt.prix_tshirt.toString() : '');
  const [couleur, setCouleur] = useState(tshirt.couleur_tshirt || '');
  const [taille, setTaille] = useState(tshirt.taille_tshirt || '');
  const [nombre, setNombre] = useState(tshirt.nombre_tshirt ? tshirt.nombre_tshirt.toString() : '');
  const [detail, setDetail] = useState(tshirt.detail_tshirt || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const STORAGE_URL = "https://mkqzvhtwopuikjtpxcce.supabase.co/storage/v1/object/public/images-tshirts/";
  
  const currentImageUrl = tshirt.image_url 
    ? (tshirt.image_url.startsWith('http') ? tshirt.image_url : `${STORAGE_URL}${tshirt.image_url}`)
    : '/placeholder-tshirt.png';

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let imageUrl = tshirt.image_url; // On garde l'ancienne par défaut

      // 1. Si une nouvelle image a été sélectionnée, on l'upload et on supprime éventuellement l'ancienne
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images-tshirts')
          .upload(filePath, imageFile);

        if (uploadError) {
          setErrorMessage(`Erreur image : ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('images-tshirts')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Mise à jour de la table 'tshirt'
      const { error: updateError } = await supabase
        .from('tshirt')
        .update({
          nom_tshirt: nom,
          prix_tshirt: Math.round(Number(prix)),
          couleur_tshirt: couleur,
          taille_tshirt: taille,
          nombre_tshirt: nombre ? parseInt(nombre, 10) : 0,
          detail_tshirt: detail,
          image_url: imageUrl,
        })
        .eq('id_tshirt', tshirt.id_tshirt);

      if (updateError) {
        setErrorMessage(`Erreur : ${updateError.message}`);
        setLoading(false);
        return;
      }

      setSuccessMessage('T-shirt modifié avec succès !');
      setLoading(false);

      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error("Erreur inattendue :", err);
      setErrorMessage("Une erreur est survenue lors de la modification.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 lg:p-10">
      {errorMessage && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-600 text-sm p-4 rounded-xl text-center font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-600 text-sm p-4 rounded-xl text-center font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        {/* Nom */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Nom du T-shirt</label>
          <input 
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        {/* Prix */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Prix (FCFA)</label>
          <input 
            type="number"
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        {/* Couleur & Taille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Couleur</label>
            <input 
              type="text"
              required
              value={couleur}
              onChange={(e) => setCouleur(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Taille</label>
            <input 
              type="text"
              value={taille}
              onChange={(e) => setTaille(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Stock initial</label>
          <input 
            type="number"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        {/* Détail */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Détail / Description</label>
          <textarea 
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Image actuelle + Remplacement */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Image actuelle</label>
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mb-2">
            <Image src={currentImageUrl} alt={nom} fill className="object-cover" />
          </div>

          <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">Remplace image (Optionnel)</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all cursor-pointer"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Save size={20} />
          <span>{loading ? "Mise à jour..." : "Enregistrer les modifications"}</span>
        </button>
      </form>
    </div>
  );
}