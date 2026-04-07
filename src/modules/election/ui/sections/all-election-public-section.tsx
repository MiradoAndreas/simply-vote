"use client"
import { useTRPC } from '@/trpc/client'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ElectionGrid } from '../components/election-grid'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ElectionGridPublic } from '../components/election-grid-public'

export const AllElectionPublicSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>

        <AllElectionPublicSectionSuspense />

      </ErrorBoundary>
    </Suspense>
  )
}

const AllElectionPublicSectionSuspense = () => {
  const trpc = useTRPC()

  const { data: elections } = useSuspenseQuery(
    trpc.election.getAllElection.queryOptions()
  )

  return (
    <div className="space-y-6 pt-10">
      {/* En-tête avec compteur */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Toutes les élections</h2>
          <p className="text-muted-foreground mt-1">
            {elections.length} élection{elections.length > 1 ? 's' : ''} disponible{elections.length > 1 ? 's' : ''}
          </p>

        </div>

      </div>

      {/* Grille des élections */}
      <ElectionGridPublic elections={elections} />
    </div>
  )
}