// components/election/election-timer.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ElectionTimerProps {
  endDate: Date
  onComplete: () => void
}

export const ElectionTimer = ({ endDate, onComplete }: ElectionTimerProps) => {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    let animationId: number
    let lastTimestamp = 0

    const updateTimer = (timestamp: number) => {
      // Mettre à jour toutes les secondes environ
      if (timestamp - lastTimestamp >= 1000) {
        lastTimestamp = timestamp

        const now = new Date()
        const remaining = endDate.getTime() - now.getTime()

        if (remaining <= 0) {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          onComplete()
          return
        }

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

        setTimeRemaining((prev) => {
          // Ne mettre à jour que si les valeurs changent
          if (
            prev &&
            prev.days === days &&
            prev.hours === hours &&
            prev.minutes === minutes &&
            prev.seconds === seconds
          ) {
            return prev
          }
          return { days, hours, minutes, seconds }
        })
      }

      animationId = requestAnimationFrame(updateTimer)
    }

    animationId = requestAnimationFrame(updateTimer)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [endDate, onComplete])

  if (!timeRemaining) {
    return (
      <Card className="text-center py-8 md:py-12">
        <CardContent className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10">
            <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold">Chargement...</h3>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { days, hours, minutes, seconds } = timeRemaining


  return (
    <>
      <div className="flex items-center py-7 gap-x-2">
        <Button onClick={() => router.back()}>
          <ArrowLeft /> Retour
        </Button>
        <Button onClick={() => router.forward()}>
          Suvant <ArrowRight />
        </Button>
      </div>
      <Card className="text-center py-8 md:py-12">
        <CardContent className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10">
            <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold">Résultats bientôt disponibles</h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Les résultats seront dévoilés automatiquement à la fin de l'élection
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-center">
            {days > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
                <div className="text-2xl md:text-3xl font-bold text-primary">{days}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Jours</div>
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-primary">{hours}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Heures</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-primary">{minutes}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
              <div className="text-2xl md:text-3xl font-bold text-primary">{seconds}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Secondes</div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Élection en cours · {new Date(endDate).toLocaleDateString("fr-FR")}
          </p>
        </CardContent>
      </Card></>
  )
}