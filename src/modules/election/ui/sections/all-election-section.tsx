// app/test/all-election-section.tsx
"use client"

import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ArrowLeft, ArrowRight, Loader2, VoteIcon } from 'lucide-react'
import { ElectionGrid } from '../components/election-grid'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ElectionsLoadingSkeleton } from './all-election-public-section'


export const AllElectionSection = () => {
  return (
    <Suspense fallback={
      <ElectionsLoadingSkeleton />
    }>
      <ErrorBoundary fallback={
        <div className="text-center py-12">
          <p className="text-destructive">Une erreur est survenue lors du chargement des élections</p>
        </div>
      }>
        <AllElectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const AllElectionSuspense = () => {
  const trpc = useTRPC()

  const { data: elections } = useSuspenseQuery(
    trpc.election.getAllElection.queryOptions()
  )
  const router = useRouter()

  return (
    <div className="space-y-6 pt-10">
      {/* En-tête avec compteur */}
      <div className='flex items-center gap-x-2'>
        <Button onClick={() => router.back()}>
          <ArrowLeft /> Retour
        </Button>
        <Button onClick={() => router.forward()}>
          Suvant <ArrowRight />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Toutes les élections</h2>
          <p className="text-muted-foreground mt-1">
            {elections.length} élection{elections.length > 1 ? 's' : ''} disponible{elections.length > 1 ? 's' : ''}
          </p>
        </div>

      </div>

      {/* Grille des élections */}
      <ElectionGrid elections={elections} />
    </div>
  )
}