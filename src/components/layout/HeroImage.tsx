'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.webp'];

export function HeroImage() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({ delay: 10000, stopOnInteraction: false })]
  );

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden" ref={emblaRef}>
      
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
  <Image 
    src="/logo.png" 
    alt="Logo" 
    width={200} // Taille de base pour le calcul du ratio
    height={200}
    priority 
    // w-16 sur mobile, w-25 sur tablette, w-24 sur PC
    className="w-16 md:w-25 lg:w-24 h-auto"
  />
</div>

      <div className="flex h-full">
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-full flex-[0_0_100%]">
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
  );
}