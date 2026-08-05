'use client';

import { useState } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

interface BuyModalButtonProps {
  tshirtName: string;
}

export function BuyModalButton({ tshirtName }: BuyModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Numéro de téléphone cible (avec indicatif pays pour WhatsApp, ex: Côte d'Ivoire +225)
  const phoneNumber = '+2250575074820';
  const whatsappNumber = '2250575074820'; // Format international sans le + pour l'API WhatsApp
  const message = `Bonjour, je souhaite acheter le t-shirt ${tshirtName}.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const phoneUrl = `tel:${phoneNumber}`;

  return (
    <>
      {/* Bouton principal Acheter */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-orange-600 text-white py-4 rounded font-bold text-lg hover:bg-orange-700 transition-all shadow-md"
      >
        ACHETER MAINTENANT
      </button>

      {/* Fenêtre Modale (Popup) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center border border-gray-100">
            
            {/* Bouton de fermeture (Croix) */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={22} />
            </button>

            {/* Titre au centre */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-8 mt-2 px-6">
              Contactez-nous pour choisir le mode de paiement<br/>(<span className='text-green-600'>sur place</span> ou <span className='text-green-600'>par livraison</span>)
            </h3>

            {/* Options (WhatsApp et Téléphone) */}
            <div className="flex flex-col gap-4 w-full">
              {/* Option WhatsApp */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <MessageCircle size={22} />
                <span>WhatsApp</span>
              </a>

              {/* Option Téléphone */}
              <a 
                href={phoneUrl}
                className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-black text-white py-3.5 px-4 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Phone size={20} />
                <span>Téléphone</span>
              </a>
            </div>
                <span className='mt-6 text-center'>Nous somme disponibles tous les jours de 8h à 18h. <br /> N&apos;hésitez pas à nous contacter !</span>
          </div>
        </div>
      )}
    </>
  );
}