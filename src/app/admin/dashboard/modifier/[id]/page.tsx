import { supabase } from '@/lib/supabase';
import { SidebarAdmin } from '@/app/admin/dashboard/SidebarAdmin';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditTshirtForm from './EditTshirtForm'; // Le composant client qu'on va créer juste en dessous

export default async function EditTshirtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Récupération du T-shirt à modifier depuis Supabase
  const { data: tshirt, error } = await supabase
    .from('tshirt')
    .select('*')
    .eq('id_tshirt', id)
    .single();

  if (error || !tshirt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarAdmin adminName="Administrateur" />

      <main className="flex-1 md:ml-20 p-6 lg:p-12 pb-24 md:pb-12 transition-all">
        <div className="mb-8">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span>Retour au tableau de bord</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Modifier le T-shirt
          </h1>
          <p className="text-gray-500 mt-1">
            Modifiez les informations de article <span className="font-semibold text-gray-800">{tshirt.nom_tshirt}</span>.
          </p>
        </div>

        {/* Formulaire client de modification */}
        <EditTshirtForm tshirt={tshirt} />
      </main>
    </div>
  );
}