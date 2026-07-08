"use client";

import { useEffect, useRef } from "react";

export const Video = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // On tente de lire, et on gère la promesse pour éviter l'erreur
          video.play().catch((error) => {
            console.log("Lecture automatique bloquée ou interrompue:", error);
          });
        } else {
          // On s'assure de mettre en pause proprement
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  if (videoRef.current) {
    observer.observe(videoRef.current);
  }

  return () => observer.disconnect();
}, []);

  return (
    <video
      ref={videoRef}
      className="w-full h-auto rounded-[30px]"
      muted // Obligatoire pour l'autoplay
      playsInline
      loop
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne supporte pas la vidéo.
    </video>
  );
};