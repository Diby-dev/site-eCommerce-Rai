'use client';

import React from 'react';

export const CommentSection = () => {
  return (
    <div className="bg-sky-100 px-7 lg:px-15 py-10">
        <div className="text-center mb-10">
            <h2 className="text-orange-600 font-medium text-sm">Les Avis sur nos services</h2>
            <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
              Quelques retours de nos clients
            </h1>
          </div>
      {/* Section Avis & Commentaires */}
      <div className="pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Avis & Commentaires</h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex text-orange-500">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-sm">{star}</span>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2 font-medium">4.8 sur 5 (basé sur 150 avis)</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => alert("Fonctionnalité bientôt disponible !")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Laisser un commentaire</span>
          </button>
        </div>

        {/* Liste des commentaires */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
              AK
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-semibold text-gray-900 text-sm">Aya Kouamé</h5>
                <span className="text-xs text-gray-400">Il y a 2 jours</span>
              </div>
              <div className="flex text-orange-500 mb-1 text-xs">★★★★★</div>
              <p className="text-gray-600 text-sm">
                Superbe collection de t-shirts ! La qualité du tissu est vraiment au rendez-vous. Livraison rapide à Abidjan.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">
              KB
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-semibold text-gray-900 text-sm">Koffi Brice</h5>
                <span className="text-xs text-gray-400">Il y a 5 jours</span>
              </div>
              <div className="flex text-orange-500 mb-1 text-xs">★★★★☆</div>
              <p className="text-gray-600 text-sm">
                Le processus de commande est ultra fluide et le design des t-shirts est top. Bravo à l&aposequipe !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};