'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteTshirt } from './actions';

interface DeleteButtonProps {
  id: number;
  nom: string;
}

export default function DeleteButton({ id, nom }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le T-shirt "${nom}" ?`);
    if (!confirmed) return;

    setLoading(true);
    const result = await deleteTshirt(id);

    if (!result.success) {
      alert(`Erreur lors de la suppression : ${result.error}`);
      setLoading(false);
    }
    // Si c'est un succès, revalidatePath rafraîchira automatiquement la liste.
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
      title="Supprimer"
    >
      <Trash2 size={18} />
    </button>
  );
}
