"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface AllCandidatesSuspenseProps {
  electionId: string;
}

const CandidateCardSkeleton = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar Skeleton */}
          <Skeleton className="h-16 w-16 rounded-full" />

          {/* Infos Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CandidatesGridSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <CandidateCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export const AllCandidates = ({ electionId }: AllCandidatesSuspenseProps) => {
  return (
    <Suspense fallback={<CandidatesGridSkeleton />}>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <AllCandidatesSuspense electionId={electionId} />
      </ErrorBoundary>
    </Suspense>
  )
}


const AllCandidatesSuspense = ({ electionId }: AllCandidatesSuspenseProps) => {
  const trpc = useTRPC()
  const { data: candidates } = useSuspenseQuery(
    trpc.election.getAllCandidates.queryOptions({
      electionId: electionId
    })
  )
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {candidates.length} candidat{candidates.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/candidates/${candidate.imageUrl}.png`}
                    alt={candidate.name}
                  />
                  <AvatarFallback className="text-lg">
                    {candidate.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {candidate.name}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  {candidate.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {candidate.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

  )

}