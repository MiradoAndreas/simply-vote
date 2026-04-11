"use client"
import { useTRPC } from '@/trpc/client'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useSuspenseQuery } from '@tanstack/react-query'
import { ElectionGridPublic } from '../components/election-grid-public'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface AllElectionPublicSectionProps {
  isResult: boolean
}

export const ElectionsLoadingSkeleton = () => {
  return (
    <div className="space-y-6 pt-10">
      {/* En-tête avec compteur */}
      <div className="flex flex-col gap-y-5">
        <div className='flex items-center gap-x-2'>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      {/* Grille des élections skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <ElectionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

const ElectionCardSkeleton = () => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export const AllElectionPublicSection = ({ isResult }: AllElectionPublicSectionProps) => {
  return (
    <Suspense fallback={<ElectionsLoadingSkeleton />}>
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