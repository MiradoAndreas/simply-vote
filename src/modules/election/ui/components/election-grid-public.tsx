// components/election/election-grid.tsx
"use client"


import { VoteIcon } from "lucide-react"
import { ElectionCardPublic } from "./election-card-public"

interface ElectionGridProps {
  elections: Array<{
    id: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    isActive: boolean
    isPublic: boolean
    maxChoices: number
    createdAt: Date
  }>
  isResult: boolean
}

export const ElectionGridPublic = ({ elections, isResult }: ElectionGridProps) => {
  if (elections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <VoteIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucune élection</h3>
        <p className="text-muted-foreground">
          Aucune élection n&apos;a été créée pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {elections.map((election) => (
        <ElectionCardPublic key={election.id} election={election} isResult={isResult} />
      ))}
    </div>
  )
}