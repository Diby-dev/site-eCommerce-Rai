"use client";

import { Share2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const Conectshar = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserName(userId: string) {
      const { data, error } = await supabase
        .from('client')
        .select('nom_client')
        .eq('id_client', userId)
        .single();
      
      if (error) {
        console.error("Erreur Supabase :", error);
      } else if (data) {
        setUserName(data.nom_client);
      }
      setLoading(false);
    }

    // 1. Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserName(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserName(session.user.id);
      } else {
        setUserName(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = () => {
    if (session) {
      router.push("/espace-client");
    } else {
      router.push("/inscription");
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "E-Shirt-R",
          text: "Découvrez notre collection de t-shirts de qualité !",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Partage annulé", error);
      }
    } else {
      alert("Le partage n'est pas pris en charge sur ce navigateur.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto" id="partager">
      <button 
        onClick={handleShareClick}
        className="border border-gray-400 rounded-3xl p-6 shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-3xl"
      >
        <Share2 className="text-orange-500 w-12 h-12" />
        <h3 className="font-bold text-2xl text-gray-900">Partager</h3>
        <p className="text-black text-sm">Faites connaître le site à<br/>vos proches</p>
      </button>

      <button 
        onClick={handleAuthClick}
        className="border border-gray-400 rounded-3xl p-6 shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-3xl"
      >
        <User className="text-orange-500 w-12 h-12" />
        <h3 className="font-bold text-2xl text-gray-900 capitalize">
          {loading ? "Chargement..." : (session ? (userName || "Mon compte") : "Connecter")}
        </h3>
        <p className="text-black text-sm">
          {session ? "Accédez à votre espace client" : "Connectez-vous pour plus \n de fonctionnalités"}
        </p>
      </button>
    </div>
  );
};