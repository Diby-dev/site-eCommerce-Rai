"use client"; // C'est ici que la magie opère

import { Share2, User } from "lucide-react";

export const Conectshar = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
      <button className="border border-gray-400 rounded-3xl p-6 shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-3xl">
  <Share2 className="text-orange-500 w-12 h-12" />
  <h3 className="font-bold text-2xl text-gray-900">Partager</h3>
  <p className="text-black text-sm">Faites connaître le site à<br/>vos proches</p>
</button>

<button className="border border-gray-400 rounded-3xl p-6 shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-3xl">
  <User className="text-orange-500 w-12 h-12" />
  <h3 className="font-bold text-2xl text-gray-900">Connecter</h3>
  <p className="text-black text-sm">Connectez-vous pour plus <br/> de fonctionnalités</p>
</button>
    </div>
  );
};