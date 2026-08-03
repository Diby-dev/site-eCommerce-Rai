'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { User } from '@supabase/supabase-js';
import { Navbar } from '@/components/user/Navbar';
import { UserCircle, Heart, ShoppingCart, History, LogOut } from 'lucide-react';

interface ClientProfile { nom_client: string; contact_client: string; }
type Tab = 'profil' | 'favoris' | 'panier' | 'historique';

export default function EspaceClient() {
  const [user, setUser] = useState<User | null>(null);
  const [clientData, setClientData] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profil');
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      const { data: client } = await supabase.from('client').select('nom_client, contact_client').eq('id_client', session.user.id).single();
      if (client) setClientData(client as ClientProfile);
      setLoading(false);
    }
    getProfile();
  }, [router]);

  // Classes pour le menu (Adaptatif)
  const menuClass = (tab: Tab) => 
    `flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium whitespace-nowrap ${
      activeTab === tab ? 'bg-orange-500 text-white' : 'text-blue-100 hover:bg-blue-800'
    }`;

  if (loading) return <div className="flex justify-center items-center min-h-[70vh]">Chargement...</div>;

  return (
    <>
    <Navbar />
    <main className="bg-[url('/fond.jpg')] bg-cover bg-center bg-no-repeat mt-20">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-8">
        
        {/* SIDEBAR / NAVBAR ADAPTATIVE */}
        <aside className="bg-slate-900 rounded-2xl shadow-xl p-4 lg:p-5 h-fit">
          <nav className="flex lg:flex-col gap-2 lg:space-y-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {[
              { id: 'profil' as Tab, label: 'Profil', icon: <UserCircle size={20} /> },
              { id: 'favoris' as Tab, label: 'Favoris', icon: <Heart size={20} /> },
              { id: 'panier' as Tab, label: 'Panier', icon: <ShoppingCart size={20} /> },
              { id: 'historique' as Tab, label: 'Historique', icon: <History size={20} /> },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={menuClass(item.id)}>
                {item.icon} {item.label}
              </button>
            ))}
            
            
            
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
              className="flex items-center gap-2 px-4 py-3 text-red-300 hover:text-red-100 transition whitespace-nowrap"
            >
              <LogOut size={20} /> Déconnexion
            </button>
          </nav>
        </aside>

        {/* CONTENU */}
        <section className="bg-white rounded-2xl shadow-lg border filter-[drop-shadow(0px_8px_4px_rgba(0,0,0,0.8))] p-6 lg:p-8 min-h-100">
          <h1 className="text-3xl text-slate-950 font-bold mb-6">Bonjour {clientData?.nom_client}</h1>
          
          {activeTab === 'profil' && (
            <div className="grid sm:grid-cols-2 gap-6 text-slate-950">
              {[ { l: 'Nom', v: clientData?.nom_client }, { l: 'Email', v: user?.email }, { l: 'Téléphone', v: clientData?.contact_client } ].map(f => (
                <div key={f.l}>
                  <p className="text-slate-950 text-xs uppercase tracking-wider">{f.l}</p>
                  <p className="font-semibold text-lg">{f.v}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab !== 'profil' && <div className="py-16 text-center text-gray-500">Contenu de {activeTab} à venir...</div>}
        </section>
      </div>
    </div>
  </main>

  <Footer />
  
  </>
  );
}
