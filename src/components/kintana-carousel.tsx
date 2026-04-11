// components/kintana/kintana-hero-carousel-elegant.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const images = [
  { id: 1, src: "/kintana/kintana.jpg", alt: "Kintana" },
  { id: 2, src: "/kintana/fitiavana.jpg", alt: "Kintana" },
  { id: 3, src: "/kintana/bogosy.jpg", alt: "Kintana" },
]

export const KintanaHeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[400px] sm:h-[450px] md:h-[600px] lg:h-[610px] overflow-hidden">
        {/* Images avec transition slide */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 700ms ease-in-out",
          }}
        >
          <div className="flex w-full h-full">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative w-full h-full flex-shrink-0"
                style={{ width: "100%" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Overlay avec gradient - Z-index plus élevé */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

        {/* Texte avec animation d'entrée - Z-index plus élevé */}
        <div className="absolute inset-0 z-20 h-full flex flex-col items-center justify-end pb-20 text-center px-4">
          <div
            key={currentIndex}
            className="max-w-4xl mx-auto space-y-4 md:space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-700"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
              Kintana
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg">
              "Brillons ensemble pour un avenir meilleur"
            </p>
            <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-2xl mx-auto drop-shadow-md px-4">
              Chacun progresse et élève les autres. Transformer nos efforts communs en résultats concrets pour un avenir meilleur.
            </p>
            <div className="pt-4 md:pt-6">
              <Button
                size="lg"
                className="transform transition-all duration-300 hover:scale-105"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>

        {/* Indicateurs */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                currentIndex === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  )
}