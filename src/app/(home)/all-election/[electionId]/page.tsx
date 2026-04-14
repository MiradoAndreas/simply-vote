import { DetailsElectionView } from "@/modules/election/ui/views/details-election-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    electionId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { electionId } = await params
  prefetch(
    trpc.election.getAllCandidates.queryOptions({
      electionId: electionId
    })
  )
  return (
    <HydrateClient>
      <DetailsElectionView electionId={electionId} />
    </HydrateClient>
  )
}

export default Page