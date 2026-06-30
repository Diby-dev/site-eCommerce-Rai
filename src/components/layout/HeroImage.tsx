'use client'; // Important car on utilise des hooks React

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
      <div className="flex h-full">
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-full flex-[0_0_100%]">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              priority={index === 0} // Charge uniquement la 1ère image en priorité
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}