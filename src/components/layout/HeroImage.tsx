'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.webp'];

export function HeroImage() {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 10000, stopOnInteraction: false }), []);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplayPlugin]);

  return (
    // Ce conteneur principal reste en 'relative' pour englober tout
    <div className="relative w-full h-[60vh] md:h-[85vh]">
      
      {/* 1. Le Carrousel est le fond qui défile */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div key={index} className="relative h-full w-full flex-[0_0_100%] min-w-0">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Le Logo (Immobile par-dessus) */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Image src="/logo.png" alt="Logo" width={200} height={200} priority className="w-16 md:w-24 lg:w-25 h-auto drop-shadow-md" />
      </div>

      {/* 3. Les Liens (Immobiles par-dessus) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex gap-3 md:gap-4">
        <Link href="/mon-espace" className="flex items-center gap-2 text-white font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-sm hover:bg-black/60 transition-all">
          <Image src="/user.png" alt="Espace" width={16} height={16} />
          <span className="hidden md:inline">Mon espace</span>
        </Link>
        <Link href="/cart" className="flex items-center gap-2 text-white font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-sm hover:bg-black/60 transition-all">
          <Image src="/shop.png" alt="Panier" width={16} height={16} />
          <span className="hidden md:inline">Panier</span>
        </Link>
      </div>
    </div>
  );
}