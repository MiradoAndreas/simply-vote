import { AllElectionView } from "@/modules/election/ui/views/all-election-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"


const Page = () => {
  prefetch(
    trpc.election.getAllElection.queryOptions()
  )

  return (
    <HydrateClient>
      <AllElectionView />
    </HydrateClient>
  )
}

export default Page