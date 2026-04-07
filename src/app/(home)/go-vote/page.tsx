import { AllElectionPublicView } from "@/modules/election/ui/views/all-election-public-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

const Page = () => {
  prefetch(
    trpc.election.getPublicAllElection.queryOptions()
  )
  return (
    <HydrateClient>
      <AllElectionPublicView />
    </HydrateClient>
  )
}

export default Page