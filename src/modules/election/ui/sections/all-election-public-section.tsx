"use client"
import { useTRPC } from '@/trpc/client'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ElectionGrid } from '../components/election-grid'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ElectionGridPublic } from '../components/election-grid-public'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AllElectionPublicSectionProps {
  isResult: boolean
}

export const AllElectionPublicSection = ({ isResult }: AllElectionPublicSectionProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>

        <AllElectionPublicSectionSuspense isResult={isResult} />

      </ErrorBoundary>
    </Suspense>
  )
}

const AllElectionPublicSectionSuspense = ({ isResult }: AllElectionPublicSectionProps) => {
  const trpc = useTRPC()
  const router = useRouter()
  const { data: elections } = useSuspenseQuery(
    trpc.election.getAllElectionPublic.queryOptions()
  )

  return (
    <div className="space-y-6 pt-10">
      {/* En-tête avec compteur */}
      <div className="flex flex-col gap-y-5">
        <div className='flex items-center gap-x-2'>
          <Button onClick={() => router.back()}>
            <ArrowLeft /> Retour
          </Button>
          <Button onClick={() => router.forward()}>
            Suvant <ArrowRight />
          </Button>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Toutes les élections</h2>
          <p className="text-muted-foreground mt-1">
            {elections.length} élection{elections.length > 1 ? 's' : ''} disponible{elections.length > 1 ? 's' : ''}
          </p>

        </div>


      </div>

      {/* Grille des élections */}
      <ElectionGridPublic elections={elections} isResult={isResult} />
    </div>
  )
}