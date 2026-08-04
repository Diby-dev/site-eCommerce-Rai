'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { User } from '@supabase/supabase-js';
import { Navbar } from '@/components/user/Navbar';
import { UserCircle, Heart, ShoppingCart, History, LogOut } from 'lucide-react';
import { ProductCard } from '@/components/home/ProductCard';
import { Tshirt } from '@/types/database';
import Link from 'next/link';

interface ClientProfile { nom_client: string; contact_client: string; }
type Tab = 'profil' | 'favoris' | 'panier' | 'historique';

export default function EspaceClient() {
  const [user, setUser] = useState<User | null>(null);
  const [clientData, setClientData] = useState<ClientProfile | null>(null);
  const [historiqueTshirts, setHistoriqueTshirts] = useState<Tshirt[]>([]);
  const [favorisTshirts, setFavorisTshirts] = useState<Tshirt[]>([]);
  const [panierTshirts, setPanierTshirts] = useState<Tshirt[]>([]);
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

  // Charger l'historique
  useEffect(() => {
    async function fetchHistorique() {
      if (activeTab === 'historique' && user) {
        const { data, error } = await supabase
          .from('historique')
          .select(`
            id_tshirt,
            date_action,
            tshirt:id_tshirt (*)
          `)
          .eq('id_client', user.id)
          .order('date_action', { ascending: false });

        if (!error && data) {
          const tshirtsList: Tshirt[] = data
            .map((item: Record<string, unknown>) => {
              const t = item.tshirt;
              if (Array.isArray(t)) return (t[0] as Tshirt) || null;
              return (t as Tshirt) || null;
            })
            .filter((t): t is Tshirt => t !== null && t !== undefined);

          const uniqueTshirts = Array.from(
            new Map(tshirtsList.map((t: Tshirt) => [t.id_tshirt, t])).values()
          ) as Tshirt[];

          setHistoriqueTshirts(uniqueTshirts);
        }
      }
    }
    fetchHistorique();
  }, [activeTab, user]);

  // Charger les favoris
  useEffect(() => {
    async function fetchFavoris() {
      if (activeTab === 'favoris' && user) {
        const { data, error } = await supabase
          .from('favori')
          .select(`
            id_tshirt,
            date_favori,
            tshirt:id_tshirt (*)
          `)
          .eq('id_client', user.id)
          .order('date_favori', { ascending: false });

        if (!error && data) {
          const tshirtsList: Tshirt[] = data
            .map((item: Record<string, unknown>) => {
              const t = item.tshirt;
              if (Array.isArray(t)) return (t[0] as Tshirt) || null;
              return (t as Tshirt) || null;
            })
            .filter((t): t is Tshirt => t !== null && t !== undefined);

          setFavorisTshirts(tshirtsList);
        }
      }
    }
    fetchFavoris();
  }, [activeTab, user]);

  // Charger le panier
  useEffect(() => {
    async function fetchPanier() {
      if (activeTab === 'panier' && user) {
        const { data, error } = await supabase
          .from('panier')
          .select(`
            id_tshirt,
            tshirt:id_tshirt (*)
          `)
          .eq('id_client', user.id);

        if (!error && data) {
          const tshirtsList: Tshirt[] = data
            .map((item: Record<string, unknown>) => {
              const t = item.tshirt;
              if (Array.isArray(t)) return (t[0] as Tshirt) || null;
              return (t as Tshirt) || null;
            })
            .filter((t): t is Tshirt => t !== null && t !== undefined);

          setPanierTshirts(tshirtsList);
        }
      }
    }
    fetchPanier();
  }, [activeTab, user]);

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
            
            {/* SIDEBAR */}
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

              {activeTab === 'favoris' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mes produits favoris</h2>
                  {favorisTshirts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorisTshirts.map((tshirt) => (
                        <Link 
                          key={tshirt.id_tshirt} 
                          href={`/produits/${tshirt.id_tshirt}`}
                          className="block transition-transform duration-300"
                        >
                          <ProductCard tshirt={tshirt} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-12 text-center">Pas de t-shirt dans vos favoris pour le moment.</p>
                  )}
                </div>
              )}

              {activeTab === 'panier' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Panier</h2>
                  {panierTshirts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {panierTshirts.map((tshirt) => (
                        <Link 
                          key={tshirt.id_tshirt} 
                          href={`/produits/${tshirt.id_tshirt}`}
                          className="block transition-transform duration-300"
                        >
                          <ProductCard tshirt={tshirt} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-12 text-center">Votre panier est vide pour le moment.</p>
                  )}
                </div>
              )}

              {activeTab === 'historique' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Vos produits consultés</h2>
                  {historiqueTshirts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {historiqueTshirts.map((tshirt) => (
                        <Link 
                          key={tshirt.id_tshirt} 
                          href={`/produits/${tshirt.id_tshirt}`}
                          className="block transition-transform duration-300"
                        >
                          <ProductCard tshirt={tshirt} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-12 text-center">Vous n&apos;avez consulté aucun t-shirt pour le moment.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}