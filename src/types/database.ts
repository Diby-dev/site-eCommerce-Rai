export interface Tshirt {
  id_tshirt: number;
  nom_tshirt: string;
  prix_tshirt: number;
  couleur_tshirt: string;
  taille_tshirt?: string | null;
  image_url?: string | null;
  statut_tshirt: 'disponible' | 'stock épuisé';
  nombre_tshirt: number;
  // ... autres champs si besoin
}