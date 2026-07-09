'use client';
import Image from 'next/image';
import { Tshirt } from '@/types/database';
import { motion } from "motion/react";

interface ProductCardProps {
  tshirt: Tshirt;
}

const formatCfaPrice = (value: number) =>
  Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const ProductCard = ({ tshirt }: ProductCardProps) => {
  // Remplace 'ton-bucket-name' par le nom de ton bucket dans Supabase Storage
  const STORAGE_URL = "https://mkqzvhtwopuikjtpxcce.supabase.co/storage/v1/object/public/images-tshirts/";
  
  const imageUrl = tshirt.image_url 
    ? (tshirt.image_url.startsWith('http') ? tshirt.image_url : `${STORAGE_URL}${tshirt.image_url}`)
    : '/placeholder-tshirt.png'; // Assure-toi d'avoir une image par défaut dans ton dossier public

  return (
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 1 }} className="bg-white border border-gray-100 hover:scale-105 rounded-3xl overflow-hidden hover:filter-[drop-shadow(0px_10px_4px_rgba(0,0,0,0.8))] filter-[drop-shadow(0px_1px_2px_rgba(0,0,0,0.8))] transition-all duration-300 flex flex-col group">
      <div
  className="
    absolute
    top-[-50%]
    left-[-120%]
    h-[220%]
    w-[40%]
    rotate-25
    bg-linear-to-b
    from-transparent
    via-white/60
    to-transparent
    transition-all
    duration-700
    group-hover:left-[140%]
    pointer-events-none
    z-20
  "
/>
      {/* Zone Image : responsive carré */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-gray-50">
        <Image 
          src={imageUrl} 
          alt={tshirt.nom_tshirt} 
          fill 
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Zone Texte */}
      <div className="p-4 md:p-5 flex flex-col grow">
        <h3 className="text-gray-900 font-semibold text-sm md:text-base line-clamp-1">
          {tshirt.nom_tshirt}
        </h3>
        
        <div className="flex justify-between items-center mt-2">
            <p className="text-blue-900 font-bold text-lg">
            {formatCfaPrice(tshirt.prix_tshirt)} FCFA
            </p>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Stock : {tshirt.nombre_tshirt}
        </p>
      </div>
    </motion.div>
  );
};
