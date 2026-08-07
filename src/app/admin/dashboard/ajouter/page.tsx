'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { SidebarAdmin } from '../SidebarAdmin';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AjouterTshirtPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // États des champs du formulaire
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [couleur, setCouleur] = useState('');
  const [taille, setTaille] = useState('');
  const [nombre, setNombre] = useState('');
  const [detail, setDetail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let imageUrl = '';

      // 1. Si un fichier image a été sélectionné, on l'upload d'abord dans le Storage Supabase
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images-tshirts')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Erreur d'upload de l'image :", uploadError.message);
          setErrorMessage(`Erreur image : ${uploadError.message}`);
          setLoading(false);
          return;
        }

        // Récupérer l'URL publique de l'image stockée
        const { data: publicUrlData } = supabase.storage
          .from('images-tshirts')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insertion dans la table 'tshirt' avec tous les nouveaux champs requis
      const { error } = await supabase.from('tshirt').insert([
        {
          nom_tshirt: nom,
          prix_tshirt: Math.round(Number(prix)),
          couleur_tshirt: couleur,
          taille_tshirt: taille,
          nombre_tshirt: nombre ? parseInt(nombre, 10) : 0,
          detail_tshirt: detail,
          image_url: imageUrl, 
        },
      ]);

      if (error) {
        console.error("Erreur d'insertion Supabase :", error.message);
        setErrorMessage(`Erreur : ${error.message}`);
        setLoading(false);
        return;
      }

      setSuccessMessage('T-shirt ajouté avec succès !');
      setLoading(false);

      // Redirection vers le dashboard après un court instant
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error("Erreur inattendue :", err);
      setErrorMessage("Une erreur est survenue lors de l'ajout.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Responsive */}
      <SidebarAdmin adminName="Administrateur" />

      {/* Corps de la page */}
      <main className="flex-1 md:ml-20 p-6 lg:p-12 pb-24 md:pb-12 transition-all">
        
        {/* En-tête et retour */}
        <div className="mb-8">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span>Retour au tableau de bord</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Ajouter un nouveau T-shirt
          </h1>
          <p className="text-gray-500 mt-1">
            Remplissez les informations ci-dessous pour référencer un nouvel article dans la boutique.
          </p>
        </div>

        {/* Formulaire */}
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Nom du t-shirt */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                Nom du T-shirt
              </label>
              <input 
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: T-shirt Oversize Édition Limitée"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Prix */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                Prix (FCFA / €)
              </label>
              <input 
                step="0.01"
                required
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                placeholder="Ex: 15000"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Grille Couleur & Taille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                  Couleur
                </label>
                <input 
                  type="text"
                  required
                  value={couleur}
                  onChange={(e) => setCouleur(e.target.value)}
                  placeholder="Ex: Noir, Blanc..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                  Taille
                </label>
                <input 
                  type="text"
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  placeholder="Ex: M, L, XL..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Nombre / Stock */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                Nombre (Stock initial)
              </label>
              <input 
                
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ex: 50"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Détail */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                Détail / Description
              </label>
              <textarea 
                rows={4}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Détails sur la matière, la coupe, les tailles disponibles..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Fichier image (Parcourir) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-gray-700 font-bold">
                Image du T-shirt (Parcourir)
              </label>
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

            {/* Bouton de soumission */}
            <button 
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <PlusCircle size={20} />
              <span>{loading ? "Enregistrement en cours..." : "Enregistrer le T-shirt"}</span>
            </button>

          </form>

        </div>

      </main>
    </div>
  );
}