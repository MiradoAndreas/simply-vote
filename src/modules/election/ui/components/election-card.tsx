// components/election/election-card.tsx
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Vote, Lock, Unlock, Clock, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ElectionCardProps {
  election: {
    id: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    isActive: boolean
    isPublic: boolean
    maxChoices: number
    createdAt: Date
  }
}

export const ElectionCard = ({ election }: ElectionCardProps) => {
  const router = useRouter()

  const startDate = new Date(election.startDate)
  const endDate = new Date(election.endDate)
  const now = new Date()

  const isOngoing = startDate <= now && endDate >= now
  const isUpcoming = startDate > now
  const isFinished = endDate < now

  const getStatusBadge = () => {
    if (isOngoing) {
      return <Badge className="bg-green-500 hover:bg-green-600">En cours</Badge>
    }
    if (isUpcoming) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">À venir</Badge>
    }
    if (isFinished) {
      return <Badge variant="secondary">Terminée</Badge>
    }
  }

  const getStatusColor = () => {
    if (isOngoing) return "border-l-4 border-l-green-500"
    if (isUpcoming) return "border-l-4 border-l-blue-500"
    return "border-l-4 border-l-gray-500"
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 group ${getStatusColor()}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              {election.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {election.description || "Aucune description"}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Début : {format(startDate, "PPP", { locale: fr })}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Fin : {format(endDate, "PPP", { locale: fr })}</span>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-sm">
            <Vote className="h-4 w-4 text-primary" />
            <span>{election.maxChoices} choix max</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            {election.isPublic ? (
              <>
                <Unlock className="h-4 w-4 text-green-500" />
                <span>Publique</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-red-500" />
                <span>Privée</span>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full group"
          asChild
        >
          <Link href={`/all-election/${election.id}`} className="flex items-center gap-2">
            Editer
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
        </Button>
      </CardFooter>
    </Card>
  )
}