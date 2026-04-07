"use client"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
export const ClientGreeting = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <ClientGreetingSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const ClientGreetingSuspense = () => {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(
    trpc.hello.queryOptions({
      text: "SimplyVote",
    })
  )

  return (
    <p className="text-2xl text-primary">
      {data.greeting}
    </p>
  )
}