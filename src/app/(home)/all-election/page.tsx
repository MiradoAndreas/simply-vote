import { requireAdmin } from "@/lib/require-admin"
import { AllElectionView } from "@/modules/election/ui/views/all-election-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"


const Page = async () => {
  await requireAdmin()
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