import { AllElectionPublicView } from '@/modules/election/ui/views/all-election-public-view'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { Metadata } from "next"




export const metadata: Metadata = {
  title: "Resultats"
}

const page = async () => {
  prefetch(
    trpc.election.getAllElectionPublic.queryOptions()
  )
  return (
    <HydrateClient>
      <AllElectionPublicView isResult={true} />
    </HydrateClient>
  )
}

export default page