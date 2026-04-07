// components/election/vote-status.tsx
"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface VoteStatusProps {
  electionId: string
}

export const VoteStatus = ({ electionId }: VoteStatusProps) => {
  const trpc = useTRPC()

  const { data: voteStatus, isLoading } = useQuery(
    trpc.election.hasUserVoted.queryOptions({ electionId })
  )

  if (isLoading) return null

  if (voteStatus?.hasVoted) {
    return (
      <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className="h-3 w-3" />
        Vous avez déjà voté
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3 w-3" />
      Vous n'avez pas encore voté
    </Badge>
  )
}