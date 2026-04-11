// components/kintana/ceo-section-circle.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

interface CEOSectionCircleProps {
  name: string
  title: string
  message: string
  imageSrc: string

}

export const CEOSectionCircle = ({
  name,
  title,
  message,
  imageSrc,

}: CEOSectionCircleProps) => {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 md:p-8 lg:p-10">
              {/* Image circulaire */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 ring-4 ring-primary/20">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-cover object-top"
                      style={
                        {
                          objectPosition: 'top 20%'
                        }
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Guillemet */}
                <Quote className="h-8 w-8 text-primary/40 mb-4" />

                {/* Message */}
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed italic max-w-2xl">
                  "{message}"
                </p>

                {/* Infos */}
                <div className="mt-8">
                  <h3 className="text-xl md:text-2xl font-bold">{name}</h3>
                  <p className="text-primary text-sm md:text-base mt-1">{title}</p>

                  <Button className="mt-6">
                    En savoir plus sur Geneto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}