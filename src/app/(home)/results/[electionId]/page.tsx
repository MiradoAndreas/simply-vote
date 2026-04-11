
export const dynamic = "force-dynamic"

import { AllResultsPublicByElectionIdView } from "@/modules/election/ui/views/all-results-public-by-election-id-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"


interface PageProps {
  params: Promise<{
    electionId: string
  }>
}



const Page = async ({ params }: PageProps) => {
  const { electionId } = await params
  prefetch(
    trpc.election.getElectionResults.queryOptions({
      electionId: electionId
    })
  )


  return (
    <HydrateClient>
      <AllResultsPublicByElectionIdView electionId={electionId} />
    </HydrateClient>
  )
}

export default Page